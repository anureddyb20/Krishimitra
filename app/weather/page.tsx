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
  RefreshCw,
  Clock,
  Sun,
  CloudDrizzle,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { LocationSelector } from '@/components/common/LocationSelector';

export default function WeatherPage() {
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();

  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [activeWeatherTab, setActiveWeatherTab] = useState<'daily' | 'hourly' | 'advisory'>('daily');
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const convertTemp = (tempC: number) => {
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${tempC}°C`;
  };

  const fiveDayForecast = [
    { day: 'Today', tempC: 28, rain: '12 mm', condition: 'Passing Showers', wind: '14 km/h', humidity: '78%' },
    { day: 'Tomorrow', tempC: 29, rain: '5 mm', condition: 'Partly Cloudy', wind: '11 km/h', humidity: '72%' },
    { day: 'Day 3', tempC: 31, rain: '0 mm', condition: 'Sunny & Warm', wind: '10 km/h', humidity: '65%' },
    { day: 'Day 4', tempC: 30, rain: '2 mm', condition: 'Isolated Clouds', wind: '9 km/h', humidity: '68%' },
    { day: 'Day 5', tempC: 29, rain: '8 mm', condition: 'Evening Breeze', wind: '12 km/h', humidity: '74%' },
  ];

  const hourlyForecast = [
    { time: '06:00 AM', tempC: 24, pop: '10%', condition: 'Clear Dawn' },
    { time: '09:00 AM', tempC: 27, pop: '20%', condition: 'Bright Sun' },
    { time: '12:00 PM', tempC: 30, pop: '35%', condition: 'Cloud Build-up' },
    { time: '03:00 PM', tempC: 28, pop: '65%', condition: 'Light Shower' },
    { time: '06:00 PM', tempC: 26, pop: '40%', condition: 'Drizzle' },
    { time: '09:00 PM', tempC: 25, pop: '15%', condition: 'Cool Breeze' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
    }, 600);
  };

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

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveWeatherTab('daily')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeWeatherTab === 'daily'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            5-Day Forecast
          </button>
          <button
            type="button"
            onClick={() => setActiveWeatherTab('hourly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeWeatherTab === 'hourly'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            24-Hour Trend
          </button>
          <button
            type="button"
            onClick={() => setActiveWeatherTab('advisory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeWeatherTab === 'advisory'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Crop Advisories
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Temperature unit switch */}
          <div className="flex items-center rounded-xl border border-stone-200 p-0.5 bg-stone-50 text-xs font-bold">
            <button
              type="button"
              onClick={() => setUnit('C')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                unit === 'C' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-500'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => setUnit('F')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                unit === 'F' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-500'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-emerald-800 p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-700' : ''}`} />
            <span className="hidden sm:inline">Updated: {lastRefreshed}</span>
          </button>
        </div>
      </div>

      {/* 5-Day Agro Forecast Cards */}
      {activeWeatherTab === 'daily' && (
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
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition-all text-center space-y-2"
                >
                  <span className="text-xs font-bold text-stone-600 block">{item.day}</span>
                  <div className="py-2">
                    {item.rain !== '0 mm' ? (
                      <CloudRain className="w-8 h-8 text-sky-600 mx-auto" />
                    ) : (
                      <CloudSun className="w-8 h-8 text-amber-500 mx-auto" />
                    )}
                  </div>
                  <div className="text-xl font-extrabold text-stone-900">{convertTemp(item.tempC)}</div>
                  <p className="text-xs font-semibold text-emerald-700">{item.condition}</p>
                  <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 space-y-0.5">
                    <div>Rain: <span className="font-semibold text-stone-700">{item.rain}</span></div>
                    <div>Humidity: <span className="font-semibold text-stone-700">{item.humidity}</span></div>
                    <div>Wind: <span className="font-semibold text-stone-700">{item.wind}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hourly Trend View */}
      {activeWeatherTab === 'hourly' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base sm:text-lg">
              <Clock className="w-5 h-5 text-sky-700" />
              24-Hour Precipitation & Temperature Probability ({selectedDistrict})
            </CardTitle>
            <Badge variant="default" size="sm">
              Hourly IMD Model
            </Badge>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {hourlyForecast.map((h, i) => (
                <div key={i} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-500 block">{h.time}</span>
                  <div className="text-base font-extrabold text-stone-900">{convertTemp(h.tempC)}</div>
                  <span className="inline-block text-[11px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
                    Rain {h.pop}
                  </span>
                  <p className="text-[10px] text-stone-500">{h.condition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-950 font-medium space-y-1">
              <span className="font-bold block">Agronomic Recommendation:</span>
              <span>
                Plan scheduled top dressing and inter-cultivation weeding during upcoming dry sunshine windows (Day 3 & Day 4).
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Horticulture & Cash Crop Advisory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-stone-700">
            <p>
              Light scattered showers expected today. Ensure mulch cover around tree and plant basins to conserve subterranean soil moisture.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-950 font-medium space-y-1">
              <span className="font-bold block">Sprinkler Precaution:</span>
              <span>
                Regulate micro-sprinklers based on soil tensiometer readings and postpone foliar spray until wind speed drops below 10 km/h.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
