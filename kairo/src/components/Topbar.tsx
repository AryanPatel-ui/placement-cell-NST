'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/ui/AuthModal';

const navLinks = [
  { label: 'SELF APPLY', href: '/' },
  { label: 'QUESTIONS', href: '/questions' },
  { label: 'FLASHCARDS', href: '#' },
  { label: 'ASSIGNMENTS', href: '#' },
  { label: 'EXPERIENCES', href: '#' },
  { label: 'RESOURCES', href: '#' },
];

export default function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'User';
  const photoURL = user?.photoURL;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="min-h-[72px] sm:min-h-[80px] lg:min-h-[88px] flex items-center justify-between gap-4 py-3">
            <Link href="/" className="flex min-w-0 items-center">
              <Image
                src="/assets/images/logo.png"
                alt="Kairo logo"
                width={64}
                height={64}
                priority
                className="h-12 w-12 sm:h-[52px] sm:w-[52px] lg:h-16 lg:w-16 object-contain flex-shrink-0 self-center"
              />
              <div className="min-w-0 flex flex-col justify-center leading-none">
                <span className="text-[20px] sm:text-[22px] lg:text-[25px] font-extrabold tracking-[-0.02em] text-[#000000] whitespace-nowrap antialiased">
                  KAIRO
                </span>
                <span className="mt-1 text-[8px] sm:text-[9px] lg:text-[10px] font-medium tracking-[0.1em] text-gray-500 opacity-70 whitespace-nowrap">
                  POWERED BY NST SVYASA
                </span>
              </div>
            </Link>

            <nav className="hidden min-[1226px]:flex items-center gap-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[11px] font-black tracking-[0.14em] transition-all duration-200 flex items-center justify-center px-3 min-[1226px]:px-4 py-2.5 rounded-full ${
                      isActive
                        ? 'bg-newton-blue-50 text-newton-blue-500'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-newton-blue-500'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden min-[1226px]:flex items-center gap-4">
              {user ? (
                /* ── Signed-in user menu ── */
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {photoURL ? (
                      <Image
                        src={photoURL}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-newton-blue-500/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-newton-blue-500 flex items-center justify-center text-white text-xs font-black">
                        {displayName[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-[11px] font-bold text-gray-700 max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown size={13} className="text-gray-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs font-semibold text-gray-900 truncate">{displayName}</p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      <button
                        onClick={async () => {
                          setIsUserMenuOpen(false);
                          await signOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-[11px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={13} />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Sign In button ── */
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 sm:px-8 py-2.5 sm:py-3 rounded-full bg-newton-blue-500 text-white text-[10px] sm:text-[11px] font-black tracking-[0.15em] hover:bg-newton-blue-600 transition-all shadow-[0_8px_20px_-6px_rgba(0,102,255,0.4)] active:scale-95"
                >
                  SIGN IN
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="min-[1226px]:hidden inline-flex items-center justify-center rounded-full p-2.5 text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="min-[1226px]:hidden pb-4">
              <nav className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="flex flex-col p-3">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-[11px] font-black tracking-[0.14em] transition-all duration-200 ${
                          isActive
                            ? 'bg-newton-blue-50 border border-newton-blue-500 text-newton-blue-500'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                  {user ? (
                    <div className="mt-3 px-4 py-3 rounded-xl bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {photoURL ? (
                          <Image
                            src={photoURL}
                            alt={displayName}
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-newton-blue-500 flex items-center justify-center text-white text-[10px] font-black">
                            {displayName[0].toUpperCase()}
                          </div>
                        )}
                        <span className="text-[11px] font-bold text-gray-700 truncate max-w-[100px]">
                          {displayName}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          setIsMobileMenuOpen(false);
                          await signOut();
                        }}
                        className="text-[10px] font-semibold text-red-500 flex items-center gap-1"
                      >
                        <LogOut size={11} /> Sign out
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="mt-3 px-4 py-3 rounded-xl bg-newton-blue-500 text-white text-[11px] font-black tracking-[0.15em] hover:bg-newton-blue-600 transition-all"
                    >
                      SIGN IN
                    </button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Close user dropdown on outside click */}
      {isUserMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
      )}
    </>
  );
}
