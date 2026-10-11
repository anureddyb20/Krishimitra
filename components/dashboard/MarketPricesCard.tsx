'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyINR } from '@/lib/utils';

export function MarketPricesCard() {
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();

  const prices = [
    {
      id: 'm1',
      name: 'Paddy / Rice (వరి / ಭತ್ತ / ধান)',
      market: `${selectedDistrict} APMC Yard, ${selectedState}`,
      price: 2450,
      unit: '/qtl',
      trend: '+2.1%',
      isUp: true,
    },
    {
      id: 'm2',
      name: 'Cotton Medium Staple (ಹತ್ತಿ / పత్తి)',
      market: `${selectedDistrict} Market, ${selectedState}`,
      price: 7100,
      unit: '/qtl',
      trend: '+1.4%',
      isUp: true,
    },
    {
      id: 'm3',
      name: 'Maize / Corn (ಮಕ್ಕೆಜೋಳ / మొక్కజొన్న)',
      market: `${selectedDistrict} Mandi, ${selectedState}`,
      price: 2150,
      unit: '/qtl',
      trend: '-0.8%',
      isUp: false,
    },
    {
      id: 'm4',
      name: 'Red Chilli / Spices (ಮೆಣಸಿನಕಾಯಿ / మిరప)',
      market: `${selectedDistrict} Trade Center, ${selectedState}`,
      price: 185,
      unit: '/kg',
      trend: '+3.5%',
      isUp: true,
    },
    {
      id: 'm5',
      name: 'Sugarcane / Commercial (ಕಬ್ಬು / చెరకు)',
      market: `${selectedDistrict} Sugar Mill Bench, ${selectedState}`,
      price: 340,
      unit: '/qtl',
      trend: '+0.5%',
      isUp: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            {t('dashboard.market_card_title', 'APMC Mandi Market Rates')}
          </CardTitle>
        </div>
        <Badge variant="demo" size="sm">
          <Sparkles className="w-3 h-3 inline mr-1" />
          {t('dashboard.market_card_badge', 'Demo Rates')}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2.5">
        <div className="text-[11px] text-stone-500 font-medium px-2 py-1 bg-stone-50 rounded-lg flex justify-between">
          <span>{t('dashboard.market_crop', 'Commodity')} / {t('dashboard.market_location', 'Market')}</span>
          <span>{t('dashboard.market_price', 'Price')}</span>
        </div>

        {prices.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl border border-stone-200/90 hover:border-emerald-300 hover:bg-stone-50/50 transition-colors flex items-center justify-between gap-3"
          >
            <div>
              <h4 className="text-sm font-bold text-stone-900">{item.name}</h4>
              <p className="text-xs text-stone-500 truncate max-w-[200px]">{item.market}</p>
            </div>

            <div className="text-right">
              <div className="text-sm font-extrabold text-stone-900">
                {formatCurrencyINR(item.price)}
                <span className="text-[11px] font-normal text-stone-500">{item.unit}</span>
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
        ))}
      </CardContent>

      <CardFooter className="justify-end">
        <Link
          href="/market-prices"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
        >
          {t('common.view_all', 'View All Mandis')}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
