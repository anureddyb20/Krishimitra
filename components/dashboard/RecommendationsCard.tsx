'use client';

import React from 'react';
import { Lightbulb, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function RecommendationsCard() {
  const { t, language } = useTranslation();

  const recommendations = [
    {
      id: 'rec_1',
      title: t('dashboard.rec_1_title', 'Coconut Root Feeding Routine'),
      desc: t(
        'dashboard.rec_1_desc',
        'Recommended application of micronutrient mixture for high-yield hybrid palms this week.'
      ),
      crop: language === 'ml' ? 'തെങ്ങ് (Coconut)' : 'Coconut Palm',
      priority: 'high',
      tag: 'Fertilizer',
    },
    {
      id: 'rec_2',
      title: t('dashboard.rec_2_title', 'Banana Plant Propping'),
      desc: t(
        'dashboard.rec_2_desc',
        'Provide bamboo supports to bunches nearing harvest ahead of anticipated gusty evening winds.'
      ),
      crop: language === 'ml' ? 'നേന്ത്രവാഴ (Banana)' : 'Banana',
      priority: 'medium',
      tag: 'Care',
    },
    {
      id: 'rec_3',
      title: t('dashboard.rec_3_title', 'Paddy Pest Surveillance'),
      desc: t(
        'dashboard.rec_3_desc',
        'Check for Brown Plant Hopper (BPH) signs in waterlogged paddy basins.'
      ),
      crop: language === 'ml' ? 'നെല്ല് (Paddy)' : 'Paddy (Rice)',
      priority: 'high',
      tag: 'Protection',
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>
            <Lightbulb className="w-5 h-5 text-amber-600" />
            {t('dashboard.recommendations_title', 'Personalized Recommendations')}
          </CardTitle>
        </div>
        <Badge variant="success" size="sm">
          {recommendations.length} Active
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-stone-50/70 transition-all duration-150 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                <Leaf className="w-3 h-3 text-emerald-600" />
                {rec.crop}
              </span>
              <Badge variant={rec.priority === 'high' ? 'warning' : 'default'} size="sm">
                {rec.tag}
              </Badge>
            </div>

            <h4 className="text-sm font-bold text-stone-900">{rec.title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{rec.desc}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
