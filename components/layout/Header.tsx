'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Sprout,
  LayoutDashboard,
  Home,
  Bot,
  CloudSun,
  ShieldAlert,
  TrendingUp,
  Map,
  Settings,
  ChevronRight,
  LogIn,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { LocationSelector } from '@/components/common/LocationSelector';
import { AuthUserMenu } from '@/components/layout/AuthUserMenu';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = mounted ? user : null;
  const currentProfile = mounted ? profile : null;
  const isOnboarded = Boolean(currentUser && currentProfile?.onboarding_completed);
  const isPendingOnboarding = Boolean(currentUser && !currentProfile?.onboarding_completed);

  let navLinks: Array<{ href: string; label: string; icon: any }> = [];

  if (!currentUser) {
    navLinks = [
      { href: '/', label: t('nav.home', 'Home'), icon: Home },
      { href: '/login', label: t('auth.sign_in_btn', 'Sign In (Demo)'), icon: LogIn },
      { href: '/register', label: t('auth.register_btn', 'Create Account'), icon: UserPlus },
    ];
  } else if (isPendingOnboarding) {
    navLinks = [
      { href: '/', label: t('nav.home', 'Home'), icon: Home },
      { href: '/onboarding', label: 'AI Land & Crop Setup', icon: Sparkles },
    ];
  } else {
    navLinks = [
      { href: '/', label: t('nav.home', 'Home'), icon: Home },
      { href: '/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard },
      { href: '/ai-assistant', label: t('nav.ai_assistant', 'AI Assistant'), icon: Bot },
      { href: '/weather', label: t('nav.weather', 'Weather'), icon: CloudSun },
      { href: '/crop-health', label: t('nav.crop_health', 'Crop Health'), icon: ShieldAlert },
      { href: '/market-prices', label: t('nav.market_prices', 'Market Prices'), icon: TrendingUp },
      { href: '/my-farm', label: t('nav.my_farm', 'My Farm'), icon: Map },
      { href: '/settings', label: t('nav.settings', 'Settings'), icon: Settings },
    ];
  }

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return t('nav.home', 'Home');
      case '/dashboard':
        return t('nav.dashboard', 'Farmer Dashboard');
      case '/onboarding':
        return 'AI Land Division Setup';
      case '/login':
        return t('auth.sign_in_btn', 'Sign In');
      case '/register':
        return t('auth.register_btn', 'Registration');
      case '/ai-assistant':
        return t('nav.ai_assistant', 'AI Assistant');
      case '/weather':
        return t('nav.weather', 'Weather & Climate');
      case '/crop-health':
        return t('nav.crop_health', 'Crop Health Diagnosis');
      case '/market-prices':
        return t('nav.market_prices', 'Mandi Market Prices');
      case '/my-farm':
        return t('nav.my_farm', 'My Farm Management');
      case '/settings':
        return t('nav.settings', 'Settings');
      default:
        return t('app_name', 'KrishiMitra');
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4">
          {/* Left: Mobile Brand & Desktop Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            {/* Mobile Branding Link */}
            <Link href="/" className="lg:hidden flex items-center gap-2 shrink-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white shadow-xs">
                <Sprout className="w-5 h-5 text-emerald-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-emerald-950 font-serif leading-none">
                  {t('app_name', 'KrishiMitra')}
                </span>
                <span className="text-[9px] font-bold text-emerald-700 uppercase mt-0.5">
                  SMART AGRI AI
                </span>
              </div>
            </Link>

            {/* Desktop Current Page Indicator */}
            <div className="hidden lg:flex items-center gap-2 text-stone-700 shrink-0">
              <Link href="/" className="text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-emerald-800 transition-colors">
                KrishiMitra
              </Link>
              <span className="text-stone-300 font-light">/</span>
              <h2 className="text-sm sm:text-base font-bold text-stone-900 truncate">{getPageTitle()}</h2>
            </div>
          </div>

          {/* Center/Right: Dynamic Location Selector & Language Dropdown */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap shrink-0">
            {/* Dynamic State & District Selector */}
            <div className="hidden md:flex items-center">
              <LocationSelector size="sm" />
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="header" />

            {/* Auth User Menu */}
            <AuthUserMenu />

            {/* Contextual Primary Action Button */}
            {currentUser && isPendingOnboarding && pathname !== '/onboarding' && (
              <Link href="/onboarding" className="hidden xl:inline-block">
                <Button size="sm" variant="primary" className="h-9 rounded-xl shadow-xs bg-amber-600 hover:bg-amber-700 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  <span>Complete Setup</span>
                </Button>
              </Link>
            )}

            {currentUser && isOnboarded && pathname !== '/dashboard' && (
              <Link href="/dashboard" className="hidden xl:inline-block">
                <Button size="sm" variant="primary" className="h-9 rounded-xl shadow-xs text-xs font-bold">
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
                  <span>{t('nav.dashboard', 'Dashboard')}</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer h-9 w-9 flex items-center justify-center"
              aria-label="Toggle Navigation Taskbar"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Location Selector Row */}
        <div className="md:hidden py-2 border-t border-stone-100 flex items-center justify-between">
          <LocationSelector size="sm" className="w-full justify-between" />
        </div>
      </div>

      {/* Mobile Drawer Taskbar Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-150 shadow-xl">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
            Taskbar Navigation
          </div>
          {navLinks.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-emerald-50 text-emerald-950 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-5 h-5', active ? 'text-emerald-700' : 'text-stone-400')} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t border-stone-100 flex flex-col gap-2">
            {!currentUser ? (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In (Demo Account)
                </Button>
              </Link>
            ) : isPendingOnboarding ? (
              <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center bg-amber-600 hover:bg-amber-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Complete Farm Setup
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {t('nav.dashboard', 'Open Farmer Dashboard')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
