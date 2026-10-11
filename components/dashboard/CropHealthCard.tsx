'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Camera, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function CropHealthCard() {
  const { t } = useTranslation();

  return (
    <Card className="border-amber-200/80">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>
            <ShieldAlert className="w-5 h-5 text-amber-700" />
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

        {/* Action Button */}
        <div className="pt-1">
          <Link href="/crop-health">
            <Button variant="outline" size="sm" className="w-full justify-center">
              <Camera className="w-4 h-4 mr-2 text-emerald-700" />
              {t('dashboard.scan_new_btn', 'Scan Crop Sample (Preview)')}
            </Button>
          </Link>
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
    </Card>
  );
}
