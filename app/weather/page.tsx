'use client';

import React from 'react';
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
import { useLocation } from '@/lib/LocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { LocationSelector } from '@/components/common/LocationSelector';

export default function WeatherPage() {
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();

  const fiveDayForecast = [
    { day: 'Today', temp: '28°C', rain: '12 mm', condition: 'Passing Showers', wind: '14 km/h' },
    { day: 'Tomorrow', temp: '29°C', rain: '5 mm', condition: 'Partly Cloudy', wind: '11 km/h' },
    { day: 'Day 3', temp: '31°C', rain: '0 mm', condition: 'Sunny & Warm', wind: '10 km/h' },
    { day: 'Day 4', temp: '30°C', rain: '2 mm', condition: 'Isolated Clouds', wind: '9 km/h' },
    { day: 'Day 5', temp: '29°C', rain: '8 mm', condition: 'Evening Breeze', wind: '12 km/h' },
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

          <LocationSelector />
        </div>
      </div>

      <AlertBanner
        type="info"
        title="India Meteorological Department (IMD) Integration Planned"
        message={`This module will consume real-time gridded precipitation and Doppler radar forecasts directly from IMD for ${selectedDistrict}, ${selectedState} in Phase 3. The data below is simulated for interface demonstration.`}
      />

      {/* 5-Day Agro Forecast Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base sm:text-lg">
            <Calendar className="w-5 h-5 text-emerald-700" />
            5-Day Microclimate Forecast ({selectedDistrict}, {selectedState})
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
                  <CloudSun className="w-8 h-8 text-amber-500 mx-auto" />
                </div>
                <div className="text-lg font-extrabold text-stone-900">{item.temp}</div>
                <p className="text-xs font-medium text-emerald-700">{item.condition}</p>
                <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 space-y-0.5">
                  <div>Rain: <span className="font-semibold text-stone-700">{item.rain}</span></div>
                  <div>Wind: <span className="font-semibold text-stone-700">{item.wind}</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agro-Climatic Advisory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Standing Field Crops Guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-stone-700">
            <p>
              Current relative humidity and soil moisture in {selectedDistrict} support active vegetative growth.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-950 font-medium">
              Recommendation: Plan scheduled top dressing and inter-cultivation weeding during upcoming dry sunshine windows.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Horticulture & Cash Crop Advisory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-stone-700">
            <p>
              Light scattered showers expected. Ensure mulch cover around tree basins to conserve subterranean soil moisture.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-950 font-medium">
              Recommendation: Regulate micro-sprinklers based on soil tensiometer readings.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
