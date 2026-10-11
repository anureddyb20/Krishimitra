'use client';

import React from 'react';
import { CloudRain, Droplets, Wind, Thermometer, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LocationSelector } from '@/components/common/LocationSelector';

export function WeatherCard() {
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();

  // Simulated weather data based on the selected region
  const defaultWeather = {
    temp: 26,
    humidity: 78,
    rain: 15,
    wind: 12,
    advisory: `Favorable growing conditions in ${selectedDistrict}. Regular canal and drip irrigation advised for standing crops. Keep drainage paths open ahead of seasonal showers.`,
  };

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

        <div>
          <LocationSelector size="sm" />
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
              <span className="text-xl font-bold text-stone-900">{defaultWeather.temp}°C</span>
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
              <span className="text-xl font-bold text-stone-900">{defaultWeather.rain} mm</span>
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
              <span className="text-xl font-bold text-stone-900">{defaultWeather.humidity}%</span>
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
              <span className="text-xl font-bold text-stone-900">{defaultWeather.wind} km/h</span>
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
            <p className="text-emerald-900 leading-relaxed">{defaultWeather.advisory}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
