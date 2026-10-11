'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Globe,
  MapPin,
  Bell,
  WifiOff,
  RotateCcw,
  ArrowLeft,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LocationSelector } from '@/components/common/LocationSelector';
import { SupportedLanguage } from '@/types/i18n';

export default function SettingsPage() {
  const {
    t,
    language,
    setLanguage,
    supportedLanguages,
    setIsOnboardingOpen,
  } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();
  const [savedNotice, setSavedNotice] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  const handleLanguageSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleResetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('krishimitra_crops');
      localStorage.removeItem('krishimitra_tasks');
      setResetNotice(true);
      setTimeout(() => setResetNotice(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button and page title */}
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-emerald-700 transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back', 'Back to Dashboard')}
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t('modules.settings_title', 'Application Settings')}
            </h1>
            <Badge variant="success" size="sm">
              Functional
            </Badge>
          </div>
          <p className="text-sm text-stone-600 mt-1">
            {t(
              'modules.settings_subtitle',
              'Configure interface language, default state & district, notifications, and offline preferences.'
            )}
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-700" />
          Language and regional location updated and saved to your device.
        </div>
      )}

      {resetNotice && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <RotateCcw className="w-4 h-4 text-amber-700" />
          Demonstration crops and task records reset to default state.
        </div>
      )}

      {/* 1. Language Selection Setting */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-700" />
              <CardTitle className="text-base sm:text-lg">
                {t('common.change_language', 'Interface Language')}
              </CardTitle>
            </div>
            <span className="text-xs text-stone-500 font-medium">6 Languages Supported</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {t(
              'common.language_note',
              'Selecting a regional language automatically tailors the locations to your state.'
            )}
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {supportedLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 font-medium ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-stone-900">{lang.name}</span>
                      {lang.badge && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                          {lang.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-500">{lang.englishName}</span>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Want to see the initial welcome modal again?
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Re-open Onboarding Modal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Default State & District Setting */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <CardTitle className="text-base sm:text-lg">
              Farm Region (State & District)
            </CardTitle>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Select your farm location to customize local weather forecasts and APMC mandi market benchmarks.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-sm font-bold text-stone-900 block">
                Active Farm Location:
              </span>
              <span className="text-xs text-stone-600 font-medium">
                {selectedDistrict} District, {selectedState}
              </span>
            </div>
            <LocationSelector />
          </div>
        </CardContent>
      </Card>

      {/* 3. Future Preferences Roadmap (Phase 2 & 5) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-stone-400" />
            <CardTitle className="text-base text-stone-700">
              Alerts & Offline Configuration (Future Phases)
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-stone-600">
          <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800 block">WhatsApp & SMS Monsoon Alerts</span>
              <span className="text-stone-500">Receive localized extreme weather warnings directly on your mobile.</span>
            </div>
            <Badge variant="demo" size="sm">Phase 2</Badge>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800 block">Offline Mode & Service Worker Sync</span>
              <span className="text-stone-500">Cache disease guide & emergency contacts for poor connectivity zones.</span>
            </div>
            <Badge variant="demo" size="sm">Phase 5 (PWA)</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 4. Reset Demo Data */}
      <Card className="border-stone-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-stone-500" />
            <CardTitle className="text-base text-stone-800">
              Demo Data Management
            </CardTitle>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Clear locally cached mock crop entries and farm task checklists to test a clean onboarding state.
          </p>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-xs text-stone-600">
            Reset customized crops and task completions to default mock set.
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetAllData}
            className="text-stone-700 hover:text-rose-700 hover:border-rose-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Demo Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
