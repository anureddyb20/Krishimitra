'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sprout,
  Bot,
  CloudSun,
  ShieldAlert,
  TrendingUp,
  Map,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Cpu,
  Layers,
  ChevronRight,
  Database,
  Globe2,
  MapPin,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

export default function LandingPage() {
  const { t, language } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();

  const capabilities = [
    {
      icon: Bot,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      title: t('landing.feat_ai_title', 'AI Farming Assistant'),
      desc: t(
        'landing.feat_ai_desc',
        'Multilingual conversational intelligence providing context-aware guidance on crop care, fertilizers, organic methods, and government schemes.'
      ),
      phase: 'Phase 2',
      href: '/ai-assistant',
    },
    {
      icon: CloudSun,
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      title: t('landing.feat_weather_title', 'Monsoon & Weather Intelligence'),
      desc: t(
        'landing.feat_weather_desc',
        'District-level microclimate forecasts with actionable agricultural advisories to protect crops from sudden downpours and weather fluctuations.'
      ),
      phase: 'Phase 3',
      href: '/weather',
    },
    {
      icon: ShieldAlert,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      title: t('landing.feat_health_title', 'Crop Health & Disease Scanner'),
      desc: t(
        'landing.feat_health_desc',
        'Vision-assisted diagnosis for crop afflictions, fungal infections, and pest infestations across Indian agricultural crops.'
      ),
      phase: 'Phase 3',
      href: '/crop-health',
    },
    {
      icon: TrendingUp,
      color: 'text-teal-700 bg-teal-50 border-teal-200',
      title: t('landing.feat_market_title', 'Mandi Market Prices'),
      desc: t(
        'landing.feat_market_desc',
        'Transparent price tracking across Indian APMC agricultural markets for grains, pulses, cash crops, and vegetables.'
      ),
      phase: 'Phase 4',
      href: '/market-prices',
    },
    {
      icon: Map,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      title: t('landing.feat_farm_title', 'My Farm Management'),
      desc: t(
        'landing.feat_farm_desc',
        'Organized records of your plots, crop cycles, irrigation tasks, and yield history tailored for smallholders.'
      ),
      phase: 'Phase 2',
      href: '/my-farm',
    },
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Subtle decorative background gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-emerald-100/40 via-stone-50/20 to-transparent pointer-events-none -z-10 rounded-3xl" />

          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold shadow-xs">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>{t('landing.badge', 'Designed for Diverse Indian Agro-Climatic Zones')}</span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-700 font-medium">Smart India Hackathon</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              {t('landing.hero_title', 'AI-Powered Personal Farming Assistant for All Indian Farmers')}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
              {t(
                'landing.hero_subtitle',
                'Empowering smallholder farmers across India with localized weather intelligence, early crop disease diagnosis, real-time mandi prices, and native AI advisory in regional languages.'
              )}
            </p>

            {/* Selected Location Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-stone-200 shadow-xs text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span className="text-stone-500">Selected Location:</span>
              <span className="font-bold text-emerald-950">
                {selectedDistrict}, {selectedState}
              </span>
              <Link
                href="/dashboard"
                className="ml-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
              >
                Change in Header ↗
              </Link>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base shadow-md group">
                  <span>{t('landing.cta_primary', 'Open Farmer Dashboard')}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/ai-assistant" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                  <Bot className="w-4 h-4 mr-2 text-emerald-700" />
                  <span>{t('landing.cta_secondary', 'Preview AI Assistant')}</span>
                </Button>
              </Link>
            </div>

            {/* Quick metrics banner */}
            <div className="pt-8 border-t border-stone-200/80 max-w-2xl mx-auto grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-900">28+</span>
                <span className="text-xs text-stone-500 font-medium">Indian States & UTs</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-900">6</span>
                <span className="text-xs text-stone-500 font-medium">Indian Languages</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-900">100%</span>
                <span className="text-xs text-stone-500 font-medium">Farmer Centric</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Preview Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-800">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold border border-emerald-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {t('phase_badge', 'Phase 1: Architecture & UI Foundation')}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              A Unified Smart Farming Assistant for All Indian Agriculture
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              KrishiMitra combines microclimate weather intelligence, computer vision plant diagnosis, and Gemini LLMs optimized for Indian farmers across Karnataka, Andhra Pradesh, Telangana, Tamil Nadu, Kerala, Uttar Pradesh, and all states.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button variant="accent" size="md">
                  View Demo Dashboard
                </Button>
              </Link>
              <Link href="/weather">
                <Button variant="outline" size="md" className="bg-emerald-900/40 text-white border-emerald-700 hover:bg-emerald-800">
                  Agro-Weather Preview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t('landing.features_title', 'Comprehensive Agricultural Intelligence')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {t(
              'landing.features_subtitle',
              'Engineered to address diverse farming challenges across Indian states — from monsoon variations to cash crop security.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <Card key={idx} className="flex flex-col justify-between hover:border-emerald-300">
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl border ${cap.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="default" size="sm">
                      {cap.phase}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-stone-900">{cap.title}</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">{cap.desc}</p>
                  </div>
                </CardContent>

                <div className="p-6 pt-0">
                  <Link
                    href={cap.href}
                    className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-900 gap-1 group"
                  >
                    <span>Explore module preview</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Pan-India Regional Agricultural Focus Section */}
      <section className="bg-stone-50 border-y border-stone-200/90 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-5">
              <Badge variant="success" size="sm">
                Pan-India Agro-Climatic Intelligence
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {t('landing.regional_focus_title', 'Built for Diverse Indian Agriculture')}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {t(
                  'landing.regional_focus_desc',
                  "India's agricultural landscape is rich and diverse — spanning Karnataka's fertile plateaus, Andhra & Telangana's cotton and chilli hubs, Tamil Nadu's delta paddy, Kerala's spices, and the Indo-Gangetic wheat-rice belts."
                )}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">South Indian Agricultural Hubs</h4>
                    <p className="text-xs text-stone-600">
                      Tailored support for Karnataka (sugarcane, ragi, coffee), Andhra & Telangana (cotton, chilli, maize, paddy), Tamil Nadu (Cauvery delta paddy, turmeric), and Kerala (spices, coconut).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Central & Northern Grain Belts</h4>
                    <p className="text-xs text-stone-600">
                      Fertilizer scheduling, canal irrigation alerts, and crop surveillance for Uttar Pradesh, Madhya Pradesh, Punjab, Haryana, and Rajasthan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Regional Language Voice & Text Models</h4>
                    <p className="text-xs text-stone-600">
                      Native AI assistance in Kannada, Telugu, Tamil, Malayalam, Hindi, and English with voice query support planned.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200">
                <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider block mb-1">
                  {t('landing.regional_crops_title', 'Key Supported Crops')}
                </span>
                <p className="text-xs text-stone-700 font-medium leading-relaxed">
                  {t(
                    'landing.regional_crops_list',
                    'Paddy • Wheat • Cotton • Sugarcane • Maize • Spices • Coconut • Groundnut • Pulses • Vegetables'
                  )}
                </p>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-bold text-stone-900">System Architecture (Phase 1 Ready)</h3>
                </div>
                <Badge variant="success" size="sm">
                  Full Stack
                </Badge>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-900 block mb-1">Left Taskbar & Frontend Layer</span>
                  <p className="text-stone-600">
                    Next.js App Router, React 19, Tailwind CSS v4, dynamic left-side taskbar navigation, Lucide icons, mobile drawer.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-900 block mb-1">Regional Language & Location Engine</span>
                  <p className="text-stone-600">
                    Smart location mapping: Kannada sets Karnataka, Telugu sets AP/Telangana, Tamil sets Tamil Nadu, Malayalam sets Kerala, Hindi sets North/Central states, and English allows all states.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-bold text-stone-900 block mb-1">Backend & Database Readiness</span>
                  <p className="text-stone-600">
                    Next.js Route Handlers, Supabase client/server connection helpers, modular schemas with safe fallback.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/dashboard" className="w-full">
                  <Button variant="primary" size="md" className="w-full justify-center">
                    Enter Farmer Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          {t('landing.cta_banner_title', 'Ready to experience modern agricultural technology?')}
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
          {t(
            'landing.cta_banner_desc',
            'Explore the interactive taskbar and dashboard to preview next-generation farmer-first AI assistance.'
          )}
        </p>
        <div>
          <Link href="/dashboard">
            <Button size="lg" className="rounded-2xl shadow-lg">
              {t('landing.cta_banner_btn', 'Launch Dashboard')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
