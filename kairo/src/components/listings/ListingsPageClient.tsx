'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Lock, Sparkles, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/ui/AuthModal';
import FilterSidebar from './FilterSidebar';
import InternshipList from './InternshipList';
import ErrorBanner from './ErrorBanner';
import Pagination from './Pagination';
import type { FilterState } from './FilterSidebar';
import { parseApiPostedDate } from '@/lib/internshipData';
import type { Internship } from '@/lib/internshipData';
import {
  buildAvailableLocations,
  buildAvailableSkills,
  fetchInternships,
  isDeadlineExpired,
  parseStipendValue,
  sortByPostedDateDesc,
} from '@/lib/internshipListings';

function filterInternships(internships: Internship[], filters: FilterState): Internship[] {
  return internships.filter((internship) => {
    if (isDeadlineExpired(internship.deadline)) return false;

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const matchesKeyword =
        internship.title.toLowerCase().includes(keyword) ||
        internship.company.toLowerCase().includes(keyword) ||
        internship.description.toLowerCase().includes(keyword) ||
        internship.skills.some((skill) => skill.toLowerCase().includes(keyword));

      if (!matchesKeyword) return false;
    }

    if (filters.location !== 'All Locations') {
      const locations = internship.locations ?? [internship.location];
      const matchesLocation = locations.some((location) => {
        const normalizedLocation = location.toLowerCase();
        const filterLocation = filters.location.toLowerCase();

        if (filterLocation === 'work from home' || filterLocation === 'remote') {
          return normalizedLocation === 'work from home' || normalizedLocation === 'remote';
        }

        return normalizedLocation === filterLocation;
      });

      if (!matchesLocation) return false;
    }

    if (filters.skills.length > 0) {
      const internshipSkills = internship.skills.map((skill) => skill.toLowerCase());
      const matchesAllSkills = filters.skills.every((skill) =>
        internshipSkills.includes(skill.toLowerCase())
      );

      if (!matchesAllSkills) return false;
    }

    if (filters.duration !== 'all') {
      const duration = internship.duration.toLowerCase();
      let months = 0;

      if (duration.includes('month')) {
        months = Number.parseInt(duration.replace(/[^0-9]/g, ''), 10);
      } else if (duration.includes('week')) {
        const weeks = Number.parseInt(duration.replace(/[^0-9]/g, ''), 10);
        months = Math.round(weeks / 4);
      }

      if (filters.duration === '1-2') {
        if (months < 1 || months > 2) return false;
      } else if (filters.duration === '3-4') {
        if (months < 3 || months > 4) return false;
      } else if (filters.duration === '5-6') {
        if (months < 5 || months > 6) return false;
      } else if (filters.duration === '6+') {
        if (months < 6) return false;
      }
    }

    if (filters.posted !== 'all') {
      const postedDate = parseApiPostedDate(internship.postedDate);
      if (!postedDate) return false;

      const windowMs =
        filters.posted === '24h'
          ? 24 * 60 * 60 * 1000
          : filters.posted === '7d'
            ? 7 * 24 * 60 * 60 * 1000
            : 30 * 24 * 60 * 60 * 1000;

      if (postedDate.getTime() < Date.now() - windowMs) return false;
    }

    if (filters.titleCategory) {
      if (!internship.title.toLowerCase().includes(filters.titleCategory.toLowerCase())) {
        return false;
      }
    }

    if (filters.category !== 'all') {
      if (internship.category.toLowerCase() !== filters.category.toLowerCase()) return false;
    }

    if (filters.type !== 'all') {
      if (internship.type.toLowerCase() !== filters.type.toLowerCase()) return false;
    }

    if (filters.stipendMin !== null) {
      const minStipend = internship.minStipend ?? parseStipendValue(internship.stipend);
      if (minStipend < filters.stipendMin) return false;
    }

    return true;
  });
}

export const DEFAULT_FILTERS: FilterState = {
  keyword: '',
  location: 'All Locations',
  stipendMin: null,
  stipendMax: null,
  skills: [],
  category: 'all',
  type: 'all',
  duration: 'all',
  posted: 'all',
  titleCategory: '',
};

const ITEMS_PER_PAGE = 12;

export default function ListingsPageClient() {
  const { user, loading: authLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [allInternships, setAllInternships] = useState<Internship[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const loadInternships = useCallback(async (showToast = false, signal?: AbortSignal) => {
    setIsLoading(true);
    setHasError(false);

    try {
      const data = await fetchInternships(signal);
      setAllInternships(data);
      if (showToast) toast.success('Listings refreshed successfully');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    void loadInternships(false, controller.signal);
    return () => controller.abort();
  }, [loadInternships, user]);

  const handleRetry = useCallback(() => {
    void loadInternships(true);
  }, [loadInternships]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    toast.info('All filters cleared');
  }, []);

  const availableLocations = useMemo(
    () => buildAvailableLocations(allInternships),
    [allInternships]
  );

  const availableSkills = useMemo(() => buildAvailableSkills(allInternships), [allInternships]);

  const filteredAndSorted = useMemo(() => {
    const filtered = filterInternships(allInternships, filters);
    return sortByPostedDateDesc(filtered);
  }, [allInternships, filters]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

  const paginatedInternships = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  /* ── Auth loading spinner ── */
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 rounded-full border-2 border-newton-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  /* ── Auth gate wall ── */
  if (!user) {
    return (
      <>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

        <div className="relative mt-12 overflow-hidden">
          {/* Blurred ghost cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 select-none pointer-events-none opacity-40 blur-[3px]">
            {[
              { role: 'Full Stack Developer', company: 'Razorpay', stipend: '₹25K/mo', tag: 'bg-blue-50 text-blue-700' },
              { role: 'UI/UX Designer', company: 'Swiggy', stipend: '₹18K/mo', tag: 'bg-violet-50 text-violet-700' },
              { role: 'Data Analyst', company: 'CRED', stipend: '₹20K/mo', tag: 'bg-amber-50 text-amber-700' },
              { role: 'Product Management', company: 'Meesho', stipend: '₹30K/mo', tag: 'bg-green-50 text-green-700' },
              { role: 'Backend Engineer', company: 'Zepto', stipend: '₹22K/mo', tag: 'bg-red-50 text-red-700' },
              { role: 'ML Intern', company: 'Google', stipend: '₹50K/mo', tag: 'bg-teal-50 text-teal-700' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={16} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{card.role}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{card.company}</p>
                    <span className={`mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.tag}`}>
                      {card.stipend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient fade + lock overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-24">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-newton-blue-50 border border-newton-blue-200 text-newton-blue-600 text-xs font-semibold mb-5">
              <Sparkles size={11} />
              Sign in to unlock all listings
            </div>

            <div className="w-16 h-16 rounded-2xl bg-newton-blue-500 shadow-[0_12px_30px_-8px_rgba(0,102,255,0.5)] flex items-center justify-center mb-6">
              <Lock size={28} className="text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight max-w-sm">
              Create a free account to view opportunities
            </h2>
            <p className="mt-3 text-sm text-gray-500 max-w-xs leading-relaxed">
              Sign in to browse verified internship listings, filter by skills & location, and apply in one click.
            </p>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-newton-blue-500 text-white font-black text-sm tracking-wide hover:bg-newton-blue-600 transition-all shadow-[0_8px_24px_-6px_rgba(0,102,255,0.5)] active:scale-[0.98]"
            >
              Sign in / Create account
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Authenticated view ── */
  return (
    <div className="relative">
      <Toaster position="top-center" richColors />

      <div className="flex flex-col gap-12">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          totalResults={filteredAndSorted.length}
          availableLocations={availableLocations}
          availableSkills={availableSkills}
        />

        <div className="flex-1">
          {hasError ? (
            <ErrorBanner onRetry={handleRetry} />
          ) : (
            <>
              <InternshipList
                internships={paginatedInternships}
                isLoading={isLoading}
                onResetFilters={handleResetFilters}
              />

              {!isLoading && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

