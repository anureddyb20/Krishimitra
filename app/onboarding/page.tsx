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
  CloudSun,
  ShieldCheck,
  Compass,
  Droplets,
  Sliders,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth, DEMO_USER_ID } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { KeralaDistrict, AreaUnit, GrowthStage, Farm, FarmPlot, FarmCrop } from '@/types/database';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/config';
import { SupportedLanguage } from '@/types/i18n';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
  'Black Pepper / കുരുമുളക്',
  'Cardamom / ഏലം',
  'Rubber / റബ്ബർ',
  'Coconut / തെങ്ങ്',
  'Banana (Nendran) / ഏത്തവാഴ',
  'Paddy (Rice) / നെല്ല്',
  'Coffee / കാപ്പി',
  'Arecanut / അടക്ക',
  'Ginger / ഇഞ്ചി',
  'Turmeric / മഞ്ഞൾ',
  'Tea / തേയില',
  'Nutmeg / ജാതിക്ക',
  'Vegetables / പച്ചക്കറികൾ',
];

interface AIAllocatedPlot {
  name: string;
  zoneType: string;
  fraction: number;
  area: number;
  crop: string;
  weatherStrategy: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const { user, profile, isConfigured, refreshProfile, updateProfile } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Farmer & District
  const [fullName, setFullName] = useState(profile?.full_name || 'Anil Kumar (അനിൽ കുമാർ)');
  const [prefLang, setPrefLang] = useState<SupportedLanguage>(language);
  const [district, setDistrict] = useState<KeralaDistrict>((profile?.district as KeralaDistrict) || 'Wayanad');
  const [village, setVillage] = useState(profile?.village_or_town || 'Meppadi');

  // Step 2: Total Land & Farm Setup
  const [farmName, setFarmName] = useState('Sahyadri Bio Farm');
  const [areaValue, setAreaValue] = useState('3.0');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('acres');
  const [terrain, setTerrain] = useState('Hill Slope & Mid-Plateau');
  const [waterSource, setWaterSource] = useState('South-West Monsoon + Stream Runoff');
  const [selectedCropInterests, setSelectedCropInterests] = useState<string[]>([
    'Black Pepper / കുരുമുളക്',
    'Cardamom / ഏലം',
    'Banana (Nendran) / ഏത്തവാഴ',
  ]);

  // Step 3: AI Land Division Plan
  const [aiPlots, setAiPlots] = useState<AIAllocatedPlot[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pre-fill from profile when loaded
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.preferred_language) setPrefLang(profile.preferred_language);
      if (profile.district) setDistrict(profile.district);
      if (profile.village_or_town) setVillage(profile.village_or_town);
    }
  }, [profile]);

  // Compute AI Land Division whenever entering Step 3 or when area/district changes
  useEffect(() => {
    const total = parseFloat(areaValue) || 3.0;

    // AI Division Logic based on Kerala Agro-Climatic Zones
    const plot1Area = Math.round(total * 0.45 * 100) / 100;
    const plot2Area = Math.round(total * 0.35 * 100) / 100;
    const plot3Area = Math.max(0.1, Math.round((total - plot1Area - plot2Area) * 100) / 100);

    const generatedPlots: AIAllocatedPlot[] = [
      {
        name: 'Plot A — Sloped Upper Ridge',
        zoneType: 'Well-Drained Hillside',
        fraction: 45,
        area: plot1Area,
        crop: selectedCropInterests[0] || 'Black Pepper / കുരുമുളക്',
        weatherStrategy:
          'Deep-root anchorage and terracing prevent topsoil loss during heavy South-West monsoon (Edavappathi) downpours.',
      },
      {
        name: 'Plot B — Mid-Plateau Canopy',
        zoneType: 'Agroforestry Shade Belt',
        fraction: 35,
        area: plot2Area,
        crop: selectedCropInterests[1] || 'Cardamom / ഏലം',
        weatherStrategy:
          'Multi-tier tree shade preserves microclimate soil moisture during February–April pre-monsoon heatwaves.',
      },
      {
        name: 'Plot C — Lowland Moisture Basin',
        zoneType: 'Alluvial Flat Basin',
        fraction: 20,
        area: plot3Area,
        crop: selectedCropInterests[2] || 'Banana (Nendran) / ഏത്തവാഴ',
        weatherStrategy:
          'Thrives on seasonal valley groundwater recharge; fast-growing catch crop harvested before flood risk.',
      },
    ];

    setAiPlots(generatedPlots);
  }, [areaValue, district, selectedCropInterests]);

  const toggleCropInterest = (crop: string) => {
    if (selectedCropInterests.includes(crop)) {
      if (selectedCropInterests.length > 1) {
        setSelectedCropInterests(selectedCropInterests.filter((c) => c !== crop));
      }
    } else {
      if (selectedCropInterests.length < 5) {
        setSelectedCropInterests([...selectedCropInterests, crop]);
      }
    }
  };

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
      setErrorMessage('Please enter a valid total land area greater than 0');
      return;
    }
    setStep(3);
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const parsedArea = parseFloat(areaValue) || 3.0;

    try {
      const isDemoMode = !isConfigured || user?.id === DEMO_USER_ID;

      if (isDemoMode) {
        // --- 1. DEMO MODE PERSISTENCE ---
        const farmId = 'demo-farm-kerala-' + Date.now();
        const demoFarm: Farm = {
          id: farmId,
          owner_id: user?.id || DEMO_USER_ID,
          farm_name: farmName.trim(),
          district,
          village_or_town: village.trim() || null,
          area_value: parsedArea,
          area_unit: areaUnit,
          notes: `Terrain: ${terrain} • Irrigation: ${waterSource}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const demoPlots: FarmPlot[] = aiPlots.map((p, idx) => ({
          id: `demo-plot-${farmId}-${idx + 1}`,
          farm_id: farmId,
          owner_id: user?.id || DEMO_USER_ID,
          plot_name: p.name,
          area_value: p.area,
          area_unit: areaUnit,
          soil_type: p.zoneType,
          irrigation_type: waterSource,
          notes: `AI Weather Strategy: ${p.weatherStrategy}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const demoCrops: FarmCrop[] = aiPlots.map((p, idx) => ({
          id: `demo-crop-${farmId}-${idx + 1}`,
          farm_id: farmId,
          plot_id: demoPlots[idx].id,
          owner_id: user?.id || DEMO_USER_ID,
          crop_name: p.crop,
          growth_stage: 'Vegetative',
          planting_date: new Date().toISOString().split('T')[0],
          area_value: p.area,
          area_unit: areaUnit,
          health_status: 'healthy',
          notes: p.weatherStrategy,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        // Save demo records to localStorage
        localStorage.setItem('krishimitra_demo_farms', JSON.stringify([demoFarm]));
        localStorage.setItem('krishimitra_demo_plots', JSON.stringify(demoPlots));
        localStorage.setItem('krishimitra_demo_crops', JSON.stringify(demoCrops));

        // Mark onboarding completed in demo profile
        await updateProfile({
          full_name: fullName.trim(),
          preferred_language: prefLang,
          district,
          village_or_town: village.trim() || null,
          onboarding_completed: true,
        });

        setSuccessMessage('AI Land Division & Farm successfully created! Redirecting to Dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 800);
        return;
      }

      // --- 2. LIVE SUPABASE PERSISTENCE ---
      const supabase = getSupabaseBrowserClient();
      if (!supabase || !user) {
        throw new Error('Supabase client unavailable.');
      }

      // Update Profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName.trim(),
        preferred_language: prefLang,
        district,
        village_or_town: village.trim() || null,
        onboarding_completed: true,
      });
      if (profileError) throw profileError;

      // Insert Farm
      const { data: farmData, error: farmError } = await supabase
        .from('farms')
        .insert({
          owner_id: user.id,
          farm_name: farmName.trim(),
          district,
          village_or_town: village.trim() || null,
          area_value: parsedArea,
          area_unit: areaUnit,
          notes: `Terrain: ${terrain} • Irrigation: ${waterSource}`,
        })
        .select()
        .single();
      if (farmError) throw farmError;

      // Insert the 3 AI-allocated plots
      for (const p of aiPlots) {
        const { data: plotData, error: plotErr } = await supabase
          .from('farm_plots')
          .insert({
            farm_id: farmData.id,
            owner_id: user.id,
            plot_name: p.name,
            area_value: p.area,
            area_unit: areaUnit,
            soil_type: p.zoneType,
            irrigation_type: waterSource,
            notes: p.weatherStrategy,
          })
          .select()
          .single();

        if (plotErr) console.warn('Plot insert warning:', plotErr.message);

        // Insert Crop for this plot
        if (plotData) {
          await supabase.from('farm_crops').insert({
            owner_id: user.id,
            farm_id: farmData.id,
            plot_id: plotData.id,
            crop_name: p.crop,
            growth_stage: 'Vegetative',
            planting_date: new Date().toISOString().split('T')[0],
            area_value: p.area,
            area_unit: areaUnit,
            health_status: 'healthy',
            notes: p.weatherStrategy,
          });
        }
      }

      await refreshProfile();
      setSuccessMessage('AI Land Division plan saved to cloud! Redirecting to Dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete onboarding setup.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 items-center justify-center font-bold mb-1 shadow-xs">
          <Sparkles className="w-6 h-6 text-emerald-700" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Farmer Onboarding & AI Land Division
        </h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          Tell us about your total land and crops so KrishiMitra AI can assist dividing your land for optimal weather resilience.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
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
          <span>Profile & District</span>
        </div>

        <div className="w-6 h-0.5 bg-stone-200" />

        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
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
          <span>Total Land & Crops</span>
        </div>

        <div className="w-6 h-0.5 bg-stone-200" />

        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            step === 3
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-400'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
            3
          </span>
          <span>AI Land Division</span>
        </div>
      </div>

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

      {/* STEP 1: Farmer Identity */}
      {step === 1 && (
        <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white">
          <CardContent className="p-0">
            <form onSubmit={handleNextStep1} className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">
                  1. Farmer Identity & Kerala Region
                </h3>
                <p className="text-xs text-stone-500">
                  Select your home district in Kerala to calibrate regional monsoon and agro-climatic intelligence.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Full Name / കർഷകന്റെ പേര് *
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
                    placeholder="e.g. Anil Kumar (അനിൽ കുമാർ)"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Preferred Interface Language *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <select
                    value={prefLang}
                    onChange={(e) => {
                      const newLang = e.target.value as SupportedLanguage;
                      setPrefLang(newLang);
                      setLanguage(newLang);
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

              {/* District & Town */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Kerala District *
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
                          {d} District
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Village or Town (Optional)
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Meppadi, Sultan Bathery"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-100">
                <Button type="submit" className="py-2.5 px-6 rounded-xl font-bold text-sm shadow-xs">
                  <span>Continue to Land & Crops</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Total Land & Existing Crops */}
      {step === 2 && (
        <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white">
          <CardContent className="p-0">
            <form onSubmit={handleNextStep2} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">
                  2. Farm Identity & Total Land Area
                </h3>
                <p className="text-xs text-stone-500">
                  Enter your total land size so our AI can calculate optimal plot divisions for varying weather patterns.
                </p>
              </div>

              {/* Farm Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Farm Name / തോട്ടത്തിന്റെ പേര് *
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
                    placeholder="e.g. Wayanad Bio Valley Farm"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              {/* Total Land Area and Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Total Land Size / ആകെ ഭൂമി *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      value={areaValue}
                      onChange={(e) => setAreaValue(e.target.value)}
                      required
                      placeholder="e.g. 3.5"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Unit of Measurement *
                  </label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer font-semibold"
                  >
                    <option value="acres">Acres (ഏക്കർ)</option>
                    <option value="cents">Cents (സെന്റ്)</option>
                    <option value="hectares">Hectares (ഹെക്ടർ)</option>
                    <option value="sq_ft">Square Feet (ചതുരശ്ര അടി)</option>
                  </select>
                </div>
              </div>

              {/* Topography & Water */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Terrain & Topography
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Compass className="w-4 h-4" />
                    </div>
                    <select
                      value={terrain}
                      onChange={(e) => setTerrain(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer"
                    >
                      <option value="Hill Slope & Mid-Plateau">Hill Slope & Mid-Plateau (മലഞ്ചെരിവ്)</option>
                      <option value="Valley Lowland / Basin">Valley Lowland / Basin (താഴ്‌വര)</option>
                      <option value="Terraced Slopes">Terraced Hillside (തട്ടുതട്ടായ ഭൂമി)</option>
                      <option value="Coastal Flat Plains">Coastal Flat Plains (തീരദേശം)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Primary Water & Irrigation
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <select
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer"
                    >
                      <option value="South-West Monsoon + Stream Runoff">Monsoon Rainfed + Stream (മഴയെ ആശ്രയിച്ച്)</option>
                      <option value="Borewell + Drip System">Borewell + Drip Irrigation (ബോർവെൽ)</option>
                      <option value="Open Well & Micro-sprinklers">Open Farm Well (തുറന്ന കിണർ)</option>
                      <option value="Canal / River lift">Canal Irrigation (കനാൽ വെള്ളം)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Select Crops of Interest */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Select Crops of Interest (Pick 2–4 crops) *
                </label>
                <p className="text-[11px] text-stone-500 mb-2.5">
                  Our AI will distribute these crops across your land depending on drainage, sun exposure, and rain patterns.
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_KERALA_CROPS.map((c) => {
                    const selected = selectedCropInterests.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCropInterest(c)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                          selected
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-emerald-300'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-5 rounded-xl text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button type="submit" className="py-2.5 px-6 rounded-xl font-bold text-sm shadow-xs">
                  <span>Generate AI Land Division</span>
                  <Sparkles className="w-4 h-4 ml-2 text-emerald-200" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: AI Smart Land Division & Weather-Pattern Advisory */}
      {step === 3 && (
        <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white space-y-6">
          <CardContent className="p-0">
            <form onSubmit={handleCompleteOnboarding} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-stone-900">
                      3. AI Land Division & Weather Adaptation
                    </h3>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      <Sparkles className="w-3 h-3 text-emerald-700" />
                      AI Calculated
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Total Land: <strong>{areaValue} {areaUnit}</strong> in <strong>{district} District</strong> ({terrain})
                  </p>
                </div>

                <div className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Kerala Monsoon Adaptive Model</span>
                </div>
              </div>

              {/* District Agro-Climatic Intelligence Banner */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-200/90 rounded-2xl space-y-1.5 text-xs text-stone-700">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Agronomic Weather Insight for {district}</span>
                </div>
                <p className="leading-relaxed">
                  {district === 'Wayanad' || district === 'Idukki'
                    ? 'High-altitude monsoon zone with heavy South-West rainfall (June–Aug) followed by cooler winters. Soil requires terraced drainage to prevent root fungal rot.'
                    : district === 'Palakkad'
                    ? 'Gap-pass dry wind zone with intense summer heat and moderate monsoon. Multi-canopy intercropping preserves critical soil moisture.'
                    : 'Coastal and midland humid tropical zone. High groundwater table suited for mixed coconut-banana-spice multi-story cropping.'}
                </p>
              </div>

              {/* The 3 AI Allocated Plots */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Recommended Plot Allocations (3 Weather-Optimized Zones)
                </label>

                <div className="grid grid-cols-1 gap-4">
                  {aiPlots.map((plot, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-stone-50/80 border border-stone-200 rounded-2xl hover:border-emerald-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-stone-900">{plot.name}</h4>
                            <span className="text-[11px] text-stone-500 font-medium">
                              Zone: {plot.zoneType} • {plot.fraction}% of total farm
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <span className="text-xs bg-white border border-stone-200 px-2.5 py-1 rounded-lg font-extrabold text-emerald-950 shadow-2xs">
                            {plot.area} {areaUnit}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                            Assigned Crop
                          </span>
                          <input
                            type="text"
                            value={plot.crop}
                            onChange={(e) => {
                              const updated = [...aiPlots];
                              updated[idx].crop = e.target.value;
                              setAiPlots(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                            Weather-Resilience Reason
                          </span>
                          <p className="text-[11px] text-stone-600 leading-snug">
                            {plot.weatherStrategy}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="py-3 px-5 rounded-xl text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-xl justify-center font-bold text-sm shadow-md bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
                >
                  {isLoading ? (
                    <span>Allocating Plots & Finalizing Setup...</span>
                  ) : (
                    <>
                      <span>Approve AI Land Allocation & Finish Setup</span>
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
