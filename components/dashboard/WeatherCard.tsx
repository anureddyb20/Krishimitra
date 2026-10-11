'use client';

import React, { useState } from 'react';
import {
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  AlertCircle,
  Sparkles,
  Sun,
  CloudSun,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LocationSelector } from '@/components/common/LocationSelector';

export function WeatherCard() {
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();
  const [activeTab, setActiveTab] = useState<'current' | 'forecast'>('current');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  const baseTempC = 27;
  const tempDisplay =
    tempUnit === 'C' ? `${baseTempC}°C` : `${Math.round((baseTempC * 9) / 5 + 32)}°F`;

  const threeDayForecast = [
    { day: 'Tomorrow', temp: tempUnit === 'C' ? '28°C' : '82°F', rain: '14 mm', condition: 'Passing Showers' },
    { day: 'Day 2', temp: tempUnit === 'C' ? '30°C' : '86°F', rain: '2 mm', condition: 'Partly Sunny' },
    { day: 'Day 3', temp: tempUnit === 'C' ? '29°C' : '84°F', rain: '8 mm', condition: 'Evening Rain' },
  ];

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
            Microclimate agro-meteorology for {selectedDistrict}, {selectedState}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Toggle Button */}
          <button
            type="button"
            onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 font-bold hover:bg-stone-100 transition-colors text-stone-700 cursor-pointer"
            title="Toggle temperature unit"
          >
            °{tempUnit === 'C' ? 'F' : 'C'}
          </button>

          <LocationSelector size="sm" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-100 pb-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('current')}
            className={`pb-1 px-2 font-bold transition-colors cursor-pointer border-b-2 -mb-2 ${
              activeTab === 'current'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Current Weather
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('forecast')}
            className={`pb-1 px-2 font-bold transition-colors cursor-pointer border-b-2 -mb-2 ${
              activeTab === 'forecast'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            3-Day Micro Forecast
          </button>
        </div>

        {activeTab === 'current' ? (
          <>
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
                  <span className="text-xl font-bold text-stone-900">{tempDisplay}</span>
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
                  <span className="text-xl font-bold text-stone-900">18 mm</span>
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
                  <span className="text-xl font-bold text-stone-900">81%</span>
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
                  <span className="text-xl font-bold text-stone-900">13 km/h</span>
                </div>
              </div>
            </div>

            {/* Agronomic advisory for the selected district */}
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold text-emerald-950 block mb-0.5">
                  {t('dashboard.advisory_label', 'Agronomic Advisory:')} ({selectedDistrict}, {selectedState})
                </span>
                <p className="text-emerald-900 leading-relaxed">
                  Moderate showers anticipated in the region. Delay chemical foliar spraying until dry morning intervals. Maintain drainage clearing in low-lying crop basins.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {threeDayForecast.map((f, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 text-center space-y-1.5"
              >
                <span className="text-xs font-bold text-stone-700 block">{f.day}</span>
                <div className="text-lg font-extrabold text-stone-900">{f.temp}</div>
                <div className="text-xs text-sky-700 font-semibold">{f.condition}</div>
                <div className="text-[11px] text-stone-500">Expected Rain: {f.rain}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
