'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Filter,
  X,
  Check,
  Info,
  Calendar,
  Building,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { FarmCrop } from '@/types/database';

interface CropData {
  id: string;
  name: string;
  variety: string;
  acres: number;
  stage: string;
  health: number;
  status: 'healthy' | 'attention';
  statusText: string;
  isLiveDatabase?: boolean;
  details?: {
    irrigation: string;
    lastNutrient: string;
    harvestExpected: string;
  };
}

const DEMO_CROPS: CropData[] = [
  {
    id: 'crop_1',
    name: 'Banana (Nendran)',
    variety: 'Neduneran Hybrid',
    acres: 2.5,
    stage: 'Bunch Emergence',
    health: 88,
    status: 'attention',
    statusText: 'Attention Needed',
    details: {
      irrigation: 'Drip 3x weekly (45L/plant)',
      lastNutrient: 'Potash & Cow dung slurry (6 days ago)',
      harvestExpected: 'Approx. 45 days',
    },
  },
  {
    id: 'crop_2',
    name: 'Coconut Palm',
    variety: 'West Coast Tall (WCT)',
    acres: 4.0,
    stage: 'Peak Bearing',
    health: 95,
    status: 'healthy',
    statusText: 'Healthy',
    details: {
      irrigation: 'Basin flood watering (weekly)',
      lastNutrient: 'Micronutrient root feed (2 weeks ago)',
      harvestExpected: 'Monthly cycle',
    },
  },
  {
    id: 'crop_3',
    name: 'Black Pepper',
    variety: 'Panniyur-1',
    acres: 1.5,
    stage: 'Berry Development',
    health: 92,
    status: 'healthy',
    statusText: 'Healthy',
    details: {
      irrigation: 'Monsoon-assisted gravity drip',
      lastNutrient: 'Trichoderma enriched compost',
      harvestExpected: 'December - January',
    },
  },
  {
    id: 'crop_4',
    name: 'Wetland Paddy (Rice)',
    variety: 'Uma / MO-16',
    acres: 2.0,
    stage: 'Panicle Initiation',
    health: 86,
    status: 'healthy',
    statusText: 'Healthy',
    details: {
      irrigation: 'Regulated canal sluice',
      lastNutrient: 'Top dressed Nitrogen (10 days ago)',
      harvestExpected: 'Approx. 35 days',
    },
  },
];

export function MyCropsCard() {
  const { t } = useTranslation();
  const { user, isConfigured } = useAuth();

  const [crops, setCrops] = useState<CropData[]>(DEMO_CROPS);
  const [isUsingLiveDb, setIsUsingLiveDb] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'attention'>('all');
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null);

  // Fetch real crops from Supabase or demo storage if logged in
  useEffect(() => {
    async function fetchLiveCrops() {
      if (!user) return;

      if (!isConfigured || user.id === 'demo-farmer-id-kerala') {
        try {
          const raw = localStorage.getItem('krishimitra_demo_crops');
          if (raw) {
            const parsed = JSON.parse(raw) as FarmCrop[];
            if (parsed.length > 0) {
              const liveData: CropData[] = parsed.map((c) => ({
                id: c.id,
                name: c.crop_name,
                variety: c.crop_variety || 'Kerala Variety',
                acres: Number(c.area_value || 1.0),
                stage: c.growth_stage,
                health: 95,
                status: 'healthy',
                statusText: 'Healthy',
                isLiveDatabase: true,
                details: {
                  irrigation: 'Monitored via My Farm',
                  lastNutrient: c.planting_date ? `Planted: ${c.planting_date}` : 'Scheduled application',
                  harvestExpected: 'Active Monsoon Cycle',
                },
              }));
              setCrops(liveData);
              setIsUsingLiveDb(true);
            }
          }
        } catch {}
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from('farm_crops')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const liveData: CropData[] = (data as FarmCrop[]).map((c) => ({
            id: c.id,
            name: c.crop_name,
            variety: c.crop_variety || 'Local Selection',
            acres: Number(c.area_value || 1.0),
            stage: c.growth_stage,
            health: c.health_status === 'healthy' ? 95 : c.health_status === 'attention' ? 82 : 65,
            status: c.health_status === 'critical' || c.health_status === 'attention' ? 'attention' : 'healthy',
            statusText: c.health_status === 'healthy' ? t('common.healthy', 'Healthy') : t('common.attention', 'Attention Needed'),
            isLiveDatabase: true,
            details: {
              irrigation: 'Monitored via My Farm',
              lastNutrient: c.planting_date ? `Planted: ${c.planting_date}` : 'Scheduled application',
              harvestExpected: c.expected_harvest_date ? `Expected: ${c.expected_harvest_date}` : 'Seasonal timeline',
            },
          }));
          setCrops(liveData);
          setIsUsingLiveDb(true);
        }
      } catch (err) {
        console.warn('Error fetching live crops for dashboard:', err);
      }
    }

    fetchLiveCrops();
  }, [user, isConfigured, t]);

  const filteredCrops = crops.filter((crop) => {
    if (statusFilter === 'all') return true;
    return crop.status === statusFilter;
  });

  const totalAcres = crops.reduce((acc, c) => acc + c.acres, 0);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>
            <Sprout className="w-5 h-5 text-emerald-700" />
            {t('dashboard.crops_card_title', 'My Active Crops')}
          </CardTitle>
          {isUsingLiveDb ? (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
              Live DB
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
              Simulated
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/my-farm">
            <Button
              variant="outline"
              size="sm"
              className="text-xs py-1 px-2.5 h-8 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
            >
              <Plus className="w-3.5 h-3.5 mr-1 text-emerald-700" />
              {t('farm_mgmt.add_crop_btn', 'Manage Crops')}
            </Button>
          </Link>

          <span className="text-xs font-semibold text-stone-500">
            Total: {totalAcres.toFixed(1)} {t('common.acres', 'Acres')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1 pb-2">
          <span className="text-xs text-stone-500 font-medium">Filter:</span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All ({crops.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('healthy')}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              statusFilter === 'healthy'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Healthy ({crops.filter((c) => c.status === 'healthy').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('attention')}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              statusFilter === 'attention'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Attention ({crops.filter((c) => c.status === 'attention').length})
          </button>
        </div>

        {/* Crops List */}
        {filteredCrops.length === 0 ? (
          <EmptyState
            title="No crops matching filter"
            description="Try switching the filter back to 'All' or register new crops in My Farm."
            action={
              <Button size="sm" variant="outline" onClick={() => setStatusFilter('all')}>
                Reset Filter
              </Button>
            }
          />
        ) : (
          <div className="space-y-2.5">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className="group p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm truncate">
                        {crop.name}
                      </span>
                      {crop.variety && (
                        <span className="text-xs text-stone-500 font-medium truncate">
                          ({crop.variety})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
                      <span className="font-semibold text-emerald-950">
                        {crop.acres} {t('common.acres', 'Acres')}
                      </span>
                      <span>•</span>
                      <span>{crop.stage}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={crop.status === 'healthy' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {crop.status === 'healthy' ? (
                        <ShieldCheck className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {crop.statusText}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs text-stone-500">
          {isUsingLiveDb ? 'Showing records from Supabase database' : 'Simulated demonstration crops'}
        </span>
        <Link
          href="/my-farm"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
        >
          {t('farm_mgmt.title', 'My Farm Ledger')}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardFooter>

      {/* Modal: View Crop Details */}
      <Modal
        isOpen={Boolean(selectedCrop)}
        onClose={() => setSelectedCrop(null)}
        title={selectedCrop?.name}
        description={selectedCrop ? `Variety: ${selectedCrop.variety} • ${selectedCrop.acres} Acres` : undefined}
      >
        {selectedCrop && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl text-center">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Growth Stage</span>
                <span className="text-sm font-extrabold text-stone-900">{selectedCrop.stage}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Health Score</span>
                <span className="text-sm font-extrabold text-emerald-800">{selectedCrop.health}%</span>
              </div>
            </div>

            {selectedCrop.details && (
              <div className="space-y-2 text-xs text-stone-700">
                <div className="p-2.5 bg-stone-50 rounded-xl flex items-center justify-between">
                  <span className="text-stone-500">Irrigation:</span>
                  <span className="font-semibold text-stone-900">{selectedCrop.details.irrigation}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl flex items-center justify-between">
                  <span className="text-stone-500">Nutrients / Planting:</span>
                  <span className="font-semibold text-stone-900">{selectedCrop.details.lastNutrient}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl flex items-center justify-between">
                  <span className="text-stone-500">Harvest Timeline:</span>
                  <span className="font-semibold text-emerald-900">{selectedCrop.details.harvestExpected}</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <Link href="/my-farm">
                <Button size="sm" variant="primary">
                  Manage in My Farm
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}
