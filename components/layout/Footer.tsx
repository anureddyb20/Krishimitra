'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, Heart, Shield, Globe, Cpu, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">
                  {t('app_name', 'KrishiMitra')}
                </span>
                <span className="block text-xs text-emerald-400 font-medium">
                  {t('app_tagline', 'AI-Powered Personal Farming Assistant for Indian Farmers')}
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              {t(
                'footer.tagline',
                'Empowering Indian smallholder farmers across all states with state-of-the-art agricultural artificial intelligence, weather intelligence, and crop disease diagnosis.'
              )}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Smart India Hackathon
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700">
                Phase 1 Prototype
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('nav.dashboard', 'Platform Modules')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  {t('nav.dashboard', 'Farmer Dashboard')}
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  {t('nav.ai_assistant', 'AI Assistant')}
                </Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  {t('nav.weather', 'Weather & Climate')}
                </Link>
              </li>
              <li>
                <Link href="/crop-health" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  {t('nav.crop_health', 'Crop Disease Diagnosis')}
                </Link>
              </li>
              <li>
                <Link href="/market-prices" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  {t('nav.market_prices', 'Mandi Market Prices')}
                </Link>
              </li>
              <li>
                <Link href="/my-farm" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  {t('nav.my_farm', 'My Farm Plots')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional & Technology Info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              National Agro Coverage
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Supporting farmers across Karnataka, Andhra Pradesh, Telangana, Tamil Nadu, Kerala, Maharashtra, Uttar Pradesh, Rajasthan, Madhya Pradesh, Punjab, Haryana, and Gujarat in 6 native languages.
            </p>
            <div className="pt-2 border-t border-stone-800 text-xs text-stone-400">
              <p className="font-semibold text-stone-300 mb-1">Architecture Roadmap:</p>
              <p>Next.js 16 • Tailwind CSS • Supabase PostgreSQL • Google Gemini AI • IMD Weather</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © 2026 KrishiMitra. {t('footer.all_rights_reserved', 'All rights reserved.')}
          </p>
          <p className="text-center sm:text-right">
            {t(
              'footer.future_integrations',
              'Backend, Supabase Auth, Gemini AI, IMD Weather, and AGMARKNET APIs planned for subsequent phases.'
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
