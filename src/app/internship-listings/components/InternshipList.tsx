import React from 'react';
import InternshipCard from './InternshipCard';
import EmptyState from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Internship } from '@/lib/internshipData';

interface InternshipListProps {
  internships: Internship[];
  isLoading: boolean;
  onResetFilters: () => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (internshipUrl: string) => void;
}

export default function InternshipList({
  internships,
  isLoading,
  onResetFilters,
  bookmarkedIds,
  onToggleBookmark,
}: InternshipListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={`card-skel-${i}`} />
        ))}
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <EmptyState
        title="No internships match your filters"
        description="Try broadening your search — adjust the category, location, or type filters to discover more opportunities."
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 animate-fade-in">
      {internships.map((internship) => (
        <InternshipCard
          key={internship.id}
          internship={internship}
          isBookmarked={bookmarkedIds.has(internship.id) || bookmarkedIds.has(internship.applyUrl)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}
