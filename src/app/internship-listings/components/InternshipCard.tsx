'use client';

import React, { useMemo } from 'react';
import AppImage from '@/components/ui/AppImage';
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import type { Internship } from '@/lib/internshipData';
import { parseDeadlineDate } from '@/lib/internshipListings';

interface InternshipCardProps {
  internship: Internship;
  isBookmarked: boolean;
  onToggleBookmark: (internshipUrl: string) => void;
}

function getDaysUntilDeadline(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = parseDeadlineDate(deadline);
  if (!deadlineDate) return Number.POSITIVE_INFINITY;

  deadlineDate.setHours(0, 0, 0, 0);
  const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function InternshipCard({
  internship,
  isBookmarked,
  onToggleBookmark,
}: InternshipCardProps) {
  const daysLeft = useMemo(() => getDaysUntilDeadline(internship.deadline), [internship.deadline]);
  const isUrgent = daysLeft <= 10 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

  const displaySkills = internship.skills.slice(0, 3);

  return (
    <article
      className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:shadow-newton-blue-100/20 hover:-translate-y-1 flex flex-col relative overflow-hidden ${
        isUrgent
          ? 'border-red-100'
          : isExpired
            ? 'border-gray-100 opacity-75'
            : 'border-gray-100 hover:border-newton-blue-200'
      }`}
    >
      {/* Brand Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-newton-blue-500 via-newton-orange-500 to-newton-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 flex-1 flex flex-col">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4 min-w-0">
            {/* Company logo */}
            <div className="w-14 h-14 rounded-2xl border border-gray-100 bg-white p-2 flex-shrink-0 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:border-newton-blue-100">
              <AppImage
                src={internship.companyLogo}
                alt={internship.companyLogoAlt}
                width={56}
                height={56}
                className="w-full h-full object-contain"
                fallbackSrc="/assets/images/no_image.png"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate leading-tight group-hover:text-newton-blue-600 transition-colors">
                {internship.title}
              </h3>
              <p className="text-sm font-semibold text-newton-blue-500 mt-1">
                {internship.company}
              </p>
            </div>
          </div>

          <button
            onClick={() => onToggleBookmark(internship.applyUrl)}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isBookmarked
                ? 'bg-newton-orange-50 text-newton-orange-500 shadow-inner'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            {isBookmarked ? (
              <BookmarkCheck size={18} fill="currentColor" />
            ) : (
              <Bookmark size={18} />
            )}
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-gray-400" />
            </div>
            <span className="text-xs font-medium truncate">
              {internship.location.toLowerCase() === 'remote'
                ? 'Work From Home'
                : internship.location}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <DollarSign size={14} className="text-gray-400" />
            </div>
            <span className="text-xs font-medium truncate">{internship.stipend}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Clock size={14} className="text-gray-400" />
            </div>
            <span className="text-xs font-medium truncate">
              {internship.duration || 'Flexible'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Calendar size={14} className="text-gray-400" />
            </div>
            <span className="text-xs font-medium truncate">
              Posted {formatDate(internship.postedDate)}
            </span>
          </div>
        </div>

        {/* Skills - New Section */}
        {displaySkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {displaySkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg bg-newton-blue-50 text-newton-blue-600 text-[10px] font-bold uppercase tracking-wider border border-newton-blue-100"
              >
                {skill}
              </span>
            ))}
            {internship.skills.length > 3 && (
              <span className="px-2 py-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                +{internship.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <div className="w-full h-full bg-newton-blue-100 flex items-center justify-center">
                    <Users size={10} className="text-newton-blue-500" />
                  </div>
                </div>
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {internship.openings} {internship.openings === 1 ? 'Opening' : 'Openings'}
            </span>
          </div>

          <a
            href={internship.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-newton-blue-600 text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-lg shadow-gray-200 hover:shadow-newton-blue-200 group/btn"
          >
            Apply
            <ExternalLink
              size={12}
              className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
            />
          </a>
        </div>
      </div>
    </article>
  );
}
