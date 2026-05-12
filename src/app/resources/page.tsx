'use client';

import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { BookOpen, Users, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ExploreModal from '@/components/ui/ExploreModal';
import AuthModal from '@/components/ui/AuthModal';

export default function ResourcesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setIsExploreModalOpen(true);
    } else if (user) {
      setIsExploreModalOpen(false);
      setIsAuthModalOpen(false);
    }
  }, [user, loading]);

  const handleCloseExplore = () => {
    setIsExploreModalOpen(false);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
  };

  const resources = [
    {
      title: 'Modules',
      description: 'Access comprehensive study materials, coding tutorials, and technical guides designed for core engineering concepts.',
      icon: <BookOpen className="w-8 h-8 text-[#0066FF]" />,
      bg: 'bg-blue-50',
      tag: 'Learning Path',
      href: 'https://pastoral-homburg-015.notion.site/Preparation-DOC-310cab9a2df3804ba3a4c0c15694cafa'
    },
    {
      title: 'Interview Prep',
      description: 'Practice with past interview questions, mock technical rounds, and behavioral interview strategies for top tech companies.',
      icon: <Users className="w-8 h-8 text-violet-600" />,
      bg: 'bg-violet-50',
      tag: 'Practice',
      href: 'https://docs.google.com/document/d/1sniw-RgYZN-02O-Ea972528WUN1lAVeK42FPGgAgL0c/edit?usp=sharing'
    },
    {
      title: 'Resume Guidelines',
      description: 'Step-by-step guides, verified templates, and actionable tips to build an ATS-friendly resume that gets you shortlisted.',
      icon: <FileText className="w-8 h-8 text-amber-600" />,
      bg: 'bg-amber-50',
      tag: 'Career',
      href: 'https://docs.google.com/document/d/13rm5MY5jteXYVeAnLfRFljyoYYFllzxP0aqITH1bN2E/edit?usp=drivesdk'
    }
  ];

  if (loading) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      
      <ExploreModal 
        isOpen={isExploreModalOpen} 
        onClose={handleCloseExplore} 
        onContinue={() => {
          setIsExploreModalOpen(false);
          setIsAuthModalOpen(true);
        }} 
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuth} />
      
      <main className={`max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20 transition-all duration-300 ${!user ? 'blur-md pointer-events-none select-none opacity-50' : ''}`}>
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0066FF] text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
            New resources added weekly
          </div>
          <h1 className="text-[2.25rem] sm:text-[3rem] font-black text-[#1A1D23] tracking-[-0.02em] leading-[1.1]">
            Career <span className="text-[#0066FF]">Resources</span>
          </h1>
          <p className="mt-4 text-[1rem] sm:text-[1.125rem] text-[#6B7280] font-medium leading-[1.7]">
            Everything you need to upskill, prepare for interviews, and land your dream role.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <article 
              key={index}
              className="bg-white rounded-[32px] border border-gray-100 shadow-[0_1px_2px_rgba(17,24,39,0.03)] p-5 sm:p-6 lg:p-8 hover:shadow-[0_0_0_1px_rgba(17,24,39,0.05),0_18px_38px_rgba(0,102,255,0.05)] transition-all duration-200 ease-in-out group flex flex-col h-full relative overflow-hidden"
            >
              {/* Decorative Brand Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110" />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[20px] bg-white flex items-center justify-center border-2 border-gray-50 shadow-sm group-hover:shadow-[0_8px_18px_rgba(0,102,255,0.08)] transition-all duration-300 overflow-hidden">
                      <div className={`w-full h-full rounded-[16px] sm:rounded-[18px] ${resource.bg} flex items-center justify-center`}>
                        {resource.icon}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                        {resource.tag}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-1 leading-tight group-hover:text-[#0066FF] transition-colors line-clamp-2">
                        {resource.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-8 flex-1">
                  {resource.description}
                </p>
              </div>

              {/* Bottom Section: CTA */}
              <div className="mt-auto pt-6 sm:pt-8 border-t border-gray-50 flex justify-end relative z-10">
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#0066FF] transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-[#0066FF]/30 group/btn"
                >
                  Explore
                  <ArrowRight
                    size={14}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
