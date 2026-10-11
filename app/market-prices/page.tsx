'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowLeft,
  Sparkles,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Calendar,
  X,
  SlidersHorizontal,
  BarChart3,
  Building2,
  FileText,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { formatCurrencyINR } from '@/lib/utils';

interface MandiItem {
  id: string;
  crop: string;
  regionalName: string;
  category: 'cereals' | 'pulses' | 'cash' | 'spices' | 'produce';
  mandi: string;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  unit: string;
  trend: string;
  isUp: boolean;
  arrivals: string;
  updated: string;
  history: number[];
}

export default function MarketPricesPage() {
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cereals' | 'pulses' | 'cash' | 'spices' | 'produce'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-desc' | 'price-asc' | 'gainers'>('default');
  const [activeItem, setActiveItem] = useState<MandiItem | null>(null);

  const rawMandiData: MandiItem[] = [
    {
      id: 'm1',
      crop: 'Paddy / Common Rice',
      regionalName: 'ಭತ್ತ / వరి / நெல் / നെല്ല് / धान',
      category: 'cereals',
      mandi: `${selectedDistrict} Main APMC Yard, ${selectedState}`,
      minPrice: 2280,
      modalPrice: 2450,
      maxPrice: 2560,
      unit: 'qtl',
      trend: '+2.8%',
      isUp: true,
      arrivals: '480 Quintals',
      updated: 'Today 10:30 AM',
      history: [2380, 2400, 2410, 2430, 2420, 2440, 2450],
    },
    {
      id: 'm2',
      crop: 'Medium Staple Cotton',
      regionalName: 'ಹತ್ತಿ / పత్తి / பருத்தி / कपास',
      category: 'cash',
      mandi: `${selectedDistrict} Cotton Market Yard, ${selectedState}`,
      minPrice: 6850,
      modalPrice: 7120,
      maxPrice: 7350,
      unit: 'qtl',
      trend: '+1.6%',
      isUp: true,
      arrivals: '310 Quintals',
      updated: 'Today 11:15 AM',
      history: [6950, 7000, 7050, 7020, 7080, 7100, 7120],
    },
    {
      id: 'm3',
      crop: 'Maize / Yellow Corn',
      regionalName: 'ಮಕ್ಕೆಜೋಳ / మొక్కజొన్న / மக்காச்சோளம் / मक्का',
      category: 'cereals',
      mandi: `${selectedDistrict} Grain Sub-Yard, ${selectedState}`,
      minPrice: 2050,
      modalPrice: 2180,
      maxPrice: 2240,
      unit: 'qtl',
      trend: '-1.2%',
      isUp: false,
      arrivals: '560 Quintals',
      updated: 'Yesterday 4:00 PM',
      history: [2220, 2210, 2200, 2210, 2190, 2185, 2180],
    },
    {
      id: 'm4',
      crop: 'Red Chilli / Guntur Quality',
      regionalName: 'ಮೆಣಸಿನಕಾಯಿ / మిరప / மிளகாய் / लाल मिर्च',
      category: 'spices',
      mandi: `${selectedDistrict} Spices Terminal, ${selectedState}`,
      minPrice: 175,
      modalPrice: 192,
      maxPrice: 215,
      unit: 'kg',
      trend: '+4.2%',
      isUp: true,
      arrivals: '85 Quintals',
      updated: 'Today 09:45 AM',
      history: [180, 182, 185, 184, 188, 190, 192],
    },
    {
      id: 'm5',
      crop: 'Bengal Gram / Chana',
      regionalName: 'ಕಡಲೆ / శనగలు / கொண்டைக்கடலை / चना',
      category: 'pulses',
      mandi: `${selectedDistrict} Mandi Yard, ${selectedState}`,
      minPrice: 5600,
      modalPrice: 5850,
      maxPrice: 6020,
      unit: 'qtl',
      trend: '+0.8%',
      isUp: true,
      arrivals: '190 Quintals',
      updated: 'Today 10:00 AM',
      history: [5780, 5800, 5810, 5820, 5830, 5840, 5850],
    },
    {
      id: 'm6',
      crop: 'Raw Coconut & Copra',
      regionalName: 'ತೆಂಗಿನಕಾಯಿ / కొబ్బరి / தேங்காய் / നാളികേരം',
      category: 'cash',
      mandi: `${selectedDistrict} Agro Terminal, ${selectedState}`,
      minPrice: 32,
      modalPrice: 38,
      maxPrice: 42,
      unit: 'piece',
      trend: '+1.5%',
      isUp: true,
      arrivals: '12,500 Nuts',
      updated: 'Today 08:30 AM',
      history: [36, 36, 37, 37, 38, 38, 38],
    },
    {
      id: 'm7',
      crop: 'Tomato Country Grade A',
      regionalName: 'ಟೊಮೇಟೊ / టమాట / தக்காளி / തക്കാളി / टमाटर',
      category: 'produce',
      mandi: `${selectedDistrict} Vegetable Wholesale Yard, ${selectedState}`,
      minPrice: 24,
      modalPrice: 28,
      maxPrice: 32,
      unit: 'kg',
      trend: '-3.4%',
      isUp: false,
      arrivals: '420 Crates',
      updated: 'Today 07:15 AM',
      history: [34, 32, 31, 30, 29, 29, 28],
    },
    {
      id: 'm8',
      crop: 'Turmeric Finger / Salem Quality',
      regionalName: 'ಅರಿಶಿನ / పసుపు / மஞ்சள் / മഞ്ഞൾ / हल्दी',
      category: 'spices',
      mandi: `${selectedDistrict} Regulated Market, ${selectedState}`,
      minPrice: 12400,
      modalPrice: 13200,
      maxPrice: 13900,
      unit: 'qtl',
      trend: '+5.1%',
      isUp: true,
      arrivals: '140 Quintals',
      updated: 'Today 11:45 AM',
      history: [12500, 12600, 12800, 12900, 13000, 13100, 13200],
    },
  ];

  const filtered = rawMandiData
    .filter((item) => {
      const matchSearch =
        item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.regionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mandi.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'price-desc') return b.modalPrice - a.modalPrice;
      if (sortBy === 'price-asc') return a.modalPrice - b.modalPrice;
      if (sortBy === 'gainers') return (b.isUp ? 1 : -1) - (a.isUp ? 1 : -1);
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 7-Day Trend Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-900">{activeItem.crop}</h3>
                <span className="text-xs text-emerald-800 font-semibold block mt-0.5">
                  {activeItem.regionalName}
                </span>
                <span className="text-[11px] text-stone-500">{activeItem.mandi}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Min Rate</span>
                <span className="text-sm font-bold text-stone-800">
                  {formatCurrencyINR(activeItem.minPrice)}
                </span>
              </div>
              <div className="border-x border-stone-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Modal Rate</span>
                <span className="text-base font-extrabold text-emerald-950">
                  {formatCurrencyINR(activeItem.modalPrice)}
                </span>
                <span className="text-[10px] text-stone-500">/{activeItem.unit}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Max Rate</span>
                <span className="text-sm font-bold text-stone-800">
                  {formatCurrencyINR(activeItem.maxPrice)}
                </span>
              </div>
            </div>

            {/* Simulated 7-day Bar Trend */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-600 font-semibold">
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  7-Day Modal Rate Trajectory:
                </span>
                <span className={activeItem.isUp ? 'text-emerald-700' : 'text-rose-600'}>
                  {activeItem.trend} this week
                </span>
              </div>

              <div className="flex items-end gap-2 h-28 p-3 bg-stone-100/70 rounded-2xl border border-stone-200">
                {activeItem.history.map((val, idx) => {
                  const minH = Math.min(...activeItem.history);
                  const maxH = Math.max(...activeItem.history);
                  const range = maxH - minH || 1;
                  const pct = Math.max(25, Math.min(100, Math.round(((val - minH) / range) * 100)));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] font-bold text-stone-600">
                        {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                      </span>
                      <div
                        style={{ height: `${pct}%` }}
                        className={`w-full rounded-t-md transition-all ${
                          idx === activeItem.history.length - 1
                            ? 'bg-emerald-600'
                            : 'bg-emerald-400/80 hover:bg-emerald-500'
                        }`}
                      />
                      <span className="text-[9px] text-stone-500">D-{7 - idx}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-1.5 p-3 bg-emerald-50 rounded-2xl border border-emerald-200/60">
              <div className="flex justify-between">
                <span className="font-semibold text-emerald-950">Daily Yard Inflow Arrivals:</span>
                <span className="font-bold text-emerald-900">{activeItem.arrivals}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-emerald-950">Market Status:</span>
                <span className="text-emerald-800">Open • Verified Electronic Weight</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-[11px] text-stone-400">
              <span>Phase 1 Simulated Mandi Feed</span>
              <Button variant="primary" size="sm" onClick={() => setActiveItem(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

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
                {t('modules.market_prices_title', 'Agricultural Mandi Market Prices')}
              </h1>
              <Badge variant="demo" size="sm">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Phase 4 Preview
              </Badge>
            </div>
            <p className="text-sm text-stone-600 mt-1">
              {t(
                'modules.market_prices_subtitle',
                'Live market rates across APMC mandis, state agricultural marketing boards, and Agmarknet.'
              )}
            </p>
          </div>
        </div>
      </div>

      <AlertBanner
        type="info"
        title="AGMARKNET & data.gov.in Integration Planned"
        message={`Direct API data synchronization with AGMARKNET commodity price feeds and state marketing boards for ${selectedDistrict}, ${selectedState} will be connected in Phase 4. Current rates shown are demonstration samples.`}
      />

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search crop or APMC yard in ${selectedDistrict}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="default">Sort: Default</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="gainers">Highest Gainers First</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(
            [
              { id: 'all', label: 'All Commodities' },
              { id: 'cereals', label: 'Cereals & Grains' },
              { id: 'pulses', label: 'Pulses & Legumes' },
              { id: 'cash', label: 'Commercial & Cash Crops' },
              { id: 'spices', label: 'Spices' },
              { id: 'produce', label: 'Fruits & Vegetables' },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-emerald-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Table / Cards */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 space-y-2">
          <p className="text-sm font-semibold text-stone-700">No commodities match your filter criteria.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSortBy('default');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="p-4 sm:p-5 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer"
              onClick={() => setActiveItem(item)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-stone-900">{item.crop}</h3>
                    <Badge variant="default" size="sm">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="text-xs text-emerald-800 font-semibold">
                    {item.regionalName}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{item.mandi}</span>
                    <span>•</span>
                    <span>Arrivals: {item.arrivals}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
                      Range (Min - Max)
                    </span>
                    <span className="text-xs text-stone-600 font-medium">
                      {formatCurrencyINR(item.minPrice)} - {formatCurrencyINR(item.maxPrice)} /{item.unit}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
                      Modal Rate
                    </span>
                    <div className="text-lg font-extrabold text-stone-900">
                      {formatCurrencyINR(item.modalPrice)}
                      <span className="text-xs font-normal text-stone-500">/{item.unit}</span>
                    </div>
                    <div
                      className={`text-xs font-semibold inline-flex items-center gap-0.5 ${
                        item.isUp ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {item.isUp ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {item.trend}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
