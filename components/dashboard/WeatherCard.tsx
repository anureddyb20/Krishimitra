'use client';

import React, { useState } from 'react';
import { CloudRain, Droplets, Wind, Thermometer, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { KeralaDistrictSelector } from '@/components/common/KeralaDistrictSelector';
import { KeralaDistrict } from '@/types';

export function WeatherCard() {
  const { t } = useTranslation();
  const [district, setDistrict] = useState<KeralaDistrict>('Idukki');

  // Simulated weather data per district region for demonstration
  const districtWeatherMap: Record<
    KeralaDistrict,
    { temp: number; humidity: number; rain: number; wind: number; advisory: string }
  > = {
    Idukki: {
      temp: 22,
      humidity: 88,
      rain: 34,
      wind: 16,
      advisory: 'Heavy afternoon showers in High Range. Delay copper fungicide spray on cardamom & pepper vines.',
    },
    Wayanad: {
      temp: 24,
      humidity: 82,
      rain: 22,
      wind: 12,
      advisory: 'Misty mornings with isolated rainfall. Monitor coffee robusta berries for fungal rots.',
    },
    Palakkad: {
      temp: 33,
      humidity: 62,
      rain: 4,
      wind: 18,
      advisory: 'Dry and hot conditions in the gap. Ensure scheduled canal irrigation for second crop paddy.',
    },
    Alappuzha: {
      temp: 29,
      humidity: 86,
      rain: 18,
      wind: 14,
      advisory: 'Kuttanad polder basins: regulate water drainage sluices ahead of coastal high tides.',
    },
    Kottayam: {
      temp: 28,
      humidity: 84,
      rain: 15,
      wind: 10,
      advisory: 'Rubber tapping recommended early morning before intermittent drizzle.',
    },
    Ernakulam: {
      temp: 30,
      humidity: 80,
      rain: 12,
      wind: 11,
      advisory: 'Maintain drainage channels in low-lying vegetable plots.',
    },
    Kozhikode: {
      temp: 29,
      humidity: 82,
      rain: 16,
      wind: 13,
      advisory: 'Coastal coconut plantations: inspect crown basins for rhinoceros beetle attack.',
    },
    Thiruvananthapuram: {
      temp: 31,
      humidity: 78,
      rain: 8,
      wind: 15,
      advisory: 'Favorable conditions for Nendran banana harvesting and transport to Nedumangad mandi.',
    },
    Kannur: {
      temp: 29,
      humidity: 83,
      rain: 20,
      wind: 14,
      advisory: 'Check cashew plantations for tea mosquito bug damage following precipitation.',
    },
    Kasaragod: {
      temp: 28,
      humidity: 85,
      rain: 25,
      wind: 16,
      advisory: 'Arecanut gardens: check bunches for Mahali (fruit rot) symptoms; prepare Bordeaux mixture.',
    },
    Kollam: {
      temp: 30,
      humidity: 79,
      rain: 10,
      wind: 12,
      advisory: 'Ideal soil moisture for organic mulching in tapioca and vegetable gardens.',
    },
    Malappuram: {
      temp: 30,
      humidity: 81,
      rain: 14,
      wind: 13,
      advisory: 'Good sun window between 9 AM - 2 PM for solar drying of harvested pepper berries.',
    },
    Pathanamthitta: {
      temp: 27,
      humidity: 86,
      rain: 26,
      wind: 12,
      advisory: 'River basin soils saturated. Defer chemical fertilizer application till rain subsides.',
    },
    Thrissur: {
      temp: 31,
      humidity: 76,
      rain: 9,
      wind: 14,
      advisory: 'Cole wetlands: prepare seedbeds for forthcoming Punja paddy sowing.',
    },
  };

  const current = districtWeatherMap[district] || districtWeatherMap['Idukki'];

  return (
    <Card className="border-emerald-200/90 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700" />

      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>{t('dashboard.weather_card_title', 'Agro-Weather Briefing')}</CardTitle>
            <Badge variant="demo" size="sm">
              <Sparkles className="w-3 h-3 inline mr-1" />
              {t('dashboard.weather_card_badge', 'Simulated')}
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Microclimate agro-meteorology for Kerala farmers
          </p>
        </div>

        <div>
          <KeralaDistrictSelector value={district} onChange={setDistrict} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metric tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-stone-500 uppercase block">
                {t('dashboard.temp', 'Temp')}
              </span>
              <span className="text-xl font-bold text-stone-900">{current.temp}°C</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-100 text-sky-800">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-stone-500 uppercase block">
                {t('dashboard.rainfall', 'Rainfall')}
              </span>
              <span className="text-xl font-bold text-stone-900">{current.rain} mm</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-800">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-stone-500 uppercase block">
                {t('dashboard.humidity', 'Humidity')}
              </span>
              <span className="text-xl font-bold text-stone-900">{current.humidity}%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-800">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-stone-500 uppercase block">
                {t('dashboard.wind', 'Wind')}
              </span>
              <span className="text-xl font-bold text-stone-900">{current.wind} km/h</span>
            </div>
          </div>
        </div>

        {/* Agronomic advisory for the district */}
        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold text-emerald-950 block mb-0.5">
              {t('dashboard.advisory_label', 'Agronomic Advisory:')} ({district} District)
            </span>
            <p className="text-emerald-900 leading-relaxed">{current.advisory}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
