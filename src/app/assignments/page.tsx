'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { ClipboardList, ArrowLeft, Sparkles, FileText, Folder, Send, ArrowUpRight } from 'lucide-react';

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Topbar />

      <main className="flex-1 flex items-center justify-center max-w-7xl mx-auto px-6 md:px-8 py-20 w-full relative overflow-hidden">
        {/* Elegant ambient glow behind */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center z-0">
          <div className="w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-3xl animate-pulse" />
          <div className="w-[300px] h-[300px] rounded-full bg-newton-blue-500/5 blur-3xl animate-pulse delay-1000 -translate-x-20 translate-y-20" />
        </div>

        <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center">
          {/* Feature Icon Badge */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 rounded-[32px] bg-white border-2 border-gray-50 shadow-[0_12px_40px_-8px_rgba(139,92,246,0.12)] flex items-center justify-center relative z-10">
              <div className="w-20 h-20 rounded-[24px] bg-violet-50 flex items-center justify-center">
                <ClipboardList size={36} className="text-violet-600" />
              </div>
            </div>
            {/* Floating Sparkles Badge */}
            <div className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full bg-violet-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg animate-bounce">
              <Sparkles size={10} /> NEW
            </div>
          </div>

          {/* Badge Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100/80 text-violet-600 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
            Active Tasks
          </div>

          <h1 className="text-[2.5rem] sm:text-[3.5rem] font-black text-[#1A1D23] tracking-tight leading-[1.1]">
            Assignments
          </h1>

          <p className="mt-6 text-[1rem] sm:text-[1.125rem] text-[#6B7280] font-medium leading-[1.7] max-w-md">
            Work on real-world assignment problems, submit tasks, and receive detailed evaluation
            feedback and peer reviews.
          </p>

          <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-6 text-left">
            {/* Card 1: Document */}
            <Link 
              href="https://docs.google.com/document/d/1EaztHS8Fe4BKrbD2C7cP71a2E7GFsDkphQuqqXimOzk/edit?tab=t.0"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-3xl border-2 border-gray-100 hover:border-violet-200 hover:shadow-[0_20px_40px_-12px_rgba(139,92,246,0.15)] transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">DSA</h3>
              <p className="text-sm text-gray-500 font-medium mb-6 flex-1">Read the complete problem statement and guidelines for the current assignment.</p>
              <div className="text-sm font-bold text-violet-600 flex items-center gap-2 mt-auto">
                View Document <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Resources */}
            <Link 
              href="https://drive.google.com/drive/folders/10zZjZNJ54oK0vuBIYDyCQyHqnrzzryGN?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-3xl border-2 border-gray-100 hover:border-violet-200 hover:shadow-[0_20px_40px_-12px_rgba(139,92,246,0.15)] transition-all duration-300 group flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Folder size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Resource Folder</h3>
              <p className="text-sm text-gray-500 font-medium mb-6 flex-1">Access necessary assets, templates, and reference materials for your work.</p>
              <div className="text-sm font-bold text-violet-600 flex items-center gap-2 mt-auto">
                Open Drive <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </Link>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gray-900 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-violet-600 transition-all duration-300 shadow-[0_20px_35px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_35px_-10px_rgba(139,92,246,0.2)] active:scale-95 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/images/logo.png"
              alt="Kairo logo"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-none mb-1">Kairo</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-medium max-w-xs text-center sm:text-right leading-relaxed">
            Verified application links. Listings refreshed daily.
          </p>
        </div>
      </footer>
    </div>
  );
}
