'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Camera,
  Upload,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Leaf,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';

export default function CropHealthPage() {
  const { t } = useTranslation();
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);

  const keralaCropDiseases = [
    {
      id: 'd1',
      name: 'Sigatoka Leaf Spot (സിഗാറ്റോക്ക ഇലപ്പുള്ളി)',
      crop: 'Nendran Banana (നേന്ത്രവാഴ)',
      pathogen: 'Pseudocercospora musae',
      symptoms: 'Yellowish-brown linear spindle streaks with grayish centers on older foliage.',
      treatment: 'Apply 1% Bordeaux mixture or Propiconazole 0.1% at earliest detection.',
      severity: 'high',
    },
    {
      id: 'd2',
      name: 'Quick Wilt / Foot Rot (ദ്രുതവാട്ടം)',
      crop: 'Black Pepper (കുരുമുളക്)',
      pathogen: 'Phytophthora capsici',
      symptoms: 'Sudden foliar yellowing followed by total vine wilting within 10-14 days.',
      treatment: 'Drench root basin with Copper Oxychloride 0.2% or Metalaxyl-Mancozeb 0.125%.',
      severity: 'critical',
    },
    {
      id: 'd3',
      name: 'Mahali / Koleroga Fruit Rot (മഹളി രോഗം)',
      crop: 'Arecanut (അടയ്ക്ക)',
      pathogen: 'Phytophthora meadii',
      symptoms: 'Water-soaked lesions on tender nuts causing massive pre-harvest dropping.',
      treatment: 'Pre-monsoon bunch spraying with 1% Bordeaux mixture with adhesive agent.',
      severity: 'high',
    },
    {
      id: 'd4',
      name: 'Abnormal Leaf Fall (ഇലപ്പൊഴിച്ചിൽ)',
      crop: 'Natural Rubber (റബ്ബർ)',
      pathogen: 'Phytophthora botryosa',
      symptoms: 'Excessive defoliation during southwest monsoon months.',
      treatment: 'Prophylactic aerial/ground spraying with copper oxychloride dispersed in oil.',
      severity: 'moderate',
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
                {t('modules.crop_health_title', 'Crop Disease & Health Diagnosis')}
              </h1>
              <Badge variant="demo" size="sm">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Phase 3 Preview
              </Badge>
            </div>
            <p className="text-sm text-stone-600 mt-1">
              {t(
                'modules.crop_health_subtitle',
                'Computer vision model trained to classify tropical crop pathogens from leaf photographs.'
              )}
            </p>
          </div>
        </div>
      </div>

      <AlertBanner
        type="info"
        title="Vision Inference Model Status: Planned for Phase 3"
        message="A deep learning vision classifier tailored for Kerala Agricultural University disease datasets will be integrated in Phase 3. Below is a preview of the diagnostic workflow and disease catalog."
      />

      {/* Camera / Scan Mockup Card */}
      <Card className="border-dashed border-2 border-emerald-300 bg-emerald-50/20">
        <CardContent className="py-12 px-6 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
            <Camera className="w-8 h-8 text-emerald-700" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-stone-900">
              AI Plant Doctor Camera Scanner
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
              Take a clear picture of affected leaves, stems, or fruits. The AI will classify the disease and provide tailored organic & chemical treatments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              <Camera className="w-4 h-4 mr-2" />
              Capture with Camera (Demo)
            </Button>
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image File
            </Button>
          </div>

          <p className="text-[11px] text-stone-400">
            Supports JPEG/PNG • Works offline via PWA in Phase 5
          </p>
        </CardContent>
      </Card>

      {/* Kerala Crop Pathogen Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">
            Common Kerala Crop Disease Catalog
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Verified with Kerala Agricultural University (KAU) Guides
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keralaCropDiseases.map((d) => (
            <Card
              key={d.id}
              className={`p-5 space-y-3 cursor-pointer transition-all ${
                selectedDisease === d.id
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                  : 'hover:border-stone-300'
              }`}
              onClick={() => setSelectedDisease(d.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-stone-900">{d.name}</h4>
                  <span className="text-xs font-semibold text-emerald-800 block mt-0.5">
                    {d.crop} • <span className="italic text-stone-500">{d.pathogen}</span>
                  </span>
                </div>
                <Badge
                  variant={
                    d.severity === 'critical'
                      ? 'danger'
                      : d.severity === 'high'
                      ? 'warning'
                      : 'default'
                  }
                  size="sm"
                >
                  {d.severity}
                </Badge>
              </div>

              <div className="text-xs text-stone-600 space-y-1.5 pt-1">
                <div>
                  <span className="font-semibold text-stone-800">Visual Symptoms: </span>
                  {d.symptoms}
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                  <span className="font-semibold text-emerald-900">Recommended Treatment: </span>
                  {d.treatment}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
