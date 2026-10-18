'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Thermometer,
  CloudRain,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  MapPin,
  LayoutGrid,
  TrendingUp,
  Building,
  Layers,
  LogIn,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { MetricCard } from '@/components/ui/MetricCard';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { RecommendationsCard } from '@/components/dashboard/RecommendationsCard';
import { MyCropsCard } from '@/components/dashboard/MyCropsCard';
import { CropHealthCard } from '@/components/dashboard/CropHealthCard';
import { MarketPricesCard } from '@/components/dashboard/MarketPricesCard';
import { UpcomingTasksCard } from '@/components/dashboard/UpcomingTasksCard';
import { AIAssistantCard } from '@/components/dashboard/AIAssistantCard';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();
  const { user, profile, isConfigured } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'crops' | 'weather' | 'markets'>('all');

  // Live Supabase Farm Counts
  const [liveFarmsCount, setLiveFarmsCount] = useState<number | null>(null);
  const [livePlotsCount, setLivePlotsCount] = useState<number | null>(null);
  const [liveCropsCount, setLiveCropsCount] = useState<number | null>(null);
  const [liveTotalAcres, setLiveTotalAcres] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!user || !isConfigured) return;

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      try {
        const { data: farmsData } = await supabase
          .from('farms')
          .select('id, area_value')
          .eq('owner_id', user.id);

        if (farmsData) {
          setLiveFarmsCount(farmsData.length);
          const sumAcres = (farmsData as Array<{ area_value: number }>).reduce(
            (acc: number, f) => acc + Number(f.area_value || 0),
            0
          );
          setLiveTotalAcres(sumAcres);
        }

        const { count: plotCount } = await supabase
          .from('farm_plots')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id);
        if (plotCount !== null) setLivePlotsCount(plotCount);

        const { count: cropCount } = await supabase
          .from('farm_crops')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id);
        if (cropCount !== null) setLiveCropsCount(cropCount);
      } catch (err) {
        console.warn('Dashboard live stats query:', err);
      }
    }

    fetchStats();
  }, [user, isConfigured]);

  // Display Name and Initials
  const farmerName = profile?.full_name || user?.email?.split('@')[0] || 'Demonstration Farmer';
  const farmerDistrict = profile?.district || selectedDistrict;
  const initials = farmerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isLiveConnected = Boolean(user && isConfigured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t('dashboard.title', 'Farmer Dashboard')}
            </h1>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 font-semibold px-2.5 py-0.5 rounded-full text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {isLiveConnected ? 'Cloud Active' : 'Demo Active'}
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-1">
            {t(
              'dashboard.subtitle',
              'Daily agricultural overview and advisory briefing for your farm'
            )}
          </p>
        </div>

        {/* Farmer Profile Badge */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 text-white font-black text-sm flex items-center justify-center">
            {initials}
          </div>
          <div className="text-xs">
            <span className="font-bold text-stone-900 block truncate max-w-[150px]">
              {farmerName}
            </span>
            <span suppressHydrationWarning className="text-emerald-700 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {farmerDistrict}, Kerala
            </span>
          </div>
        </div>
      </div>

      {/* Unauthenticated notice */}
      {!user && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950 text-sm">
          <div>
            <span className="font-bold block">Sign in to sync your farm holdings</span>
            <span className="text-xs text-stone-600">Create plots, track standing crops, and save your regional settings with Supabase.</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button size="sm" variant="primary">
                <LogIn className="w-3.5 h-3.5 mr-1" />
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" variant="outline">
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Agro Climate"
          value="26°C"
          unit="Normal"
          subtitle={`${farmerDistrict} Region`}
          icon={<CloudRain className="w-5 h-5" />}
          variant="sky"
        />

        <MetricCard
          title="Total Crops"
          value={liveCropsCount !== null ? liveCropsCount.toString() : '4'}
          unit={liveCropsCount !== null ? 'Standing Crops' : 'Active Varieties'}
          subtitle={
            liveTotalAcres !== null
              ? `${liveTotalAcres.toFixed(1)} Acres under care`
              : '8.5 Acres under care'
          }
          icon={<Sprout className="w-5 h-5" />}
          variant="emerald"
        />

        <MetricCard
          title="Farm Holdings"
          value={liveFarmsCount !== null ? liveFarmsCount.toString() : '1'}
          unit={livePlotsCount !== null ? `${livePlotsCount} Plots` : '3 Plots'}
          subtitle={`${farmerDistrict} District`}
          icon={<Building className="w-5 h-5" />}
          variant="amber"
        />

        <MetricCard
          title="Farm Tasks"
          value="3"
          unit="Pending"
          subtitle="1 High Priority today"
          icon={<Calendar className="w-5 h-5" />}
          variant="default"
        />
      </div>

      {/* Dashboard View Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <LayoutGrid className="w-4 h-4 text-emerald-700" />
          <span>{t('dashboard.tab_overview', 'All Overview')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crops')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'crops'
              ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>{t('dashboard.tab_crops', 'Crops & Health')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('weather')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'weather'
              ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <CloudRain className="w-4 h-4 text-emerald-700" />
          <span>{t('dashboard.tab_weather', 'Weather & Tasks')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('markets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'markets'
              ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/80'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-700" />
          <span>{t('dashboard.tab_markets', 'Mandi Markets')}</span>
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {(activeTab === 'all' || activeTab === 'weather') && <WeatherCard />}
          {(activeTab === 'all' || activeTab === 'crops') && <MyCropsCard />}
          {(activeTab === 'all' || activeTab === 'crops') && <CropHealthCard />}
          {(activeTab === 'all' || activeTab === 'markets') && <MarketPricesCard />}
        </div>

        {/* Right Column (1 col wide on desktop) */}
        <div className="space-y-6">
          <AIAssistantCard />
          <UpcomingTasksCard />
          <RecommendationsCard />
        </div>
      </div>
    </div>
  );
}
