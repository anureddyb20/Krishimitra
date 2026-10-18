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
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { useAuth, DEMO_USER_ID } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { AreaUnit, GrowthStage, Farm, FarmPlot, FarmCrop } from '@/types/database';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/config';
import { SupportedLanguage } from '@/types/i18n';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Pan-Indian Multilingual Crop Definitions
interface PanIndianCrop {
  id: string;
  englishName: string;
  nativeNames: Partial<Record<SupportedLanguage, string>>;
  topStates: string[];
}

const PAN_INDIAN_CROPS: PanIndianCrop[] = [
  {
    id: 'sugarcane',
    englishName: 'Sugarcane',
    nativeNames: { kn: 'ಕಬ್ಬು', te: 'చెరకు', ta: 'கரும்பு', ml: 'കരിമ്പ്', hi: 'गन्ना' },
    topStates: ['Karnataka', 'Maharashtra', 'Uttar Pradesh', 'Tamil Nadu', 'Andhra Pradesh'],
  },
  {
    id: 'ragi',
    englishName: 'Ragi (Finger Millet)',
    nativeNames: { kn: 'ರಾಗಿ', te: 'రాగులు', ta: 'கேழ்வரகு', ml: 'കൂവരക് / റാഗി', hi: 'रागी' },
    topStates: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Maharashtra'],
  },
  {
    id: 'paddy',
    englishName: 'Paddy (Rice)',
    nativeNames: { kn: 'ಭತ್ತ', te: 'వరి', ta: 'நெல்', ml: 'നെല്ല്', hi: 'धान / चावल' },
    topStates: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Kerala', 'Punjab', 'Uttar Pradesh', 'Bihar', 'Haryana'],
  },
  {
    id: 'cotton',
    englishName: 'Cotton',
    nativeNames: { kn: 'ಹತ್ತಿ', te: 'ప్రత్తి', ta: 'பருத்தி', ml: 'പരുത്തി', hi: 'कपास' },
    topStates: ['Karnataka', 'Telangana', 'Andhra Pradesh', 'Maharashtra', 'Gujarat', 'Punjab', 'Haryana', 'Rajasthan'],
  },
  {
    id: 'coffee',
    englishName: 'Coffee',
    nativeNames: { kn: 'ಕಾಫಿ', te: 'కాఫీ', ta: 'காபி', ml: 'കാപ്പി', hi: 'कॉफ़ी' },
    topStates: ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh'],
  },
  {
    id: 'arecanut',
    englishName: 'Arecanut (Betel Nut)',
    nativeNames: { kn: 'ಅಡಿಕೆ', te: 'పోకచెక్క', ta: 'பாக்கு', ml: 'അടക്ക', hi: 'सुपारी' },
    topStates: ['Karnataka', 'Kerala', 'Tamil Nadu'],
  },
  {
    id: 'maize',
    englishName: 'Maize (Corn)',
    nativeNames: { kn: 'ಮೆಕ್ಕೆಜೋಳ', te: 'మొక్కజొన్న', ta: 'மக்காச்சோளம்', ml: 'മക്കച്ചോളം', hi: 'मक्का' },
    topStates: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Bihar', 'Madhya Pradesh', 'Rajasthan', 'Maharashtra'],
  },
  {
    id: 'chilli',
    englishName: 'Chilli',
    nativeNames: { kn: 'ಮೆಣಸಿನಕಾಯಿ', te: 'మిరప', ta: 'மிளகாய்', ml: 'മുളക്', hi: 'मिर्च' },
    topStates: ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Madhya Pradesh', 'Maharashtra'],
  },
  {
    id: 'turmeric',
    englishName: 'Turmeric',
    nativeNames: { kn: 'ಅರಿಶಿನ', te: 'పసుపు', ta: 'மஞ்சள்', ml: 'മഞ്ഞൾ', hi: 'हल्दी' },
    topStates: ['Telangana', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Kerala'],
  },
  {
    id: 'banana',
    englishName: 'Banana',
    nativeNames: { kn: 'ಬಾಳೆ', te: 'అరటి', ta: 'வாழை', ml: 'നേന്ത്രവാഴ / ഏത്തവാഴ', hi: 'केला' },
    topStates: ['Tamil Nadu', 'Kerala', 'Karnataka', 'Maharashtra', 'Andhra Pradesh', 'Gujarat'],
  },
  {
    id: 'coconut',
    englishName: 'Coconut Palm',
    nativeNames: { kn: 'ತೆಂಗು', te: 'కొబ్బరి', ta: 'தென்னை', ml: 'തെങ്ങ്', hi: 'नारियल' },
    topStates: ['Kerala', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh'],
  },
  {
    id: 'black_pepper',
    englishName: 'Black Pepper',
    nativeNames: { kn: 'ಕಾಳುಮೆಣಸು', te: 'మిరియాలు', ta: 'மிளகு', ml: 'കുരുമുളക്', hi: 'काली मिर्च' },
    topStates: ['Kerala', 'Karnataka', 'Tamil Nadu'],
  },
  {
    id: 'cardamom',
    englishName: 'Cardamom',
    nativeNames: { kn: 'ಏಲಕ್ಕಿ', te: 'యాలకులు', ta: 'ஏலக்காய்', ml: 'ഏലം', hi: 'इलायची' },
    topStates: ['Kerala', 'Karnataka', 'Tamil Nadu'],
  },
  {
    id: 'ginger',
    englishName: 'Ginger',
    nativeNames: { kn: 'ಶುಂಠಿ', te: 'అల్లం', ta: 'இஞ்சி', ml: 'ഇഞ്ചി', hi: 'अदरक' },
    topStates: ['Kerala', 'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Gujarat'],
  },
  {
    id: 'groundnut',
    englishName: 'Groundnut (Peanut)',
    nativeNames: { kn: 'ಕಡಲೆಕಾಯಿ', te: 'వేరుశనగ', ta: 'வேர்க்கடலை', ml: 'നിലക്കടല', hi: 'मूंगफली' },
    topStates: ['Gujarat', 'Rajasthan', 'Tamil Nadu', 'Andhra Pradesh', 'Karnataka'],
  },
  {
    id: 'wheat',
    englishName: 'Wheat',
    nativeNames: { kn: 'ಗೋಧಿ', te: 'గోధుమ', ta: 'கோதுமை', ml: 'ഗോതമ്പ്', hi: 'गेहूं' },
    topStates: ['Uttar Pradesh', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Rajasthan', 'Bihar'],
  },
  {
    id: 'soybean',
    englishName: 'Soybean',
    nativeNames: { kn: 'ಸೋಯಾಬೀನ್', te: 'సోయాబీన్', ta: 'சோயாபீன்', ml: 'സോയാബീൻ', hi: 'सोयाबीन' },
    topStates: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka'],
  },
  {
    id: 'mustard',
    englishName: 'Mustard',
    nativeNames: { kn: 'ಸಾಸಿವೆ', te: 'ఆవాలు', ta: 'கடுகு', ml: 'കടുക്', hi: 'सरसों' },
    topStates: ['Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Haryana', 'Punjab'],
  },
  {
    id: 'rubber',
    englishName: 'Rubber',
    nativeNames: { kn: 'ರಬ್ಬರ್', te: 'రబ్బర్', ta: 'ரப்பர்', ml: 'റബ്ബർ', hi: 'रबर' },
    topStates: ['Kerala', 'Karnataka', 'Tamil Nadu'],
  },
  {
    id: 'tea',
    englishName: 'Tea',
    nativeNames: { kn: 'ಚಹಾ', te: 'తేయాకు', ta: 'தேயிலை', ml: 'തേയില', hi: 'चाय' },
    topStates: ['Kerala', 'Tamil Nadu', 'Karnataka'],
  },
  {
    id: 'vegetables',
    englishName: 'Vegetables & Pulses',
    nativeNames: { kn: 'ತರಕಾರಿಗಳು', te: 'కూరగాయలు', ta: 'காய்கறிகள்', ml: 'പച്ചക്കറികൾ', hi: 'सब्जियां व दालें' },
    topStates: ['Karnataka', 'Maharashtra', 'Uttar Pradesh', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala', 'Bihar'],
  },
  {
    id: 'fruits',
    englishName: 'Fruits & Horticulture',
    nativeNames: { kn: 'ಹಣ್ಣುಗಳು', te: 'పండ్లు', ta: 'பழங்கள்', ml: 'പഴവർഗ്ഗങ്ങൾ', hi: 'फल व बागवानी' },
    topStates: ['Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Gujarat', 'Tamil Nadu', 'Kerala'],
  },
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
  const {
    selectedState,
    selectedDistrict,
    setSelectedState,
    setSelectedDistrict,
    availableStates,
    availableDistricts,
  } = useLocation();

  const { user, profile, isConfigured, refreshProfile, updateProfile } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Farmer & Regional Location
  const [fullName, setFullName] = useState(profile?.full_name || 'Anil Kumar');
  const [village, setVillage] = useState(profile?.village_or_town || 'Belagavi Rural');

  // Step 2: Total Land & Farm Setup
  const [farmName, setFarmName] = useState('Green Valley Farm');
  const [areaValue, setAreaValue] = useState('3.0');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('acres');
  const [terrain, setTerrain] = useState('Plains / Flat Farmland');
  const [waterSource, setWaterSource] = useState('Borewell + Drip Irrigation');

  // Selected crop interests (English names used as stable IDs)
  const [selectedCropInterests, setSelectedCropInterests] = useState<string[]>([]);

  // Step 3: AI Land Division Plan
  const [aiPlots, setAiPlots] = useState<AIAllocatedPlot[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync profile details when profile is loaded
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.village_or_town) setVillage(profile.village_or_town);
      if (profile.state && availableStates.includes(profile.state)) {
        setSelectedState(profile.state);
      }
      if (profile.district && availableDistricts.includes(profile.district)) {
        setSelectedDistrict(profile.district);
      }
    }
  }, [profile]);

  // Set default initial crop selection based on state
  useEffect(() => {
    if (selectedCropInterests.length === 0) {
      if (selectedState === 'Karnataka') {
        setSelectedCropInterests(['Sugarcane', 'Ragi (Finger Millet)', 'Coffee']);
      } else if (selectedState === 'Kerala') {
        setSelectedCropInterests(['Black Pepper', 'Cardamom', 'Banana']);
      } else if (selectedState === 'Andhra Pradesh' || selectedState === 'Telangana') {
        setSelectedCropInterests(['Cotton', 'Chilli', 'Maize (Corn)']);
      } else if (selectedState === 'Maharashtra') {
        setSelectedCropInterests(['Soybean', 'Cotton', 'Sugarcane']);
      } else if (selectedState === 'Tamil Nadu') {
        setSelectedCropInterests(['Paddy (Rice)', 'Sugarcane', 'Banana']);
      } else {
        setSelectedCropInterests(['Wheat', 'Paddy (Rice)', 'Mustard']);
      }
    }
  }, [selectedState, selectedCropInterests.length]);

  // Sort crops so crops relevant to the selected state appear first
  const sortedCrops = [...PAN_INDIAN_CROPS].sort((a, b) => {
    const aMatch = a.topStates.includes(selectedState);
    const bMatch = b.topStates.includes(selectedState);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  // Helper to format crop label strictly according to active language (NO Malayalam in English!)
  const getCropDisplayLabel = (crop: PanIndianCrop): string => {
    if (language === 'ml') {
      const mlName = crop.nativeNames.ml;
      return mlName ? `${mlName} (${crop.englishName})` : crop.englishName;
    }
    if (language === 'kn') {
      const knName = crop.nativeNames.kn;
      return knName ? `${knName} (${crop.englishName})` : crop.englishName;
    }
    if (language === 'te') {
      const teName = crop.nativeNames.te;
      return teName ? `${teName} (${crop.englishName})` : crop.englishName;
    }
    if (language === 'ta') {
      const taName = crop.nativeNames.ta;
      return taName ? `${taName} (${crop.englishName})` : crop.englishName;
    }
    if (language === 'hi') {
      const hiName = crop.nativeNames.hi;
      return hiName ? `${hiName} (${crop.englishName})` : crop.englishName;
    }
    return crop.englishName;
  };

  // Helper for weather-resilient AI Land Division calculation
  useEffect(() => {
    const total = parseFloat(areaValue) || 3.0;

    const plot1Area = Math.round(total * 0.45 * 100) / 100;
    const plot2Area = Math.round(total * 0.35 * 100) / 100;
    const plot3Area = Math.max(0.1, Math.round((total - plot1Area - plot2Area) * 100) / 100);

    const c1 = selectedCropInterests[0] || sortedCrops[0]?.englishName || 'Paddy (Rice)';
    const c2 = selectedCropInterests[1] || sortedCrops[1]?.englishName || 'Sugarcane';
    const c3 = selectedCropInterests[2] || sortedCrops[2]?.englishName || 'Vegetables & Pulses';

    let strat1 = 'Optimized drainage and sun-facing ridge parceling protect root architecture during peak monsoon rainfall.';
    let strat2 = 'Windbreak shelterbelt and micro-sprinklers preserve essential soil moisture during post-monsoon dry spells.';
    let strat3 = 'Lowland water catchment zone utilizes natural gradient recharge to support secondary catch crops.';

    if (selectedState === 'Karnataka') {
      strat1 = 'Upper loam contour terracing maximizes Kharif soil moisture retention across the Krishna/Deccan plateau.';
      strat2 = 'Semi-shaded inter-plot zone reduces solar evapotranspiration during hot pre-monsoon summer months.';
      strat3 = 'Alluvial drainage basin captures canal runoff and avoids root waterlogging during heavy convective showers.';
    } else if (selectedState === 'Kerala') {
      strat1 = 'Sloped ridge contour bunds prevent topsoil washaway during torrential South-West monsoon (Edavappathi) downpours.';
      strat2 = 'Agroforestry shade canopy buffers humidity and shields tender spice vines from mid-day heat spikes.';
      strat3 = 'Moisture-rich lowland parcel thrives on seasonal riverbank groundwater recharge.';
    } else if (selectedState === 'Andhra Pradesh' || selectedState === 'Telangana') {
      strat1 = 'Deep black-cotton ridge division improves aeration and prevents standing water pooling during stormy cyclonic depressions.';
      strat2 = 'Precision drip lines minimize evaporation under intense Deccan plateau solar radiation.';
      strat3 = 'Groundwater-recharged sub-plot provides safe buffer cropping against erratic monsoon dry breaks.';
    }

    const generatedPlots: AIAllocatedPlot[] = [
      {
        name: 'Plot A — Primary Upper Parcel',
        zoneType: 'Well-Drained Upper Loam',
        fraction: 45,
        area: plot1Area,
        crop: c1,
        weatherStrategy: strat1,
      },
      {
        name: 'Plot B — Central Mid-Canopy',
        zoneType: 'Moisture-Retention Belt',
        fraction: 35,
        area: plot2Area,
        crop: c2,
        weatherStrategy: strat2,
      },
      {
        name: 'Plot C — Lower Basin Parcel',
        zoneType: 'Alluvial Runoff Basin',
        fraction: 20,
        area: plot3Area,
        crop: c3,
        weatherStrategy: strat3,
      },
    ];

    setAiPlots(generatedPlots);
  }, [areaValue, selectedState, selectedDistrict, selectedCropInterests]);

  const toggleCropInterest = (cropName: string) => {
    if (selectedCropInterests.includes(cropName)) {
      if (selectedCropInterests.length > 1) {
        setSelectedCropInterests(selectedCropInterests.filter((c) => c !== cropName));
      }
    } else {
      if (selectedCropInterests.length < 5) {
        setSelectedCropInterests([...selectedCropInterests, cropName]);
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
        const farmId = 'demo-farm-' + Date.now();
        const demoFarm: Farm = {
          id: farmId,
          owner_id: user?.id || DEMO_USER_ID,
          farm_name: farmName.trim(),
          state: selectedState,
          district: selectedDistrict,
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
          notes: `AI Strategy: ${p.weatherStrategy}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const demoCrops: FarmCrop[] = aiPlots.map((p, idx) => ({
          id: `demo-crop-${farmId}-${idx + 1}`,
          farm_id: farmId,
          plot_id: demoPlots[idx].id,
          owner_id: user?.id || DEMO_USER_ID,
          crop_name: p.crop,
          crop_variety: null,
          growth_stage: 'Vegetative',
          planting_date: new Date().toISOString().split('T')[0],
          expected_harvest_date: null,
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
          preferred_language: language,
          state: selectedState,
          district: selectedDistrict,
          village_or_town: village.trim() || null,
          onboarding_completed: true,
        });

        setSuccessMessage('AI Land Division & Farm setup successfully created! Redirecting to Dashboard...');
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
        preferred_language: language,
        state: selectedState,
        district: selectedDistrict,
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
          state: selectedState,
          district: selectedDistrict,
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
          {language === 'ml' ? 'കർഷക വിവരങ്ങളും AI ഭൂമി തരംതിരിക്കലും' : 'Farmer Onboarding & AI Land Division'}
        </h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          {language === 'ml'
            ? 'നിങ്ങളുടെ ആകെ ഭൂമിയും വിളകളും നൽകുക; കാലാവസ്ഥയ്ക്ക് അനുയോജ്യമായി കൃഷിഭൂമി തരംതിരിക്കാൻ AI സഹായിക്കും.'
            : 'Tell us about your total land and crops so KrishiMitra AI can assist dividing your land for optimal weather resilience across any Indian state.'}
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
          <span>{language === 'ml' ? 'കർഷക വിവരങ്ങൾ' : 'Profile & State'}</span>
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
          <span>{language === 'ml' ? 'ആകെ ഭൂമിയും വിളകളും' : 'Total Land & Crops'}</span>
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
          <span>{language === 'ml' ? 'AI ഭൂമി വിഭജനം' : 'AI Land Division'}</span>
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

      {/* STEP 1: Farmer Identity & Location */}
      {step === 1 && (
        <Card className="shadow-lg border-stone-200/90 rounded-3xl p-6 sm:p-8 bg-white">
          <CardContent className="p-0">
            <form onSubmit={handleNextStep1} className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">
                  {language === 'ml' ? '1. കർഷക വിവരങ്ങളും പ്രദേശവും' : '1. Farmer Identity & Regional Location'}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'ml'
                    ? 'കാലാവസ്ഥാ പ്രവചനവും കൃഷി നിർദ്ദേശങ്ങളും കൃത്യമായി ലഭിക്കാൻ സംസ്ഥാനവും ജില്ലയും തിരഞ്ഞെടുക്കുക.'
                    : 'Select your state and home district to calibrate regional weather, monsoon intelligence, and crop advisories.'}
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {language === 'ml' ? 'കർഷകന്റെ പേര് *' : 'Farmer Full Name *'}
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
                    placeholder={language === 'ml' ? 'ഉദാ. അനിൽ കുമാർ' : 'e.g. Anil Kumar'}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              {/* Preferred Language (Synced with App Header) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {language === 'ml' ? 'തിരഞ്ഞെടുത്ത ഭാഷ *' : 'Preferred Interface Language *'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <select
                    value={language}
                    onChange={(e) => {
                      const newLang = e.target.value as SupportedLanguage;
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

              {/* State & District (Bidirectionally synced with Header LocationContext) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {language === 'ml' ? 'സംസ്ഥാനം *' : 'State in India *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer font-medium"
                    >
                      {availableStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {language === 'ml' ? 'ജില്ല *' : 'District *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer font-medium"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d} District
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Village or Town */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {language === 'ml' ? 'ഗ്രാമം അല്ലെങ്കിൽ പട്ടണം (ആവശ്യമെങ്കിൽ)' : 'Village or Town (Optional)'}
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Meppadi, Gokak, Mandya Rural"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-100">
                <Button type="submit" className="py-2.5 px-6 rounded-xl font-bold text-sm shadow-xs">
                  <span>{language === 'ml' ? 'ഭൂമിയും വിളകളും നൽകുക' : 'Continue to Land & Crops'}</span>
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
                  {language === 'ml' ? '2. ഫാം വിവരങ്ങളും ആകെ ഭൂമിയും' : '2. Farm Identity & Total Land Area'}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'ml'
                    ? 'കാലാവസ്ഥാ വ്യതിയാനങ്ങൾക്കനുസരിച്ച് കൃഷിഭൂമി തരംതിരിക്കാൻ സഹായിക്കുന്ന വിവരങ്ങൾ നൽകുക.'
                    : `Enter your total land size in ${selectedState} so our AI can calculate optimal plot divisions for varying weather patterns.`}
                </p>
              </div>

              {/* Farm Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  {language === 'ml' ? 'തോട്ടത്തിന്റെ പേര് *' : 'Farm Name *'}
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
                    placeholder={language === 'ml' ? 'ഉദാ. സഹ്യാദ്രി ജൈവ ഫാം' : 'e.g. Sahyadri Farm, Kaveri Bio Holding'}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              {/* Total Land Area and Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {language === 'ml' ? 'ആകെ ഭൂമി *' : 'Total Land Size *'}
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
                      placeholder="e.g. 3.0"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {language === 'ml' ? 'അളവ് യൂണിറ്റ് *' : 'Unit of Measurement *'}
                  </label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-900 cursor-pointer font-semibold"
                  >
                    <option value="acres">{language === 'ml' ? 'ഏക്കർ (Acres)' : 'Acres'}</option>
                    <option value="guntas">{language === 'ml' ? 'ഗുണ്ട (Guntas)' : 'Guntas'}</option>
                    <option value="cents">{language === 'ml' ? 'സെന്റ് (Cents)' : 'Cents'}</option>
                    <option value="hectares">{language === 'ml' ? 'ഹെക്ടർ (Hectares)' : 'Hectares'}</option>
                    <option value="sq_ft">{language === 'ml' ? 'ചതുരശ്ര അടി (Square Feet)' : 'Square Feet'}</option>
                  </select>
                </div>
              </div>

              {/* Topography & Water */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {language === 'ml' ? 'ഭൂപ്രകൃതി' : 'Terrain & Topography'}
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
                      <option value="Plains / Flat Farmland">{language === 'ml' ? 'സമതല കൃഷിഭൂമി (Plains)' : 'Plains / Flat Farmland'}</option>
                      <option value="Hill Slope & Mid-Plateau">{language === 'ml' ? 'മലഞ്ചെരിവ് (Hill Slope & Plateau)' : 'Hill Slope & Mid-Plateau'}</option>
                      <option value="Valley Lowland / Basin">{language === 'ml' ? 'താഴ്‌വര (Valley Basin)' : 'Valley Lowland / Basin'}</option>
                      <option value="Terraced Slopes">{language === 'ml' ? 'തട്ടുതട്ടായ ഭൂമി (Terraced Slopes)' : 'Terraced Slopes'}</option>
                      <option value="Semi-Arid Dryland">{language === 'ml' ? 'വരണ്ട പ്രദേശം (Dryland)' : 'Semi-Arid Dryland'}</option>
                      <option value="Canal Irrigated Belt">{language === 'ml' ? 'കനാൽ പാടശേഖരം (Canal Belt)' : 'Canal Irrigated Belt'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {language === 'ml' ? 'ജലസ്രോതസ്സും ജലസേചനവും' : 'Primary Water & Irrigation'}
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
                      <option value="Borewell + Drip Irrigation">{language === 'ml' ? 'ബോർവെൽ + തുള്ളിനന (Borewell & Drip)' : 'Borewell + Drip Irrigation'}</option>
                      <option value="Monsoon Rainfed + Stream Runoff">{language === 'ml' ? 'മഴയെ ആശ്രയിച്ച് + തോട് (Monsoon Rainfed)' : 'Monsoon Rainfed + Stream Runoff'}</option>
                      <option value="Open Farm Well & Micro-sprinklers">{language === 'ml' ? 'തുറന്ന കിണർ (Open Farm Well)' : 'Open Farm Well & Micro-sprinklers'}</option>
                      <option value="Canal / River lift">{language === 'ml' ? 'കനാൽ ജലസേചനം (Canal / River Lift)' : 'Canal / River Lift Network'}</option>
                      <option value="Farm Pond / Rainwater Harvesting">{language === 'ml' ? 'മഴവെള്ള സംഭരണി (Farm Pond)' : 'Farm Pond / Rainwater Harvesting Tank'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Select Crops of Interest */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  {language === 'ml'
                    ? 'വിളകൾ തിരഞ്ഞെടുക്കുക (2–4 വിളകൾ) *'
                    : `Select Crops of Interest in ${selectedState} (Pick 2–4 crops) *`}
                </label>
                <p className="text-[11px] text-stone-500 mb-2.5">
                  {language === 'ml'
                    ? 'മഴ, സൂര്യപ്രകാശം, ഡ്രെയിനേജ് എന്നിവ കണക്കിലെടുത്ത് നിങ്ങളുടെ ഭൂമിയിൽ വിളകൾ തരംതിരിക്കാൻ AI സഹായിക്കും.'
                    : 'Our AI analyzes drainage, sunlight exposure, and rainfall patterns to distribute these crops across your plots.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sortedCrops.map((c) => {
                    const selected = selectedCropInterests.includes(c.englishName);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCropInterest(c.englishName)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                          selected
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-emerald-300'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {getCropDisplayLabel(c)}
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
                  {language === 'ml' ? 'പിന്നോട്ട്' : 'Previous'}
                </Button>
                <Button type="submit" className="py-2.5 px-6 rounded-xl font-bold text-sm shadow-xs">
                  <span>{language === 'ml' ? 'AI ഭൂമി വിഭജനം തയ്യാറാക്കുക' : 'Generate AI Land Division'}</span>
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
                      {language === 'ml' ? '3. AI ഭൂമി വിഭജനവും കാലാവസ്ഥാ ക്രമീകരണവും' : '3. AI Land Division & Weather Adaptation'}
                    </h3>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      <Sparkles className="w-3 h-3 text-emerald-700" />
                      AI Calculated
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Total Land: <strong>{areaValue} {areaUnit}</strong> in <strong>{selectedDistrict} District, {selectedState}</strong> ({terrain})
                  </p>
                </div>

                <div className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{selectedState} Agro-Climatic Model</span>
                </div>
              </div>

              {/* Regional Agro-Climatic Intelligence Banner */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-200/90 rounded-2xl space-y-1.5 text-xs text-stone-700">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Agronomic Weather Insight for {selectedDistrict}, {selectedState}</span>
                </div>
                <p className="leading-relaxed">
                  {selectedState === 'Karnataka'
                    ? `${selectedDistrict} lies within Karnataka's rich agro-climatic corridor. Kharif monsoon rainfall followed by dry post-monsoon Rabi cycles allows optimal multi-crop parceling. Dividing your ${areaValue} ${areaUnit} into dedicated loam and drainage zones preserves soil moisture and prevents drought stress.`
                    : selectedState === 'Kerala'
                    ? `${selectedDistrict} belongs to the Western Ghats humid tropical monsoon belt. Heavy South-West rainfall requires sloped terracing to protect crop root systems, while mid-canopy zones protect sensitive spices from pre-monsoon heat.`
                    : selectedState === 'Andhra Pradesh' || selectedState === 'Telangana'
                    ? `${selectedDistrict} features fertile black-cotton and red sandy loam soils. Micro-irrigation zone parceling ensures optimal moisture delivery during hot summer periods and shields standing crops from erratic monsoon breaks.`
                    : selectedState === 'Maharashtra'
                    ? `${selectedDistrict} benefits from precision plot division balancing black soils with regulated irrigation for high-value commercial and pulse crops.`
                    : `Calibrated for ${selectedDistrict} District, ${selectedState}. AI parceling maximizes water use efficiency and matches local sun exposure with each crop's moisture needs.`}
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
                  {language === 'ml' ? 'പിന്നോട്ട്' : 'Previous'}
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
                      <span>{language === 'ml' ? 'ഭൂമി വിഭജനം സ്ഥിരീകരിച്ച് പൂർത്തിയാക്കുക' : 'Approve AI Land Allocation & Finish Setup'}</span>
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
