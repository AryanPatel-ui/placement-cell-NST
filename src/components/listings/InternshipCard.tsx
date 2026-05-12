'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  ExternalLink,
  Monitor,
  Server,
  Layers,
  Code,
  Brain,
  PenTool,
  Briefcase,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import type { Internship } from '@/lib/internshipData';
import { useAuth } from '@/context/AuthContext';

interface InternshipCardProps {
  internship: Internship;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const year = d.getFullYear().toString().slice(-2);
  return `${month}'${year}`;
}

function getTimeAgo(dateStr: string): string {
  if (!dateStr) return 'Recently';

  const posted = new Date(dateStr);
  const now = new Date(); // ✅ use current time

  const diffMs = now.getTime() - posted.getTime();

  if (diffMs < 0) return 'Recently'; // handle future dates safely

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

function getRoleIcon(title: string) {
  const normalizedTitle = title.toLowerCase();

  if (
    normalizedTitle.includes('frontend') ||
    normalizedTitle.includes('front end') ||
    normalizedTitle.includes('html') ||
    normalizedTitle.includes('css') ||
    normalizedTitle.includes('web')
  ) {
    return Monitor;
  }

  if (normalizedTitle.includes('backend') || normalizedTitle.includes('server')) {
    return Server;
  }

  if (normalizedTitle.includes('full stack')) {
    return Layers;
  }

  if (normalizedTitle.includes('python')) {
    return Code;
  }

  if (
    normalizedTitle.includes('ai') ||
    normalizedTitle.includes('ml') ||
    normalizedTitle.includes('machine learning')
  ) {
    return Brain;
  }

  if (
    normalizedTitle.includes('design') ||
    normalizedTitle.includes('ui') ||
    normalizedTitle.includes('ux')
  ) {
    return PenTool;
  }

  return Briefcase;
}

export default function InternshipCard({ internship }: InternshipCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const RoleIcon = getRoleIcon(internship.title);
  const displaySkills = internship.skills.slice(0, 2);

  return (
    <article className="bg-white rounded-[32px] border border-gray-100 shadow-[0_1px_2px_rgba(17,24,39,0.03)] p-5 sm:p-6 lg:p-8 hover:shadow-[0_0_0_1px_rgba(17,24,39,0.05),0_18px_38px_rgba(0,102,255,0.05)] transition-all duration-200 ease-in-out group flex flex-col h-full relative overflow-hidden">
      {/* Decorative Brand Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-newton-blue-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110" />

      {/* Top Section: Company Logo/Initial and Name */}
      <div className="flex items-start justify-between mb-8 relative z-10 gap-4">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[20px] bg-white flex items-center justify-center border-2 border-gray-50 shadow-sm group-hover:shadow-[0_8px_18px_rgba(0,102,255,0.08)] transition-all duration-300 overflow-hidden shrink-0">
            <div className="w-full h-full rounded-[16px] sm:rounded-[18px] bg-newton-blue-50 text-newton-blue-600 flex items-center justify-center">
              <RoleIcon size={26} strokeWidth={2} className="sm:w-7 sm:h-7" />
            </div>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase truncate">
                {internship.company}
              </span>
              {internship.isNew && (
                <span className="px-2 py-0.5 rounded-full bg-newton-orange-500 text-white text-[8px] font-black uppercase tracking-widest shrink-0">
                  NEW
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-1 leading-tight group-hover:text-newton-blue-500 transition-colors truncate">
              {internship.title}
            </h3>
          </div>
        </div>
        
        {user && (
          <button 
            onClick={(e) => { e.preventDefault(); setIsSaved(!isSaved); }}
            className={`p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 flex items-center justify-center shrink-0 ${
              isSaved 
                ? 'bg-[#0066FF]/10 border-[#0066FF]/30 text-[#0066FF]' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
            }`}
            title={isSaved ? "Unsave" : "Save"}
          >
            <Bookmark size={18} className={isSaved ? 'fill-current' : ''} />
          </button>
        )}
      </div>

      {/* Skills Section - NEW */}
      {displaySkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 relative z-10">
          {displaySkills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-100 group-hover:bg-newton-blue-50 group-hover:border-newton-blue-100 group-hover:text-newton-blue-600 transition-colors"
            >
              {skill}
            </span>
          ))}
          {internship.skills.length > 2 && (
            <span className="px-2 py-1.5 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
              +{internship.skills.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Grid Section: Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-newton-blue-50/50 flex items-center justify-center shrink-0 group-hover:bg-newton-blue-50 transition-colors">
            <MapPin size={16} className="text-newton-blue-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black tracking-widest text-gray-300 uppercase leading-none mb-1">
              Location
            </span>
            <span className="text-xs font-bold text-gray-600 truncate">
              {internship.location.toLowerCase() === 'remote'
                ? 'Work From Home'
                : internship.location}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-newton-orange-50/50 flex items-center justify-center shrink-0 group-hover:bg-newton-orange-50 transition-colors">
            <IndianRupee size={16} className="text-newton-orange-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black tracking-widest text-gray-300 uppercase leading-none mb-1">
              Stipend
            </span>
            <span className="text-xs font-bold text-gray-600 truncate">{internship.stipend}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
            <Clock size={16} className="text-gray-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black tracking-widest text-gray-300 uppercase leading-none mb-1">
              Duration
            </span>
            <span className="text-xs font-bold text-gray-600 truncate">{internship.duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
            <Calendar size={16} className="text-gray-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black tracking-widest text-gray-300 uppercase leading-none mb-1">
              Deadline
            </span>
            <span className="text-xs font-bold text-gray-600 truncate">
              {formatDate(internship.deadline)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Time and CTA */}
      <div className="mt-auto pt-6 sm:pt-8 border-t border-gray-50 flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-2 w-full justify-end">
          {user && (
              <button 
                onClick={(e) => { e.preventDefault(); setIsApplied(!isApplied); }}
                className={`flex-1 sm:flex-none p-3 sm:px-4 sm:py-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] ${
                  isApplied 
                    ? 'bg-green-50 border-green-200 text-green-600' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                title={isApplied ? "Mark as Unapplied" : "Mark as Applied"}
              >
                <CheckCircle2 size={14} className={isApplied ? 'fill-current' : ''} />
                <span>{isApplied ? 'Applied' : 'Mark'}</span>
              </button>
          )}

          <a
            href={internship.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 p-3 sm:px-6 lg:px-8 sm:py-3.5 bg-gray-900 text-white rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-newton-blue-500 transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-newton-blue-100 group/btn shrink-0"
          >
            Apply
            <ExternalLink
              size={14}
              className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
            />
          </a>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          <span className="text-[10px] font-black shrink-0">POSTED</span>
          <span className="text-[10px] font-black uppercase tracking-widest truncate">
            {getTimeAgo(internship.postedDate)}
          </span>
        </div>
      </div>
    </article>
  );
}
