'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/ui/AuthModal';
import ExploreModal from '@/components/ui/ExploreModal';
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
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
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
    const controller = new AbortController();
    void loadInternships(false, controller.signal);
    return () => controller.abort();
  }, [loadInternships]);

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

  // Intercept pagination — page 2+ requires login
  const handlePageChange = useCallback((page: number) => {
    if (page > 1 && !user) {
      setIsExploreModalOpen(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user]);

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


  return (
    <div className="relative">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ExploreModal 
        isOpen={isExploreModalOpen} 
        onClose={() => setIsExploreModalOpen(false)} 
        onContinue={() => setIsAuthModalOpen(true)} 
      />
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
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

