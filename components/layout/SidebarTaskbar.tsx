'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sprout,
  Home,
  LayoutDashboard,
  Bot,
  CloudSun,
  ShieldAlert,
  TrendingUp,
  Map,
  Settings,
  MapPin,
  Globe,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { cn } from '@/lib/utils';

export function SidebarTaskbar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { href: '/', label: t('nav.home', 'Home'), icon: Home },
    { href: '/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard },
    { href: '/ai-assistant', label: t('nav.ai_assistant', 'AI Assistant'), icon: Bot, badge: 'AI' },
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
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-stone-200/90 bg-white sticky top-0 h-screen transition-all duration-300 z-30 shrink-0 select-none shadow-xs',
        collapsed ? 'w-20' : 'w-64 xl:w-72'
      )}
    >
      {/* Brand & Taskbar Header */}
      <div className="h-18 px-4 flex items-center justify-between border-b border-stone-100">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 transition-opacity overflow-hidden',
            collapsed && 'justify-center w-full'
          )}
        >
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xl font-extrabold tracking-tight text-emerald-950 font-serif leading-none truncate">
                {t('app_name', 'KrishiMitra')}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase mt-1">
                SMART AGRI AI
              </span>
            </div>
          )}
        </Link>

        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Collapse Taskbar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Expand Taskbar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Location Badge Indicator */}
      {!collapsed && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-emerald-700 uppercase block tracking-wider">
                Active Region
              </span>
              <span className="text-xs font-bold text-emerald-950 truncate block">
                {selectedDistrict}, {selectedState}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className={cn('px-3 mb-2', collapsed && 'hidden')}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Taskbar Navigation
          </span>
        </div>

        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                active
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-colors',
                  active ? 'text-white' : 'text-stone-500 group-hover:text-emerald-700'
                )}
              />

              {!collapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-md font-bold',
                    active ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
                  )}
                >
                  {item.badge}
                </span>
              )}

              {active && !collapsed && !item.badge && (
                <ChevronRight className="w-4 h-4 text-emerald-200 shrink-0 ml-auto" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Taskbar Controls */}
      <div className="p-3 border-t border-stone-100 bg-stone-50/50 space-y-2">
        {!collapsed ? (
          <>
            <div className="w-full">
              <LanguageSelector variant="header" className="w-full" />
            </div>
            <div className="text-[11px] text-stone-400 text-center pt-1 font-medium">
              Smart India Hackathon • Pan-India AI
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <Globe className="w-5 h-5 text-stone-500" />
          </div>
        )}
      </div>
    </aside>
  );
}
