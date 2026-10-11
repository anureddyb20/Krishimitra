'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CloudSun,
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  ArrowLeft,
  Sparkles,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { KeralaDistrictSelector } from '@/components/common/KeralaDistrictSelector';
import { KeralaDistrict } from '@/types';

export default function WeatherPage() {
  const { t } = useTranslation();
  const [district, setDistrict] = useState<KeralaDistrict>('Wayanad');

  const fiveDayForecast = [
    { day: 'Today', temp: '24°C', rain: '25 mm', condition: 'Heavy Showers', wind: '14 km/h' },
    { day: 'Tomorrow', temp: '23°C', rain: '32 mm', condition: 'Moderate Rain', wind: '16 km/h' },
    { day: 'Day 3', temp: '25°C', rain: '14 mm', condition: 'Scattered Showers', wind: '12 km/h' },
    { day: 'Day 4', temp: '27°C', rain: '6 mm', condition: 'Partly Cloudy', wind: '10 km/h' },
    { day: 'Day 5', temp: '28°C', rain: '2 mm', condition: 'Sunny Intervals', wind: '9 km/h' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button and page title */}
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-emerald-700 transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back', 'Back to Dashboard')}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {t('modules.weather_title', 'Weather & Climate Intelligence')}
              </h1>
              <Badge variant="demo" size="sm">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Phase 3 Preview
              </Badge>
            </div>
            <p className="text-sm text-stone-600 mt-1">
              {t(
                'modules.weather_subtitle',
                'District-level microclimate data and agro-meteorological advisories from India Meteorological Department (IMD).'
              )}
            </p>
          </div>

          <KeralaDistrictSelector value={district} onChange={setDistrict} />
        </div>
      </div>

      <AlertBanner
        type="info"
        title="India Meteorological Department (IMD) Integration Planned"
        message="This module will consume real-time gridded satellite precipitation and Doppler radar forecasts directly from IMD and OpenWeather in Phase 3. The data below is simulated for interface demonstration."
      />

      {/* 5-Day Agro Forecast Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base sm:text-lg">
            <Calendar className="w-5 h-5 text-emerald-700" />
            5-Day Microclimate Forecast ({district} District)
          </CardTitle>
          <Badge variant="default" size="sm">
            Demonstration Forecast
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {fiveDayForecast.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:shadow-xs transition-all text-center space-y-2"
              >
                <span className="text-xs font-bold text-stone-600 block">{item.day}</span>
                <div className="py-2">
                  <CloudRain className="w-8 h-8 text-sky-600 mx-auto" />
                </div>
                <div className="text-lg font-extrabold text-stone-900">{item.temp}</div>
                <p className="text-xs font-medium text-sky-700">{item.condition}</p>
                <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 space-y-0.5">
                  <div>Rain: <span className="font-semibold text-stone-700">{item.rain}</span></div>
                  <div>Wind: <span className="font-semibold text-stone-700">{item.wind}</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kerala Agro-Climatic Advisory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cardamom & Black Pepper Guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-stone-700">
            <p>
              Due to consecutive wet days predicted in {district}, high relative humidity (above 85%) creates peak conditions for fungal spore proliferation.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-950 font-medium">
              Recommendation: Ensure vine basins are freed of weeds to improve aerated ventilation and reduce humidity pooling near root crowns.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Paddy & Wetland Advisory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-stone-700">
            <p>
              Runoff accumulation expected in low-lying channels. Inspect water drainage sluices and bund heights.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-950 font-medium">
              Recommendation: Postpone top-dressing of urea until high runoff subsides to prevent nitrogen leaching.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
