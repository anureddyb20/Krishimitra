'use client';

import React from 'react';
import {
  Thermometer,
  CloudRain,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { RecommendationsCard } from '@/components/dashboard/RecommendationsCard';
import { MyCropsCard } from '@/components/dashboard/MyCropsCard';
import { CropHealthCard } from '@/components/dashboard/CropHealthCard';
import { MarketPricesCard } from '@/components/dashboard/MarketPricesCard';
import { UpcomingTasksCard } from '@/components/dashboard/UpcomingTasksCard';
import { AIAssistantCard } from '@/components/dashboard/AIAssistantCard';
import { AlertBanner } from '@/components/ui/AlertBanner';

export default function DashboardPage() {
  const { t } = useTranslation();

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
              Active
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-1">
            {t(
              'dashboard.subtitle',
              'Daily agricultural overview and advisory briefing for Kerala farmers'
            )}
          </p>
        </div>

        {/* Farmer Profile Badge */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center">
            KM
          </div>
          <div className="text-xs">
            <span className="font-bold text-stone-900 block">Demonstration Farmer</span>
            <span className="text-stone-500">Idukki & Wayanad Holdings</span>
          </div>
        </div>
      </div>

      {/* Demo Notice Alert */}
      <AlertBanner
        type="info"
        title="Phase 1 Demonstration Mode"
        message="All weather figures, market rates, disease alerts, and recommendations displayed on this dashboard are simulated demonstration data for testing the UI and multilingual interface. Live integrations will be connected in subsequent phases."
      />

      {/* Quick Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Agro Climate"
          value="24°C"
          unit="Rain Expected"
          subtitle="High Range Zone"
          icon={<CloudRain className="w-5 h-5" />}
          variant="sky"
        />

        <MetricCard
          title="Total Crops"
          value="4"
          unit="Active Varieties"
          subtitle="10.0 Acres under care"
          icon={<Sprout className="w-5 h-5" />}
          variant="emerald"
        />

        <MetricCard
          title="Crop Health"
          value="91%"
          unit="Average Score"
          subtitle="1 Attention Alert"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="amber"
          trend={{ value: '+2.4%', isPositive: true, label: 'vs last week' }}
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

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Entry Card */}
          <AIAssistantCard />

          {/* Weather Briefing */}
          <WeatherCard />

          {/* Recommendations Card */}
          <RecommendationsCard />

          {/* My Crops Card */}
          <MyCropsCard />
        </div>

        {/* Right Column (1 span on desktop) */}
        <div className="space-y-6">
          {/* Crop Health & Diagnostic Warning */}
          <CropHealthCard />

          {/* Market Mandi Rates */}
          <MarketPricesCard />

          {/* Upcoming Farm Tasks */}
          <UpcomingTasksCard />
        </div>
      </div>
    </div>
  );
}
