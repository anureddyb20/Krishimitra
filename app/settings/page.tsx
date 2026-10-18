'use client';

import React, { useState, useEffect } from 'react';
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
  User,
  Phone,
  Building,
  Save,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { LocationSelector } from '@/components/common/LocationSelector';
import { SupportedLanguage } from '@/types/i18n';
import { KeralaDistrict } from '@/types/database';

const KERALA_DISTRICTS: KeralaDistrict[] = [
  'Alappuzha',
  'Ernakulam',
  'Idukki',
  'Kannur',
  'Kasaragod',
  'Kollam',
  'Kottayam',
  'Kozhikode',
  'Malappuram',
  'Palakkad',
  'Pathanamthitta',
  'Thiruvananthapuram',
  'Thrissur',
  'Wayanad',
];

export default function SettingsPage() {
  const {
    t,
    language,
    setLanguage,
    supportedLanguages,
    setIsOnboardingOpen,
  } = useTranslation();
  const { selectedState, selectedDistrict, setSelectedDistrict, setSelectedState } = useLocation();
  const { user, profile, isConfigured, refreshProfile } = useAuth();

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedKeralaDistrict, setSelectedKeralaDistrict] = useState<KeralaDistrict>('Wayanad');
  const [village, setVillage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [savedNotice, setSavedNotice] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  // Sync profile details when loaded
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.phone_number) setPhoneNumber(profile.phone_number);
      if (profile.district) {
        setSelectedKeralaDistrict(profile.district);
      }
      if (profile.village_or_town) setVillage(profile.village_or_town);
    }
  }, [profile]);

  const handleLanguageSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!user) {
      setProfileMessage({
        type: 'error',
        text: 'You must be signed in to update your profile.',
      });
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      setProfileMessage({
        type: 'error',
        text: t('common.name_validation', 'Farmer name must be at least 2 characters'),
      });
      return;
    }

    if (!isConfigured) {
      setProfileMessage({
        type: 'error',
        text: t('auth.unconfigured_notice', 'Supabase credentials are not configured yet.'),
      });
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setProfileMessage({
        type: 'error',
        text: 'Database connection is unavailable.',
      });
      return;
    }

    setIsSavingProfile(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
          phone_number: phoneNumber.trim() || null,
          preferred_language: language,
          district: selectedKeralaDistrict,
          village_or_town: village.trim() || null,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      // Update location context
      setSelectedState('Kerala');
      setSelectedDistrict(selectedKeralaDistrict);

      await refreshProfile();
      setProfileMessage({
        type: 'success',
        text: t('profile.updated_msg', 'Your profile information has been updated successfully.'),
      });
    } catch (err: any) {
      setProfileMessage({
        type: 'error',
        text: err.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsSavingProfile(false);
    }
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
              {t('profile.title', 'Farmer Profile & Application Settings')}
            </h1>
            <Badge variant="success" size="sm">
              Phase 2 Connected
            </Badge>
          </div>
          <p className="text-sm text-stone-600 mt-1">
            {t(
              'profile.subtitle',
              'Update your personal information, preferred language, and regional Kerala location'
            )}
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-700" />
          Language and regional location updated and saved.
        </div>
      )}

      {resetNotice && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <RotateCcw className="w-4 h-4 text-amber-700" />
          Demonstration crops and task records reset to default state.
        </div>
      )}

      {/* 1. Farmer Profile Details (Supabase Database Backed) */}
      <Card className="border-emerald-200/80 shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-700" />
              <CardTitle className="text-base sm:text-lg">
                {t('profile.personal_heading', 'Farmer Identity & Profile')}
              </CardTitle>
            </div>
            {user ? (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                {user.email}
              </span>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="outline">
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  Sign In to Edit
                </Button>
              </Link>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Your identity details are stored in Supabase with PostgreSQL Row Level Security.
          </p>
        </CardHeader>

        <CardContent>
          {profileMessage && (
            <div
              className={`p-3.5 mb-4 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in ${
                profileMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}
            >
              {profileMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('profile.full_name', 'Full Name')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Krishnan Nair"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('profile.phone', 'Phone Number (Optional)')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('profile.district', 'Kerala District')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    value={selectedKeralaDistrict}
                    onChange={(e) => setSelectedKeralaDistrict(e.target.value as KeralaDistrict)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer"
                  >
                    {KERALA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('profile.village', 'Village / Town (Optional)')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Mananthavady, Meppadi"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isSavingProfile || !user}
                className="py-2.5 px-6 rounded-xl font-bold text-sm shadow-xs"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSavingProfile ? (
                  <span>{t('profile.saving', 'Saving Changes...')}</span>
                ) : (
                  <span>{t('profile.save_profile', 'Save Profile Changes')}</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Language Selection Setting */}
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

      {/* 3. Default State & District Setting */}
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

      {/* 4. Security & Data Protection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <CardTitle className="text-base text-stone-800">
              {t('profile.account_security', 'Account Security & Data Protection')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-stone-600">
          <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-stone-800 block">PostgreSQL Row Level Security (RLS)</span>
              <span className="text-stone-500">Your farm records, plots, and crop details are accessible only by your authenticated session.</span>
            </div>
            <Badge variant="success" size="sm">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 5. Reset Demo Data */}
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
