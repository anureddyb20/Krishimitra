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
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { formatCurrencyINR } from '@/lib/utils';

export default function MarketPricesPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const mandiData = [
    {
      id: 'm1',
      crop: 'Black Pepper (കുരുമുളക് ഗാർബിൾഡ്)',
      category: 'Spices',
      mandi: 'Nedumangad APMC, Thiruvananthapuram',
      minPrice: 620,
      modalPrice: 640,
      maxPrice: 655,
      trend: '+3.2%',
      isUp: true,
      updated: 'Today 10:30 AM',
    },
    {
      id: 'm2',
      crop: 'Natural Rubber RSS4 (റബ്ബർ)',
      category: 'Plantation',
      mandi: 'Kottayam Rubber Market',
      minPrice: 180,
      modalPrice: 185,
      maxPrice: 188,
      trend: '+1.1%',
      isUp: true,
      updated: 'Today 11:00 AM',
    },
    {
      id: 'm3',
      crop: 'Small Cardamom 7-8mm (ഏലം)',
      category: 'Spices',
      mandi: 'Spices Board Auction, Vandanmedu / Bodinayakanur',
      minPrice: 2150,
      modalPrice: 2350,
      maxPrice: 2500,
      trend: '-1.4%',
      isUp: false,
      updated: 'Yesterday 4:00 PM',
    },
    {
      id: 'm4',
      crop: 'Raw Coconut with Husk (നാളികേരം)',
      category: 'Plantation',
      mandi: 'Vengeri Urban Wholesale Mandi, Kozhikode',
      minPrice: 34,
      modalPrice: 38,
      maxPrice: 41,
      trend: '+2.7%',
      isUp: true,
      updated: 'Today 09:15 AM',
    },
    {
      id: 'm5',
      crop: 'Nendran Banana Grade A (നേന്ത്രക്കായ)',
      category: 'Fruits',
      mandi: 'VFPCK Wholesale Market, Thrissur',
      minPrice: 48,
      modalPrice: 52,
      maxPrice: 56,
      trend: '+4.0%',
      isUp: true,
      updated: 'Today 08:30 AM',
    },
    {
      id: 'm6',
      crop: 'Nutmeg with Shell (ജാതിക്ക)',
      category: 'Spices',
      mandi: 'Kalady Market, Ernakulam',
      minPrice: 280,
      modalPrice: 310,
      maxPrice: 330,
      trend: '+0.5%',
      isUp: true,
      updated: 'Today 10:00 AM',
    },
  ];

  const filtered = mandiData.filter((item) =>
    item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.mandi.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {t('modules.market_prices_title', 'Agricultural Market Prices')}
              </h1>
              <Badge variant="demo" size="sm">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Phase 4 Preview
              </Badge>
            </div>
            <p className="text-sm text-stone-600 mt-1">
              {t(
                'modules.market_prices_subtitle',
                'Live market rates across Kerala APMC mandis, VFPCK, and Agmarknet portals.'
              )}
            </p>
          </div>
        </div>
      </div>

      <AlertBanner
        type="info"
        title="AGMARKNET & data.gov.in Integration Planned"
        message="Direct API data synchronization with AGMARKNET commodity price feeds and the Vegetable and Fruit Promotion Council Keralam (VFPCK) will be connected in Phase 4. Current rates shown are demonstration samples."
      />

      {/* Filter and Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search crop or Kerala mandi market..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
      </div>

      {/* Price Table / Cards */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item.id} className="p-4 sm:p-5 hover:border-emerald-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-stone-900">{item.crop}</h3>
                  <Badge variant="default" size="sm">
                    {item.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{item.mandi}</span>
                  <span>•</span>
                  <span>{item.updated}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
                    Range (Min - Max)
                  </span>
                  <span className="text-xs text-stone-600 font-medium">
                    {formatCurrencyINR(item.minPrice)} - {formatCurrencyINR(item.maxPrice)} /kg
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
                    Modal Rate
                  </span>
                  <div className="text-lg font-extrabold text-stone-900">
                    {formatCurrencyINR(item.modalPrice)}
                    <span className="text-xs font-normal text-stone-500">/kg</span>
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
    </div>
  );
}
