'use client';

import React from 'react';
import Link from 'next/link';
import {
  Map,
  ArrowLeft,
  Sparkles,
  Layers,
  Droplets,
  Plus,
  Compass,
  FileText,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';

export default function MyFarmPage() {
  const { t } = useTranslation();

  const farmPlots = [
    {
      id: 'p1',
      name: 'Plot A: Hill Slope (Idukki Holding)',
      acres: 4.5,
      soil: 'Humus-rich Red Laterite',
      crops: 'Black Pepper (Panniyur-1), Small Cardamom',
      irrigation: 'Gravity Sprinkler & Drip Network',
    },
    {
      id: 'p2',
      name: 'Plot B: Homestead Garden',
      acres: 2.5,
      soil: 'Coastal Alluvial Loam',
      crops: 'Nendran Banana, West Coast Tall Coconut',
      irrigation: 'Borewell Open Basin',
    },
    {
      id: 'p3',
      name: 'Plot C: Wetland Basin',
      acres: 3.0,
      soil: 'Clayey Acid Saline (Kari/Kayal type)',
      crops: 'Uma Wetland Paddy (MO-16)',
      irrigation: 'Seasonal Polder Canal Sluice',
    },
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
                {t('modules.my_farm_title', 'My Farm & Plot Management')}
              </h1>
              <Badge variant="demo" size="sm">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Phase 2 Preview
              </Badge>
            </div>
            <p className="text-sm text-stone-600 mt-1">
              {t(
                'modules.my_farm_subtitle',
                'Digital ledger for plot boundaries, soil health records, crop rotation history, and input tracking.'
              )}
            </p>
          </div>

          <Button variant="outline" size="sm" className="shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Plot (Phase 2)
          </Button>
        </div>
      </div>

      <AlertBanner
        type="info"
        title="Supabase PostgreSQL Storage Planned for Phase 2"
        message="This module will persist plot GIS polygons, soil test reports, and harvest logs to Supabase PostgreSQL in Phase 2. Below is a preview of the farm management ledger."
      />

      {/* Plot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {farmPlots.map((plot) => (
          <Card key={plot.id} className="p-5 space-y-4 hover:border-emerald-300">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">{plot.name}</h3>
                <span className="text-xs font-semibold text-emerald-800">
                  {plot.acres} Acres Total
                </span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Compass className="w-4 h-4" />
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-2 border-t border-stone-100 pt-3">
              <div>
                <span className="font-semibold text-stone-800 block">Soil Classification:</span>
                <span>{plot.soil}</span>
              </div>

              <div>
                <span className="font-semibold text-stone-800 block">Cultivated Crops:</span>
                <span>{plot.crops}</span>
              </div>

              <div>
                <span className="font-semibold text-stone-800 block">Irrigation System:</span>
                <span>{plot.irrigation}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Soil Health Card Mockup */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            <FileText className="w-5 h-5 text-emerald-700" />
            Kerala Soil Health Card Sample (Plot A Laterite)
          </CardTitle>
          <Badge variant="success" size="sm">
            Optimal for Spices
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Soil pH</span>
              <span className="text-xl font-bold text-stone-900">5.8</span>
              <span className="text-[10px] text-amber-700 block">Slightly Acidic</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Organic Carbon</span>
              <span className="text-xl font-bold text-stone-900">1.4%</span>
              <span className="text-[10px] text-emerald-700 block">High (Fertile)</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Available Nitrogen</span>
              <span className="text-xl font-bold text-stone-900">310 kg/ha</span>
              <span className="text-[10px] text-stone-600 block">Medium</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Available Potassium</span>
              <span className="text-xl font-bold text-stone-900">240 kg/ha</span>
              <span className="text-[10px] text-emerald-700 block">Adequate</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
