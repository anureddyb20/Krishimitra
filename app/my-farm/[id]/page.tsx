'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building,
  Layers,
  Sprout,
  Plus,
  MapPin,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Farm, FarmPlot, FarmCrop } from '@/types/database';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

function FarmDetailContent({ farmId }: { farmId: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isConfigured } = useAuth();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [crops, setCrops] = useState<FarmCrop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchFarm() {
      if (!user || !isConfigured || !farmId) {
        setIsLoading(false);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: farmData, error: fErr } = await supabase
          .from('farms')
          .select('*')
          .eq('id', farmId)
          .eq('owner_id', user.id)
          .single();

        if (fErr) throw fErr;
        setFarm(farmData as Farm);

        const { data: plotData } = await supabase
          .from('farm_plots')
          .select('*')
          .eq('farm_id', farmId)
          .eq('owner_id', user.id);
        setPlots((plotData || []) as FarmPlot[]);

        const { data: cropData } = await supabase
          .from('farm_crops')
          .select('*')
          .eq('farm_id', farmId)
          .eq('owner_id', user.id);
        setCrops((cropData || []) as FarmCrop[]);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load farm details.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFarm();
  }, [farmId, user, isConfigured]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-stone-500">
        Loading farm details...
      </div>
    );
  }

  if (errorMsg || !farm) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">Farm Not Found</h2>
        <p className="text-xs text-stone-600">{errorMsg || 'This farm does not exist or you do not have permission to view it.'}</p>
        <Link href="/my-farm">
          <Button variant="primary">Back to My Farm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/my-farm"
          className="inline-flex items-center text-xs font-semibold text-stone-500 hover:text-emerald-700 transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Farms
        </Link>
      </div>

      {/* Farm Overview Card */}
      <Card className="bg-white border-stone-200/90 shadow-sm p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">{farm.farm_name}</h1>
              <Badge variant="success">{farm.district}</Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              {farm.village_or_town ? `${farm.village_or_town}, ` : ''}{farm.district} District, Kerala
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/my-farm">
              <Button size="sm" variant="outline">
                Manage in My Farm
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100 text-center">
          <div className="p-3 bg-stone-50 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Total Area</span>
            <span className="text-lg font-black text-stone-900">{farm.area_value} {farm.area_unit}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Registered Plots</span>
            <span className="text-lg font-black text-stone-900">{plots.length}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Standing Crops</span>
            <span className="text-lg font-black text-stone-900">{crops.length}</span>
          </div>
        </div>

        {farm.notes && (
          <div className="mt-4 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-stone-700">
            <span className="font-bold text-emerald-950 block mb-0.5">Notes:</span>
            {farm.notes}
          </div>
        )}
      </Card>

      {/* Plots and Crops Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plots List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              Plots ({plots.length})
            </h2>
          </div>

          {plots.length === 0 ? (
            <div className="p-6 text-center bg-stone-50 rounded-2xl text-xs text-stone-500 border border-dashed border-stone-200">
              No plots created in this farm yet.
            </div>
          ) : (
            <div className="space-y-3">
              {plots.map((plot) => (
                <Card key={plot.id} className="p-4 bg-white border-stone-200 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-stone-900 text-sm">{plot.plot_name}</h3>
                    <span className="text-xs font-bold text-emerald-800">{plot.area_value} {plot.area_unit}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-2">
                    {plot.soil_type && <span>Soil: {plot.soil_type}</span>}
                    {plot.irrigation_type && <span>• {plot.irrigation_type}</span>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Crops List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-700" />
              Standing Crops ({crops.length})
            </h2>
          </div>

          {crops.length === 0 ? (
            <div className="p-6 text-center bg-stone-50 rounded-2xl text-xs text-stone-500 border border-dashed border-stone-200">
              No crops registered in this farm yet.
            </div>
          ) : (
            <div className="space-y-3">
              {crops.map((crop) => (
                <Card key={crop.id} className="p-4 bg-white border-stone-200 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{crop.crop_name}</h3>
                      {crop.crop_variety && <span className="text-xs text-stone-500">Var: {crop.crop_variety}</span>}
                    </div>
                    <Badge variant={crop.health_status === 'healthy' ? 'success' : 'warning'}>
                      {crop.growth_stage}
                    </Badge>
                  </div>
                  {crop.planting_date && (
                    <div className="text-xs text-stone-500 mt-2">
                      Planted: {crop.planting_date}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FarmDetailPageInner({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);
  return <FarmDetailContent farmId={resolved.id} />;
}

export default function FarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-12 text-center text-stone-500">
          Loading farm...
        </div>
      }
    >
      <FarmDetailPageInner params={params} />
    </Suspense>
  );
}
