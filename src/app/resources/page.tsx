import React from 'react';
import Topbar from '@/components/Topbar';
import { BookOpen, Users, FileText, ArrowRight } from 'lucide-react';

export default function ResourcesPage() {
  const resources = [
    {
      title: 'Modules',
      description: 'Access comprehensive study materials, coding tutorials, and technical guides designed for core engineering concepts.',
      icon: <BookOpen className="w-8 h-8 text-[#0066FF]" />,
      bg: 'bg-blue-50',
      tag: 'Learning Path'
    },
    {
      title: 'Interview Prep',
      description: 'Practice with past interview questions, mock technical rounds, and behavioral interview strategies for top tech companies.',
      icon: <Users className="w-8 h-8 text-violet-600" />,
      bg: 'bg-violet-50',
      tag: 'Practice'
    },
    {
      title: 'Resume Guidelines',
      description: 'Step-by-step guides, verified templates, and actionable tips to build an ATS-friendly resume that gets you shortlisted.',
      icon: <FileText className="w-8 h-8 text-amber-600" />,
      bg: 'bg-amber-50',
      tag: 'Career'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
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
            <div 
              key={index}
              className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:border-[#0066FF]/30 hover:shadow-[0_8px_30px_rgb(0,102,255,0.08)] transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden"
            >
              {/* Background gradient effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0066FF]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${resource.bg} flex items-center justify-center`}>
                    {resource.icon}
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                    {resource.tag}
                  </span>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-[#0066FF] transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-8 flex-1">
                  {resource.description}
                </p>

                <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors">
                  Explore {resource.title}
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
