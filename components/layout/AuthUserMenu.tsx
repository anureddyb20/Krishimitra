'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  LogOut,
  Settings,
  Map,
  Sparkles,
  LogIn,
  UserPlus,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';

export function AuthUserMenu() {
  const { user, profile, isConfigured, signOut } = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isConfigured || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button size="sm" variant="outline" className="rounded-xl text-xs font-bold">
            <LogIn className="w-3.5 h-3.5 mr-1" />
            {t('auth.sign_in_btn', 'Sign In')}
          </Button>
        </Link>
        <Link href="/register" className="hidden sm:inline-block">
          <Button size="sm" variant="primary" className="rounded-xl text-xs font-bold shadow-xs">
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            {t('auth.register_btn', 'Register')}
          </Button>
        </Link>
      </div>
    );
  }

  // Initials for avatar
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Farmer';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        aria-label="User Account Menu"
        aria-expanded={isOpen}
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col text-left min-w-0 pr-1">
          <span className="text-xs font-bold text-stone-900 truncate max-w-[120px]">
            {displayName}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold truncate">
            {profile?.district || 'Kerala'}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-stone-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2.5 border-b border-stone-100">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              {t('auth.signed_in_as', 'Signed in as')}
            </span>
            <span className="text-xs font-bold text-stone-900 truncate block mt-0.5">
              {displayName}
            </span>
            <span className="text-[11px] text-stone-500 truncate block">
              {user.email}
            </span>
          </div>

          <div className="py-1">
            <Link
              href="/my-farm"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
            >
              <Map className="w-4 h-4 text-emerald-700" />
              {t('nav.my_farm', 'My Farm Holdings')}
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
            >
              <Settings className="w-4 h-4 text-emerald-700" />
              {t('nav.settings', 'Profile & Settings')}
            </Link>

            {profile && !profile.onboarding_completed && (
              <Link
                href="/onboarding"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                Resume Onboarding
              </Link>
            )}
          </div>

          <div className="border-t border-stone-100 pt-1 mt-1">
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              {t('auth.sign_out', 'Sign Out')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
