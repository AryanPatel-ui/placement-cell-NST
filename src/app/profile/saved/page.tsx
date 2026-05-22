'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchInternships } from '@/lib/internshipListings';
import type { Internship } from '@/lib/internshipData';
import InternshipCard from '@/components/listings/InternshipCard';

export default function SavedInternshipsPage() {
  const { user, savedInternships: savedIds } = useAuth();
  const [savedInternships, setSavedInternships] = useState<Internship[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSaved = async () => {
      try {
        // Fetch real internships from API
        const allInternships = await fetchInternships();

        if (active) {
          const filtered = allInternships.filter(
            (internship) => savedIds?.includes(internship.id) || savedIds?.includes(internship.applyUrl)
          );
          setSavedInternships(filtered);
          setIsLoaded(true);
        }
      } catch (e) {
        console.error('Error loading saved internships', e);
        if (active) setIsLoaded(true);
      }
    };

    loadSaved();

    return () => {
      active = false;
    };
  }, [savedIds]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-newton-blue-100 border-t-newton-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <Bookmark size={48} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          Sign in to view saved internships
        </h1>
        <p className="text-gray-500 mb-6 max-w-md">
          You need to be signed in to access your saved opportunities.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-newton-blue-500 text-white font-bold tracking-wide hover:bg-newton-blue-600 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 mb-8 relative z-10 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-newton-blue-500 transition-colors mb-6 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={14} />
            Back to listings
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-newton-blue-50 text-newton-blue-600 flex items-center justify-center shrink-0 border-2 border-newton-blue-100">
              <Bookmark size={28} className="fill-current" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                Saved Internships
              </h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-xl">
                {"Review and apply to the opportunities you've bookmarked."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {savedInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {savedInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-gray-100 p-12 text-center flex flex-col items-center max-w-2xl mx-auto shadow-[0_1px_2px_rgba(17,24,39,0.03)] mt-8">
            <div className="w-20 h-20 rounded-[24px] bg-gray-50 text-gray-300 flex items-center justify-center mb-6">
              <Bookmark size={32} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
              No saved internships yet
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              When you find an interesting opportunity, click the bookmark icon to save it here for
              later review.
            </p>
            <Link
              href="/"
              className="px-8 py-4 rounded-2xl bg-newton-blue-500 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-newton-blue-600 transition-all shadow-[0_8px_20px_-6px_rgba(0,102,255,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Internships
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
