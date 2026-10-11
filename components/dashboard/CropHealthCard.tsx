'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Camera,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Upload,
  Sparkles,
  FileText,
  X,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export function CropHealthCard() {
  const { t } = useTranslation();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | {
    disease: string;
    confidence: number;
    pathogen: string;
    treatment: string;
    severity: 'high' | 'moderate' | 'low';
  }>(null);

  const sampleLeaves = [
    { label: 'Sigatoka Banana Leaf', disease: 'Sigatoka Leaf Spot', pathogen: 'Pseudocercospora musae', conf: 94 },
    { label: 'Black Pepper Root Wilt', disease: 'Quick Wilt / Foot Rot', pathogen: 'Phytophthora capsici', conf: 91 },
    { label: 'Healthy Coconut Frond', disease: 'Healthy Tissue (No Pathogen)', pathogen: 'None', conf: 98 },
  ];

  const handleRunScan = (leaf: typeof sampleLeaves[0]) => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        disease: leaf.disease,
        confidence: leaf.conf,
        pathogen: leaf.pathogen,
        treatment: leaf.disease.includes('Healthy')
          ? 'No chemical or biological treatment required. Continue standard balanced nutrient feeding.'
          : 'Apply 1% Bordeaux mixture on lower foliage or 0.1% Propiconazole. Ensure garden drainage is unhindered.',
        severity: leaf.disease.includes('Healthy') ? 'low' : 'high',
      });
    }, 800);
  };

  return (
    <Card className="border-amber-200/80">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
          <CardTitle>
            {t('dashboard.crop_health_card_title', 'Crop Health & Early Warnings')}
          </CardTitle>
        </div>
        <Badge variant="warning" size="sm">
          1 Warning
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3.5">
        {/* Highlighted Warning Box */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              {t('dashboard.recent_alert', 'Recent Automated Diagnostic')}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">Yesterday</span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-amber-950">
              {t('dashboard.alert_disease', 'Sigatoka Leaf Spot Suspected')}
            </h4>
            <p className="text-xs text-amber-900 font-medium mt-0.5">
              {t('dashboard.alert_crop', 'Nendran Banana • Plot B')}
            </p>
          </div>

          <p className="text-xs text-stone-700 bg-white/80 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
            {t(
              'dashboard.alert_action',
              'Recommended: Spray 1% Bordeaux mixture on lower leaves on dry morning. Avoid wetting banana crown.'
            )}
          </p>
        </div>

        {/* Action Button - opens interactive simulated scanner */}
        <div className="pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsScanModalOpen(true)}
            className="w-full justify-center"
          >
            <Camera className="w-4 h-4 mr-2 text-emerald-700" />
            {t('dashboard.scan_new_btn', 'Scan Crop Sample (Preview)')}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Link
          href="/crop-health"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
        >
          {t('common.view_all', 'View Disease Catalog')}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardFooter>

      {/* Interactive Scan Sample Modal */}
      {isScanModalOpen && (
        <Modal
          isOpen={isScanModalOpen}
          onClose={() => {
            setIsScanModalOpen(false);
            setScanResult(null);
          }}
          title="AI Crop Diagnostic Scanner (Demo)"
          description="Simulated computer vision diagnosis for leaf and plant disease detection."
        >
          <div className="space-y-4 pt-1 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600">
              Select a sample plant specimen to test the diagnostic pipeline:
            </div>

            <div className="space-y-2">
              <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px] block">
                Test Sample Images:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sampleLeaves.map((leaf, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRunScan(leaf)}
                    className="p-3 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all cursor-pointer font-medium text-stone-800 flex flex-col justify-between"
                  >
                    <span>{leaf.label}</span>
                    <span className="text-[10px] text-emerald-700 mt-1 font-semibold">
                      Test Scan ➔
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {isScanning && (
              <div className="p-6 text-center space-y-2 rounded-2xl bg-emerald-50/50 border border-emerald-200 animate-pulse">
                <Sparkles className="w-6 h-6 text-emerald-700 mx-auto animate-spin" />
                <span className="font-bold text-emerald-950 block">
                  Processing visual pixels with Vision CNN...
                </span>
                <span className="text-stone-500 text-[11px]">
                  Matching pathogen contours against KAU pathology database
                </span>
              </div>
            )}

            {scanResult && (
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900">
                    {scanResult.disease}
                  </span>
                  <Badge variant={scanResult.severity === 'high' ? 'danger' : 'success'} size="sm">
                    {scanResult.confidence}% Confidence
                  </Badge>
                </div>

                <div className="text-stone-600 space-y-1">
                  <div>
                    <span className="font-semibold text-stone-700">Pathogen:</span>{' '}
                    <span className="italic">{scanResult.pathogen}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800">
                    <span className="font-semibold text-emerald-900 block mb-0.5">
                      Agronomic Action:
                    </span>
                    {scanResult.treatment}
                  </div>
                </div>

                <p className="text-[10px] text-stone-400 italic text-center">
                  Demonstration prediction. Real-time model inference will connect in Phase 3.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsScanModalOpen(false);
                  setScanResult(null);
                }}
              >
                {t('common.close', 'Close')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}
