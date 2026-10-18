'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Globe,
  MapPin,
  Sprout,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { KeralaDistrict, AreaUnit, GrowthStage } from '@/types/database';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/config';
import { SupportedLanguage } from '@/types/i18n';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';

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

const COMMON_KERALA_CROPS = [
  'Paddy (Rice) / നെല്ല്',
  'Coconut / തെങ്ങ്',
  'Black Pepper / കുരുമുളക്',
  'Cardamom / ഏലം',
  'Rubber / റബ്ബർ',
  'Banana (Nendran) / ഏത്തവാഴ',
  'Cassava (Tapioca) / കപ്പ',
  'Arecanut / അടക്ക',
  'Ginger / ഇഞ്ചി',
  'Turmeric / മഞ്ഞൾ',
  'Coffee / കാപ്പി',
  'Tea / തേയില',
  'Nutmeg / ജാതിക്ക',
  'Vegetables / പച്ചക്കറികൾ',
];

const GROWTH_STAGES: GrowthStage[] = [
  'Sowing',
  'Germination',
  'Vegetative',
  'Flowering',
  'Fruit Formation',
  'Harvesting',
  'Post-Harvest',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const { user, profile, isConfigured, refreshProfile } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [prefLang, setPrefLang] = useState<SupportedLanguage>(language);
  const [district, setDistrict] = useState<KeralaDistrict>('Wayanad');
  const [village, setVillage] = useState('');

  // Step 2: Farm
  const [farmName, setFarmName] = useState('');
  const [areaValue, setAreaValue] = useState('2.5');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('acres');
  const [farmNotes, setFarmNotes] = useState('');

  // Step 3: Crop
  const [skipCrop, setSkipCrop] = useState(false);
  const [cropName, setCropName] = useState('Paddy (Rice) / നെല്ല്');
  const [cropVariety, setCropVariety] = useState('');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Vegetative');
  const [plantingDate, setPlantingDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pre-fill from existing profile if available
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.preferred_language) {
        setPrefLang(profile.preferred_language);
      }
      if (profile.district) setDistrict(profile.district);
      if (profile.village_or_town) setVillage(profile.village_or_town);
    }
  }, [profile]);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage(t('common.name_validation', 'Farmer name must be at least 2 characters'));
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!farmName.trim()) {
      setErrorMessage(t('common.field_required', 'Farm name is required'));
      return;
    }
    const numArea = parseFloat(areaValue);
    if (!areaValue || isNaN(numArea) || numArea <= 0) {
      setErrorMessage('Please enter a valid farm area greater than 0');
      return;
    }
    setStep(3);
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      setErrorMessage('You must be signed in to complete onboarding.');
      return;
    }

    if (!isConfigured) {
      setErrorMessage(
        t(
          'auth.unconfigured_notice',
          'Supabase is not configured yet. Please configure credentials in .env.local.'
        )
      );
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage('Could not initialize Supabase connection.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
          preferred_language: prefLang,
          district: district,
          village_or_town: village.trim() || null,
          onboarding_completed: false, // will set to true only after farm creation succeeds!
        });

      if (profileError) {
        throw new Error(`Profile update failed: ${profileError.message}`);
      }

      // 2. Insert Farm
      const parsedArea = parseFloat(areaValue) || 1.0;
      const { data: farmData, error: farmError } = await supabase
        .from('farms')
        .insert({
          owner_id: user.id,
          farm_name: farmName.trim(),
          district: district,
          village_or_town: village.trim() || null,
          area_value: parsedArea,
          area_unit: areaUnit,
          notes: farmNotes.trim() || null,
        })
        .select()
        .single();

      if (farmError) {
        throw new Error(`Farm creation failed: ${farmError.message}`);
      }

      // 3. Insert Optional Crop if selected
      if (!skipCrop && cropName.trim()) {
        const { error: cropError } = await supabase.from('farm_crops').insert({
          owner_id: user.id,
          farm_id: farmData.id,
          crop_name: cropName.trim(),
          crop_variety: cropVariety.trim() || null,
          growth_stage: growthStage,
          planting_date: plantingDate || null,
          health_status: 'healthy',
        });

        if (cropError) {
          console.warn('Initial crop insertion warning:', cropError.message);
        }
      }

      // 4. Mark onboarding as completed
      const { error: completeError } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (completeError) {
        throw new Error(`Failed to finalize onboarding: ${completeError.message}`);
      }

      setSuccessMessage(
        t('onboarding.success', 'Onboarding completed successfully! Loading your dashboard...')
      );
      await refreshProfile();

      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving your details. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 items-center justify-center font-bold mb-1">
          <Sparkles className="w-6 h-6 text-emerald-700" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {t('onboarding.title', 'Welcome to KrishiMitra')}
        </h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          {t(
            'onboarding.subtitle',
            "Let's set up your profile and primary farm in Kerala in a few quick steps."
          )}
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            step === 1
              ? 'bg-emerald-700 text-white shadow-xs'
              : step > 1
              ? 'bg-emerald-100 text-emerald-900'
              : 'bg-stone-100 text-stone-400'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
            1
          </span>
          <span className="hidden sm:inline">{t('onboarding.step_1', 'Personal Profile')}</span>
        </div>

        <div className="w-6 h-0.5 bg-stone-200" />

        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            step === 2
              ? 'bg-emerald-700 text-white shadow-xs'
              : step > 2
              ? 'bg-emerald-100 text-emerald-900'
              : 'bg-stone-100 text-stone-400'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
            2
          </span>
          <span className="hidden sm:inline">{t('onboarding.step_2', 'Primary Farm')}</span>
        </div>

        <div className="w-6 h-0.5 bg-stone-200" />

        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            step === 3
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-400'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
            3
          </span>
          <span className="hidden sm:inline">{t('onboarding.step_3', 'First Crop')}</span>
        </div>
      </div>

      {!isConfigured && (
        <AlertBanner
          type="warning"
          title="Database Configuration Required"
          message="Supabase is not configured yet. Complete the steps in SUPABASE_SETUP.md and add keys to .env.local to persist profile and farm records."
        />
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-sm flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-snug">{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm flex items-start gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-snug">{successMessage}</div>
        </div>
      )}

      {/* Step 1: Personal Profile */}
      {step === 1 && (
        <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white">
          <CardContent className="p-0">
            <form onSubmit={handleNextStep1} className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">
                  {t('onboarding.step_1', 'Personal Profile')}
                </h3>
                <p className="text-xs text-stone-500">
                  Provide your farming identity and location in Kerala.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('auth.full_name_label', 'Farmer Full Name')} *
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
                    placeholder="e.g. Krishnan Nair / കൃഷ്ണൻ നായർ"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('auth.preferred_language_label', 'Preferred Language')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <select
                    value={prefLang}
                    onChange={(e) => {
                      const l = e.target.value as SupportedLanguage;
                      setPrefLang(l);
                      setLanguage(l);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name} ({l.englishName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {t('onboarding.district_label', 'District in Kerala')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value as KeralaDistrict)}
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
                    {t('onboarding.village_label', 'Village / Town (Optional)')}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder={t('onboarding.village_placeholder', 'e.g. Mananthavady, Meppadi')}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full py-3 rounded-xl justify-center font-bold text-sm">
                  <span>{t('onboarding.next_step', 'Next: Primary Farm')}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Primary Farm */}
      {step === 2 && (
        <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white">
          <CardContent className="p-0">
            <form onSubmit={handleNextStep2} className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">
                  {t('onboarding.step_2', 'Primary Farm Details')}
                </h3>
                <p className="text-xs text-stone-500">
                  Register your main agricultural land holding in {district}, Kerala.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {t('onboarding.farm_name_label', 'Farm Name')} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    required
                    placeholder={t('onboarding.farm_name_placeholder', 'e.g. Green Valley Farm, Pamba Riverside')}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {t('onboarding.area_label', 'Total Land Area')} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={areaValue}
                    onChange={(e) => setAreaValue(e.target.value)}
                    required
                    placeholder="e.g. 2.5"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {t('onboarding.unit_label', 'Area Unit')} *
                  </label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer"
                  >
                    <option value="acres">Acres (ഏക്കർ)</option>
                    <option value="cents">Cents (സെന്റ്)</option>
                    <option value="hectares">Hectares (ഹെക്ടർ)</option>
                    <option value="sq_ft">Sq. Ft (ചതുരശ്ര അടി)</option>
                    <option value="sq_m">Sq. Meters (ചതുരശ്ര മീറ്റർ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Farm Notes / Soil Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={farmNotes}
                  onChange={(e) => setFarmNotes(e.target.value)}
                  placeholder="e.g. Fertile red loam soil with drip irrigation canal"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="py-3 px-5 rounded-xl text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('onboarding.prev_step', 'Previous')}
                </Button>
                <Button type="submit" className="flex-1 py-3 rounded-xl justify-center font-bold text-sm">
                  <span>{t('onboarding.next_step', 'Next: First Crop')}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: First Crop (Optional) */}
      {step === 3 && (
        <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white">
          <CardContent className="p-0">
            <form onSubmit={handleCompleteOnboarding} className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-1">
                    {t('onboarding.step_3', 'Register First Crop (Optional)')}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Add a standing crop now or skip and add anytime later from My Farm.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skipCrop}
                    onChange={(e) => setSkipCrop(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>{t('onboarding.skip_crop', 'Skip adding crop')}</span>
                </label>
              </div>

              {!skipCrop && (
                <div className="space-y-4 pt-2 border-t border-stone-100 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      {t('onboarding.crop_name_label', 'Crop Name')} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <select
                        value={cropName}
                        onChange={(e) => setCropName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer"
                      >
                        {COMMON_KERALA_CROPS.map((crop) => (
                          <option key={crop} value={crop}>
                            {crop}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {t('onboarding.variety_label', 'Variety (Optional)')}
                      </label>
                      <input
                        type="text"
                        value={cropVariety}
                        onChange={(e) => setCropVariety(e.target.value)}
                        placeholder="e.g. Uma, Jyothi, Karimunda"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        {t('onboarding.stage_label', 'Growth Stage')} *
                      </label>
                      <select
                        value={growthStage}
                        onChange={(e) => setGrowthStage(e.target.value as GrowthStage)}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer"
                      >
                        {GROWTH_STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      {t('onboarding.planting_date_label', 'Planting Date (Optional)')}
                    </label>
                    <input
                      type="date"
                      value={plantingDate}
                      onChange={(e) => setPlantingDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="py-3 px-5 rounded-xl text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('onboarding.prev_step', 'Previous')}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl justify-center font-bold text-sm shadow-md"
                >
                  {isLoading ? (
                    <span>{t('onboarding.saving', 'Saving Your Farm Details...')}</span>
                  ) : (
                    <>
                      <span>{t('onboarding.finish_btn', 'Complete Setup & Launch Dashboard')}</span>
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
