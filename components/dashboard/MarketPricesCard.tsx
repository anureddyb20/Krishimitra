'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyINR } from '@/lib/utils';

export function MarketPricesCard() {
  const { t } = useTranslation();

  const prices = [
    {
      id: 'm1',
      name: 'Black Pepper (കുരുമുളക്)',
      market: 'Nedumangad, TVM',
      price: 640,
      trend: '+3.2%',
      isUp: true,
    },
    {
      id: 'm2',
      name: 'Natural Rubber RSS4 (റബ്ബർ)',
      market: 'Kottayam Mandi',
      price: 185,
      trend: '+1.1%',
      isUp: true,
    },
    {
      id: 'm3',
      name: 'Small Cardamom (ഏലം 7mm)',
      market: 'Vandanmedu, Idukki',
      price: 2350,
      trend: '-1.4%',
      isUp: false,
    },
    {
      id: 'm4',
      name: 'Raw Coconut (നാളികേരം)',
      market: 'Vengeri, Kozhikode',
      price: 38,
      trend: '+2.7%',
      isUp: true,
    },
    {
      id: 'm5',
      name: 'Nendran Banana (നേന്ത്രൻ)',
      market: 'Thrissur APMC',
      price: 52,
      trend: '+4.0%',
      isUp: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>
            <TrendingUp className="w-5 h-5 text-emerald-700" />
            {t('dashboard.market_card_title', 'Kerala Mandi Market Rates')}
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
          <span>{t('dashboard.market_price', 'Price / Kg')}</span>
        </div>

        {prices.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl border border-stone-200/90 hover:border-emerald-300 hover:bg-stone-50/50 transition-colors flex items-center justify-between gap-3"
          >
            <div>
              <h4 className="text-sm font-bold text-stone-900">{item.name}</h4>
              <p className="text-xs text-stone-500">{item.market}</p>
            </div>

            <div className="text-right">
              <div className="text-sm font-extrabold text-stone-900">
                {formatCurrencyINR(item.price)}
                <span className="text-[11px] font-normal text-stone-500">/kg</span>
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
