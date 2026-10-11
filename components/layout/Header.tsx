'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sprout,
  Menu,
  X,
  LayoutDashboard,
  Bot,
  CloudSun,
  ShieldAlert,
  TrendingUp,
  Map,
  Settings,
  Home,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav.home', 'Home'), icon: Home },
    { href: '/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard },
    { href: '/ai-assistant', label: t('nav.ai_assistant', 'AI Assistant'), icon: Bot },
    { href: '/weather', label: t('nav.weather', 'Weather'), icon: CloudSun },
    { href: '/crop-health', label: t('nav.crop_health', 'Crop Health'), icon: ShieldAlert },
    { href: '/market-prices', label: t('nav.market_prices', 'Market Prices'), icon: TrendingUp },
    { href: '/my-farm', label: t('nav.my_farm', 'My Farm'), icon: Map },
    { href: '/settings', label: t('nav.settings', 'Settings'), icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl py-1 px-1.5"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6 text-emerald-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-emerald-950 font-serif leading-none">
                {t('app_name', 'KrishiMitra')}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase mt-1">
                Kerala Agro AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 7).map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-150 flex items-center gap-1.5',
                    active
                      ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  )}
                >
                  <Icon className={cn('w-4 h-4', active ? 'text-emerald-700' : 'text-stone-400')} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <LanguageSelector variant="header" />

            <div className="hidden sm:block">
              <Link href="/dashboard">
                <Button size="sm" variant="primary" className="rounded-xl shadow-xs">
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  {t('nav.dashboard', 'Dashboard')}
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-150 shadow-xl">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
            Navigation Menu
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
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                {t('nav.dashboard', 'Open Farmer Dashboard')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
