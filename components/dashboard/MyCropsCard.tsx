'use client';

import React from 'react';
import Link from 'next/link';
import { Sprout, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function MyCropsCard() {
  const { t } = useTranslation();

  const crops = [
    {
      id: 'crop_1',
      name: 'Nendran Banana (നേന്ത്രവാഴ)',
      variety: 'Neduneran Hybrid',
      acres: 2.5,
      stage: 'Bunch Emergence',
      health: 88,
      status: 'attention',
      statusText: t('common.attention', 'Attention Needed'),
    },
    {
      id: 'crop_2',
      name: 'Coconut Palm (തെങ്ങ്)',
      variety: 'West Coast Tall (WCT)',
      acres: 4.0,
      stage: 'Peak Bearing',
      health: 95,
      status: 'healthy',
      statusText: t('common.healthy', 'Healthy'),
    },
    {
      id: 'crop_3',
      name: 'Black Pepper (കുരുമുളക്)',
      variety: 'Panniyur-1',
      acres: 1.5,
      stage: 'Berry Development',
      health: 92,
      status: 'healthy',
      statusText: t('common.healthy', 'Healthy'),
    },
    {
      id: 'crop_4',
      name: 'Wetland Paddy (നെല്ല്)',
      variety: 'Uma / MO-16',
      acres: 2.0,
      stage: 'Panicle Initiation',
      health: 86,
      status: 'healthy',
      statusText: t('common.healthy', 'Healthy'),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>
            <Sprout className="w-5 h-5 text-emerald-700" />
            {t('dashboard.crops_card_title', 'My Active Crops')}
          </CardTitle>
        </div>
        <span className="text-xs font-semibold text-stone-500">
          Total: 10 {t('common.acres', 'Acres')}
        </span>
      </CardHeader>

      <CardContent className="space-y-3">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-stone-50/50 transition-colors flex items-center justify-between gap-3"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-900">{crop.name}</span>
                <Badge
                  variant={crop.status === 'healthy' ? 'success' : 'warning'}
                  size="sm"
                >
                  {crop.statusText}
                </Badge>
              </div>
              <p className="text-xs text-stone-500">
                {crop.variety} • {crop.acres} {t('common.acres', 'Acres')} • {crop.stage}
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-semibold text-stone-500">
                {t('dashboard.crop_health_score', 'Health')}
              </div>
              <div className="text-base font-extrabold text-emerald-800">
                {crop.health}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="justify-end">
        <Link
          href="/my-farm"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
        >
          {t('common.view_all', 'View Farm Details')}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
