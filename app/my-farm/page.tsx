'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  AlertCircle,
  Sprout,
  BarChart2,
  Building,
  Calendar,
  Filter,
  RefreshCw,
  LogIn,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Farm, FarmPlot, FarmCrop, KeralaDistrict, AreaUnit, GrowthStage, HealthStatus } from '@/types/database';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AlertBanner } from '@/components/ui/AlertBanner';

const KERALA_DISTRICTS: KeralaDistrict[] = [
  'Alappuzha',
  'Ernakulam',
  'Idukki',
  'Kannur',
  'Kasaragod',
  'Kollam',
  'Kottayam',
  'Kozhikode',
  'Malappuram',
  'Palakkad',
  'Pathanamthitta',
  'Thiruvananthapuram',
  'Thrissur',
  'Wayanad',
];

const GROWTH_STAGES: GrowthStage[] = [
  'Sowing',
  'Germination',
  'Vegetative',
  'Flowering',
  'Fruit Formation',
  'Harvesting',
  'Post-Harvest',
];

const HEALTH_STATUSES: HealthStatus[] = ['healthy', 'attention', 'critical'];

export default function MyFarmPage() {
  const { t } = useTranslation();
  const { user, isConfigured } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<'farms' | 'crops'>('farms');

  // Database Data States
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [crops, setCrops] = useState<FarmCrop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Selected farm for detailed plot view
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  // Filters for Crops
  const [cropFarmFilter, setCropFarmFilter] = useState<string>('all');
  const [cropStageFilter, setCropStageFilter] = useState<string>('all');

  // Modal States
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<FarmPlot | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<FarmCrop | null>(null);

  // Deletion Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'farm' | 'plot' | 'crop';
    id: string;
    name: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Farm Form State
  const [farmForm, setFarmForm] = useState({
    farm_name: '',
    district: 'Wayanad' as KeralaDistrict,
    village_or_town: '',
    area_value: '2.5',
    area_unit: 'acres' as AreaUnit,
    notes: '',
  });

  // Plot Form State
  const [plotForm, setPlotForm] = useState({
    farm_id: '',
    plot_name: '',
    area_value: '1.0',
    area_unit: 'acres' as AreaUnit,
    soil_type: 'Rich Alluvial Loam',
    irrigation_type: 'Drip Irrigation Network',
    notes: '',
  });

  // Crop Form State
  const [cropForm, setCropForm] = useState({
    farm_id: '',
    plot_id: '',
    crop_name: '',
    crop_variety: '',
    growth_stage: 'Vegetative' as GrowthStage,
    planting_date: '',
    expected_harvest_date: '',
    area_value: '',
    area_unit: 'acres' as AreaUnit,
    health_status: 'healthy' as HealthStatus,
    notes: '',
  });

  // Fetch all farm data for current user
  const loadFarmData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    if (!isConfigured || user.id === 'demo-farmer-id-kerala') {
      try {
        const rawFarms = localStorage.getItem('krishimitra_demo_farms');
        const loadedFarms: Farm[] = rawFarms ? JSON.parse(rawFarms) : [];
        setFarms(loadedFarms);

        if (loadedFarms.length > 0 && !selectedFarmId) {
          setSelectedFarmId(loadedFarms[0].id);
        }

        const rawPlots = localStorage.getItem('krishimitra_demo_plots');
        setPlots(rawPlots ? JSON.parse(rawPlots) : []);

        const rawCrops = localStorage.getItem('krishimitra_demo_crops');
        setCrops(rawCrops ? JSON.parse(rawCrops) : []);
      } catch (err) {
        console.warn('Demo farm load error:', err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Fetch user's farms
      const { data: farmsData, error: farmsError } = await supabase
        .from('farms')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (farmsError) throw farmsError;

      const loadedFarms = (farmsData || []) as Farm[];
      setFarms(loadedFarms);

      if (loadedFarms.length > 0 && !selectedFarmId) {
        setSelectedFarmId(loadedFarms[0].id);
      }

      // 2. Fetch user's plots
      const { data: plotsData, error: plotsError } = await supabase
        .from('farm_plots')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (plotsError) throw plotsError;
      setPlots((plotsData || []) as FarmPlot[]);

      // 3. Fetch user's crops
      const { data: cropsData, error: cropsError } = await supabase
        .from('farm_crops')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (cropsError) throw cropsError;
      setCrops((cropsData || []) as FarmCrop[]);
    } catch (err: any) {
      console.error('Error loading farm records:', err);
      setErrorMessage(err.message || 'Failed to fetch farm data from Supabase.');
    } finally {
      setIsLoading(false);
    }
  }, [user, isConfigured, selectedFarmId]);

  useEffect(() => {
    loadFarmData();
  }, [loadFarmData]);

  // Handle Farm Create / Edit
  const handleOpenAddFarm = () => {
    setEditingFarm(null);
    setFarmForm({
      farm_name: '',
      district: 'Wayanad',
      village_or_town: '',
      area_value: '2.5',
      area_unit: 'acres',
      notes: '',
    });
    setIsFarmModalOpen(true);
  };

  const handleOpenEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    setFarmForm({
      farm_name: farm.farm_name,
      district: farm.district,
      village_or_town: farm.village_or_town || '',
      area_value: farm.area_value.toString(),
      area_unit: farm.area_unit,
      notes: farm.notes || '',
    });
    setIsFarmModalOpen(true);
  };

  const handleSubmitFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    if (!farmForm.farm_name.trim()) {
      alert('Farm name is required');
      return;
    }
    const area = parseFloat(farmForm.area_value);
    if (isNaN(area) || area <= 0) {
      alert('Enter a valid area greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingFarm) {
        // Update existing farm
        const { error } = await supabase
          .from('farms')
          .update({
            farm_name: farmForm.farm_name.trim(),
            district: farmForm.district,
            village_or_town: farmForm.village_or_town.trim() || null,
            area_value: area,
            area_unit: farmForm.area_unit,
            notes: farmForm.notes.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingFarm.id)
          .eq('owner_id', user.id);

        if (error) throw error;
        setSuccessBanner(t('farm_mgmt.updated_success', 'Farm updated successfully!'));
      } else {
        // Insert new farm
        const { data, error } = await supabase
          .from('farms')
          .insert({
            owner_id: user.id,
            farm_name: farmForm.farm_name.trim(),
            district: farmForm.district,
            village_or_town: farmForm.village_or_town.trim() || null,
            area_value: area,
            area_unit: farmForm.area_unit,
            notes: farmForm.notes.trim() || null,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setSelectedFarmId(data.id);
        setSuccessBanner(t('farm_mgmt.created_success', 'New farm added successfully!'));
      }

      setIsFarmModalOpen(false);
      await loadFarmData();
      setTimeout(() => setSuccessBanner(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving farm.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Plot Create / Edit
  const handleOpenAddPlot = (farmId?: string) => {
    const fId = farmId || selectedFarmId || (farms[0]?.id ?? '');
    setEditingPlot(null);
    setPlotForm({
      farm_id: fId,
      plot_name: '',
      area_value: '1.0',
      area_unit: 'acres',
      soil_type: 'Rich Alluvial Loam',
      irrigation_type: 'Drip Network & Canal Feeder',
      notes: '',
    });
    setIsPlotModalOpen(true);
  };

  const handleOpenEditPlot = (plot: FarmPlot) => {
    setEditingPlot(plot);
    setPlotForm({
      farm_id: plot.farm_id,
      plot_name: plot.plot_name,
      area_value: plot.area_value.toString(),
      area_unit: plot.area_unit,
      soil_type: plot.soil_type || 'Rich Alluvial Loam',
      irrigation_type: plot.irrigation_type || 'Drip Network',
      notes: plot.notes || '',
    });
    setIsPlotModalOpen(true);
  };

  const handleSubmitPlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    if (!plotForm.farm_id) {
      alert('Please select a farm');
      return;
    }
    if (!plotForm.plot_name.trim()) {
      alert('Plot name is required');
      return;
    }
    const area = parseFloat(plotForm.area_value);
    if (isNaN(area) || area <= 0) {
      alert('Enter a valid area greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingPlot) {
        const { error } = await supabase
          .from('farm_plots')
          .update({
            farm_id: plotForm.farm_id,
            plot_name: plotForm.plot_name.trim(),
            area_value: area,
            area_unit: plotForm.area_unit,
            soil_type: plotForm.soil_type.trim() || null,
            irrigation_type: plotForm.irrigation_type.trim() || null,
            notes: plotForm.notes.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingPlot.id)
          .eq('owner_id', user.id);

        if (error) throw error;
        setSuccessBanner('Plot updated successfully!');
      } else {
        const { error } = await supabase.from('farm_plots').insert({
          farm_id: plotForm.farm_id,
          owner_id: user.id,
          plot_name: plotForm.plot_name.trim(),
          area_value: area,
          area_unit: plotForm.area_unit,
          soil_type: plotForm.soil_type.trim() || null,
          irrigation_type: plotForm.irrigation_type.trim() || null,
          notes: plotForm.notes.trim() || null,
        });

        if (error) throw error;
        setSuccessBanner('Plot registered successfully!');
      }

      setIsPlotModalOpen(false);
      await loadFarmData();
      setTimeout(() => setSuccessBanner(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving plot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Crop Create / Edit
  const handleOpenAddCrop = (farmId?: string, plotId?: string) => {
    const defaultFarmId = farmId || selectedFarmId || (farms[0]?.id ?? '');
    setEditingCrop(null);
    setCropForm({
      farm_id: defaultFarmId,
      plot_id: plotId || '',
      crop_name: '',
      crop_variety: '',
      growth_stage: 'Vegetative',
      planting_date: new Date().toISOString().split('T')[0],
      expected_harvest_date: '',
      area_value: '',
      area_unit: 'acres',
      health_status: 'healthy',
      notes: '',
    });
    setIsCropModalOpen(true);
  };

  const handleOpenEditCrop = (crop: FarmCrop) => {
    setEditingCrop(crop);
    setCropForm({
      farm_id: crop.farm_id,
      plot_id: crop.plot_id || '',
      crop_name: crop.crop_name,
      crop_variety: crop.crop_variety || '',
      growth_stage: crop.growth_stage,
      planting_date: crop.planting_date || '',
      expected_harvest_date: crop.expected_harvest_date || '',
      area_value: crop.area_value ? crop.area_value.toString() : '',
      area_unit: crop.area_unit || 'acres',
      health_status: crop.health_status,
      notes: crop.notes || '',
    });
    setIsCropModalOpen(true);
  };

  const handleSubmitCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    if (!cropForm.farm_id) {
      alert('Farm is required');
      return;
    }
    if (!cropForm.crop_name.trim()) {
      alert('Crop name is required');
      return;
    }

    if (
      cropForm.planting_date &&
      cropForm.expected_harvest_date &&
      cropForm.expected_harvest_date < cropForm.planting_date
    ) {
      alert('Expected harvest date must be on or after the planting date.');
      return;
    }

    const areaVal = cropForm.area_value ? parseFloat(cropForm.area_value) : null;

    setIsSubmitting(true);
    try {
      if (editingCrop) {
        const { error } = await supabase
          .from('farm_crops')
          .update({
            farm_id: cropForm.farm_id,
            plot_id: cropForm.plot_id || null,
            crop_name: cropForm.crop_name.trim(),
            crop_variety: cropForm.crop_variety.trim() || null,
            growth_stage: cropForm.growth_stage,
            planting_date: cropForm.planting_date || null,
            expected_harvest_date: cropForm.expected_harvest_date || null,
            area_value: areaVal,
            area_unit: cropForm.area_unit,
            health_status: cropForm.health_status,
            notes: cropForm.notes.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCrop.id)
          .eq('owner_id', user.id);

        if (error) throw error;
        setSuccessBanner('Crop updated successfully!');
      } else {
        const { error } = await supabase.from('farm_crops').insert({
          owner_id: user.id,
          farm_id: cropForm.farm_id,
          plot_id: cropForm.plot_id || null,
          crop_name: cropForm.crop_name.trim(),
          crop_variety: cropForm.crop_variety.trim() || null,
          growth_stage: cropForm.growth_stage,
          planting_date: cropForm.planting_date || null,
          expected_harvest_date: cropForm.expected_harvest_date || null,
          area_value: areaVal,
          area_unit: cropForm.area_unit,
          health_status: cropForm.health_status,
          notes: cropForm.notes.trim() || null,
        });

        if (error) throw error;
        setSuccessBanner('Crop registered successfully!');
      }

      setIsCropModalOpen(false);
      await loadFarmData();
      setTimeout(() => setSuccessBanner(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving crop.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Perform Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmation || !user) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setIsSubmitting(true);
    try {
      if (deleteConfirmation.type === 'farm') {
        const { error } = await supabase
          .from('farms')
          .delete()
          .eq('id', deleteConfirmation.id)
          .eq('owner_id', user.id);
        if (error) throw error;
        setSuccessBanner(t('farm_mgmt.deleted_success', 'Farm deleted successfully.'));
      } else if (deleteConfirmation.type === 'plot') {
        const { error } = await supabase
          .from('farm_plots')
          .delete()
          .eq('id', deleteConfirmation.id)
          .eq('owner_id', user.id);
        if (error) throw error;
        setSuccessBanner(t('farm_mgmt.deleted_success', 'Plot deleted successfully.'));
      } else if (deleteConfirmation.type === 'crop') {
        const { error } = await supabase
          .from('farm_crops')
          .delete()
          .eq('id', deleteConfirmation.id)
          .eq('owner_id', user.id);
        if (error) throw error;
        setSuccessBanner(t('farm_mgmt.deleted_success', 'Crop deleted successfully.'));
      }

      setDeleteConfirmation(null);
      await loadFarmData();
      setTimeout(() => setSuccessBanner(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Deletion failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute stats
  const totalFarmArea = farms
    .reduce((sum, f) => sum + Number(f.area_value || 0), 0)
    .toFixed(1);

  // Filtered crops
  const filteredCrops = crops.filter((crop) => {
    if (cropFarmFilter !== 'all' && crop.farm_id !== cropFarmFilter) return false;
    if (cropStageFilter !== 'all' && crop.growth_stage !== cropStageFilter) return false;
    return true;
  });

  const selectedFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const selectedFarmPlots = plots.filter((p) => p.farm_id === selectedFarm?.id);
  const selectedFarmCrops = crops.filter((c) => c.farm_id === selectedFarm?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t('farm_mgmt.title', 'My Farm Management')}
            </h1>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 font-semibold px-2.5 py-0.5 rounded-full text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Database
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-1">
            {t(
              'farm_mgmt.subtitle',
              'Manage your farms, plots, and standing crops with real-time database persistence'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={loadFarmData}
            disabled={isLoading}
            className="rounded-xl"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button
            size="sm"
            onClick={handleOpenAddFarm}
            className="rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t('farm_mgmt.add_farm_btn', 'Add New Farm')}
          </Button>
        </div>
      </div>

      {/* Notification and Unconfigured alerts */}
      {!isConfigured && (
        <AlertBanner
          type="warning"
          title="Supabase Database Not Connected"
          message="To enable full cloud synchronization, add your Supabase project keys to .env.local as described in SUPABASE_SETUP.md."
        />
      )}

      {!user && isConfigured && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950 text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>You are currently not signed in. Sign in to view and save your private farm records.</span>
          </div>
          <Link href="/login">
            <Button size="sm" variant="primary">
              <LogIn className="w-4 h-4 mr-1.5" />
              Sign In
            </Button>
          </Link>
        </div>
      )}

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="font-semibold">{successBanner}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950 text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Farms</span>
            <Building className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">{farms.length}</div>
          <div className="text-xs text-stone-500 mt-0.5">Kerala registered holdings</div>
        </Card>

        <Card className="p-4 bg-white border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Area</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">{totalFarmArea} <span className="text-sm font-normal text-stone-500">Acres</span></div>
          <div className="text-xs text-stone-500 mt-0.5">Combined agricultural land</div>
        </Card>

        <Card className="p-4 bg-white border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Farm Plots</span>
            <Map className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">{plots.length}</div>
          <div className="text-xs text-stone-500 mt-0.5">Sub-divided land blocks</div>
        </Card>

        <Card className="p-4 bg-white border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Crops</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">{crops.length}</div>
          <div className="text-xs text-stone-500 mt-0.5">Standing crop varieties</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('farms')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'farms'
              ? 'border-emerald-700 text-emerald-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{t('farm_mgmt.farms_tab', 'Farms & Plots')}</span>
          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-xs">
            {farms.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crops')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'crops'
              ? 'border-emerald-700 text-emerald-950 font-extrabold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>{t('farm_mgmt.crops_tab', 'Standing Crops')}</span>
          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-xs">
            {crops.length}
          </span>
        </button>
      </div>

      {/* TAB 1: FARMS & PLOTS */}
      {activeTab === 'farms' && (
        <div className="space-y-6">
          {farms.length === 0 && !isLoading ? (
            <Card className="p-12 text-center bg-white border-dashed border-2 border-stone-200 rounded-3xl">
              <Building className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-800">
                {t('farm_mgmt.no_farms', 'No farms registered yet')}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-5">
                {t(
                  'farm_mgmt.no_farms_desc',
                  'Add your first farm holding in Kerala to begin tracking plots and crops.'
                )}
              </p>
              <Button onClick={handleOpenAddFarm} className="rounded-xl shadow-xs">
                <Plus className="w-4 h-4 mr-1.5" />
                {t('farm_mgmt.add_farm_btn', 'Add New Farm')}
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Farm Selector Sidebar */}
              <div className="lg:col-span-1 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Your Holdings
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenAddFarm}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Farm
                  </button>
                </div>

                <div className="space-y-2">
                  {farms.map((farm) => {
                    const isSelected = farm.id === selectedFarm?.id;
                    const farmPlotCount = plots.filter((p) => p.farm_id === farm.id).length;
                    const farmCropCount = crops.filter((c) => c.farm_id === farm.id).length;

                    return (
                      <div
                        key={farm.id}
                        onClick={() => setSelectedFarmId(farm.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-600 shadow-xs ring-1 ring-emerald-500/30'
                            : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-stone-900 text-sm truncate">
                              {farm.farm_name}
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span className="truncate">
                                {farm.district}
                                {farm.village_or_town ? `, ${farm.village_or_town}` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditFarm(farm);
                              }}
                              className="p-1 rounded-lg text-stone-400 hover:text-emerald-700 hover:bg-emerald-100/50"
                              title="Edit Farm"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmation({
                                  type: 'farm',
                                  id: farm.id,
                                  name: farm.farm_name,
                                });
                              }}
                              className="p-1 rounded-lg text-stone-400 hover:text-rose-700 hover:bg-rose-100/50"
                              title="Delete Farm"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
                          <span className="font-semibold text-emerald-950">
                            {farm.area_value} {farm.area_unit}
                          </span>
                          <span>•</span>
                          <span>{farmPlotCount} plots</span>
                          <span>•</span>
                          <span>{farmCropCount} crops</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Farm Detail & Plots */}
              <div className="lg:col-span-2 space-y-6">
                {selectedFarm && (
                  <>
                    {/* Farm Details Card */}
                    <Card className="bg-white border-stone-200/90 shadow-xs">
                      <CardHeader className="border-b border-stone-100 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-xl font-black text-stone-900">
                                {selectedFarm.farm_name}
                              </CardTitle>
                              <Badge variant="success" size="sm">
                                {selectedFarm.district}
                              </Badge>
                            </div>
                            <p className="text-xs text-stone-500 mt-1">
                              {selectedFarm.village_or_town
                                ? `${selectedFarm.village_or_town}, `
                                : ''}
                              {selectedFarm.district} District, Kerala
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAddPlot(selectedFarm.id)}
                              className="rounded-xl"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" />
                              Add Plot
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleOpenAddCrop(selectedFarm.id)}
                              className="rounded-xl shadow-xs"
                            >
                              <Sprout className="w-3.5 h-3.5 mr-1" />
                              Add Crop
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4 space-y-4">
                        <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl text-center">
                          <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase block">Area</span>
                            <span className="text-sm font-extrabold text-stone-900">
                              {selectedFarm.area_value} {selectedFarm.area_unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase block">Registered Plots</span>
                            <span className="text-sm font-extrabold text-stone-900">
                              {selectedFarmPlots.length}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase block">Standing Crops</span>
                            <span className="text-sm font-extrabold text-stone-900">
                              {selectedFarmCrops.length}
                            </span>
                          </div>
                        </div>

                        {selectedFarm.notes && (
                          <div className="text-xs text-stone-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                            <span className="font-bold text-emerald-950 block mb-0.5">Farm Notes:</span>
                            {selectedFarm.notes}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Plots in this Farm */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-stone-900">
                          Plots in {selectedFarm.farm_name} ({selectedFarmPlots.length})
                        </h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAddPlot(selectedFarm.id)}
                          className="rounded-xl text-xs"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          New Plot
                        </Button>
                      </div>

                      {selectedFarmPlots.length === 0 ? (
                        <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                          <Layers className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                          <p className="text-xs font-semibold text-stone-600">
                            {t('farm_mgmt.no_plots', 'No plots recorded for this farm yet')}
                          </p>
                          <p className="text-[11px] text-stone-400 mt-1 mb-3">
                            Subdivide your farm into plots to track soil types, irrigation, and specific crops.
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handleOpenAddPlot(selectedFarm.id)}
                            className="rounded-xl"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Add First Plot
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedFarmPlots.map((plot) => {
                            const plotCrops = crops.filter((c) => c.plot_id === plot.id);

                            return (
                              <Card
                                key={plot.id}
                                className="border-stone-200 bg-white hover:border-emerald-300 transition-all rounded-2xl p-4 shadow-xs"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-bold text-stone-900 text-sm">{plot.plot_name}</h4>
                                    <span className="text-xs font-extrabold text-emerald-800">
                                      {plot.area_value} {plot.area_unit}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditPlot(plot)}
                                      className="p-1 rounded-md text-stone-400 hover:text-emerald-700"
                                      title="Edit Plot"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDeleteConfirmation({
                                          type: 'plot',
                                          id: plot.id,
                                          name: plot.plot_name,
                                        })
                                      }
                                      className="p-1 rounded-md text-stone-400 hover:text-rose-700"
                                      title="Delete Plot"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-1.5 mt-3 pt-3 border-t border-stone-100 text-xs">
                                  {plot.soil_type && (
                                    <div className="text-stone-600 flex items-center justify-between">
                                      <span className="text-stone-400">Soil:</span>
                                      <span className="font-medium text-stone-800">{plot.soil_type}</span>
                                    </div>
                                  )}
                                  {plot.irrigation_type && (
                                    <div className="text-stone-600 flex items-center justify-between">
                                      <span className="text-stone-400">Irrigation:</span>
                                      <span className="font-medium text-stone-800">{plot.irrigation_type}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-3 pt-2 border-t border-stone-50 flex items-center justify-between text-xs">
                                  <span className="text-stone-400">
                                    Crops planted: <strong className="text-stone-800">{plotCrops.length}</strong>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAddCrop(selectedFarm.id, plot.id)}
                                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                                  >
                                    + Add Crop
                                  </button>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CROP MANAGEMENT */}
      {activeTab === 'crops' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" />
                Filters:
              </div>

              {/* Filter by Farm */}
              <select
                value={cropFarmFilter}
                onChange={(e) => setCropFarmFilter(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Farms ({crops.length})</option>
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.farm_name}
                  </option>
                ))}
              </select>

              {/* Filter by Growth Stage */}
              <select
                value={cropStageFilter}
                onChange={(e) => setCropStageFilter(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Growth Stages</option>
                {GROWTH_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <Button
              size="sm"
              onClick={() => handleOpenAddCrop()}
              className="rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              {t('farm_mgmt.add_crop_btn', 'Register Crop')}
            </Button>
          </div>

          {filteredCrops.length === 0 ? (
            <Card className="p-12 text-center bg-white border-dashed border-2 border-stone-200 rounded-3xl">
              <Sprout className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-800">
                {t('farm_mgmt.no_crops', 'No crops found')}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-5">
                Register standing crops such as Paddy, Coconut, Black Pepper, or Rubber with their planting dates and growth stages.
              </p>
              <Button onClick={() => handleOpenAddCrop()} className="rounded-xl shadow-xs">
                <Plus className="w-4 h-4 mr-1.5" />
                Register New Crop
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCrops.map((crop) => {
                const cropFarm = farms.find((f) => f.id === crop.farm_id);
                const cropPlot = plots.find((p) => p.id === crop.plot_id);

                return (
                  <Card
                    key={crop.id}
                    className="border-stone-200 bg-white hover:border-emerald-300 hover:shadow-sm transition-all rounded-3xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-stone-900 text-base leading-snug">
                            {crop.crop_name}
                          </h4>
                          {crop.crop_variety && (
                            <span className="text-xs font-semibold text-emerald-800">
                              Var: {crop.crop_variety}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCrop(crop)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Edit Crop"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirmation({
                                type: 'crop',
                                id: crop.id,
                                name: crop.crop_name,
                              })
                            }
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-700 hover:bg-rose-50"
                            title="Delete Crop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                          {crop.growth_stage}
                        </span>

                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            crop.health_status === 'healthy'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : crop.health_status === 'attention'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {crop.health_status.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-1.5 mt-4 pt-3 border-t border-stone-100 text-xs text-stone-600">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Farm:</span>
                          <span className="font-bold text-stone-900">{cropFarm?.farm_name || 'Assigned Farm'}</span>
                        </div>
                        {cropPlot && (
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400">Plot:</span>
                            <span className="font-semibold text-stone-700">{cropPlot.plot_name}</span>
                          </div>
                        )}
                        {crop.planting_date && (
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400">Planted:</span>
                            <span>{crop.planting_date}</span>
                          </div>
                        )}
                        {crop.expected_harvest_date && (
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400">Expected Harvest:</span>
                            <span className="font-bold text-emerald-900">{crop.expected_harvest_date}</span>
                          </div>
                        )}
                        {crop.area_value && (
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400">Area:</span>
                            <span>
                              {crop.area_value} {crop.area_unit || 'acres'}
                            </span>
                          </div>
                        )}
                      </div>

                      {crop.notes && (
                        <p className="mt-3 text-xs text-stone-500 italic bg-stone-50 p-2.5 rounded-xl">
                          &ldquo;{crop.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT FARM */}
      <Modal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        title={editingFarm ? t('farm_mgmt.edit_farm_btn', 'Edit Farm Details') : t('farm_mgmt.add_farm_btn', 'Register New Farm')}
        description="Enter your farm's location in Kerala, total area, and operational notes."
      >
        <form onSubmit={handleSubmitFarm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Farm Name *
            </label>
            <input
              type="text"
              value={farmForm.farm_name}
              onChange={(e) => setFarmForm({ ...farmForm, farm_name: e.target.value })}
              required
              placeholder="e.g. Green Valley Farm, Pamba Riverside"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                District in Kerala *
              </label>
              <select
                value={farmForm.district}
                onChange={(e) => setFarmForm({ ...farmForm, district: e.target.value as KeralaDistrict })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
              >
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Village / Town
              </label>
              <input
                type="text"
                value={farmForm.village_or_town}
                onChange={(e) => setFarmForm({ ...farmForm, village_or_town: e.target.value })}
                placeholder="e.g. Mananthavady, Meppadi"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Total Land Area *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={farmForm.area_value}
                onChange={(e) => setFarmForm({ ...farmForm, area_value: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Unit *
              </label>
              <select
                value={farmForm.area_unit}
                onChange={(e) => setFarmForm({ ...farmForm, area_unit: e.target.value as AreaUnit })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
              >
                <option value="acres">Acres (ഏക്കർ)</option>
                <option value="cents">Cents (സെന്റ്)</option>
                <option value="hectares">Hectares (ഹെക്ടർ)</option>
                <option value="sq_ft">Sq. Ft (ചതുരശ്ര അടി)</option>
                <option value="sq_m">Sq. Meters (ചതുരശ്ര മീറ്റർ)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              rows={2}
              value={farmForm.notes}
              onChange={(e) => setFarmForm({ ...farmForm, notes: e.target.value })}
              placeholder="e.g. Near canal, red loam soil, solar drip setup"
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFarmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingFarm ? 'Save Changes' : 'Create Farm'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD / EDIT PLOT */}
      <Modal
        isOpen={isPlotModalOpen}
        onClose={() => setIsPlotModalOpen(false)}
        title={editingPlot ? 'Edit Plot' : 'Add New Plot'}
        description="Register a subdivided plot within your farm."
      >
        <form onSubmit={handleSubmitPlot} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Associated Farm *
            </label>
            <select
              value={plotForm.farm_id}
              onChange={(e) => setPlotForm({ ...plotForm, farm_id: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farm_name} ({f.district})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Plot Name *
            </label>
            <input
              type="text"
              value={plotForm.plot_name}
              onChange={(e) => setPlotForm({ ...plotForm, plot_name: e.target.value })}
              required
              placeholder="e.g. Plot 1: North Valley Holding"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Area *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={plotForm.area_value}
                onChange={(e) => setPlotForm({ ...plotForm, area_value: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Unit *
              </label>
              <select
                value={plotForm.area_unit}
                onChange={(e) => setPlotForm({ ...plotForm, area_unit: e.target.value as AreaUnit })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
              >
                <option value="acres">Acres (ഏക്കർ)</option>
                <option value="cents">Cents (സെന്റ്)</option>
                <option value="hectares">Hectares (ഹെക്ടർ)</option>
                <option value="sq_ft">Sq. Ft</option>
                <option value="sq_m">Sq. Meters</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Soil Type
              </label>
              <input
                type="text"
                value={plotForm.soil_type}
                onChange={(e) => setPlotForm({ ...plotForm, soil_type: e.target.value })}
                placeholder="e.g. Alluvial Loam, Red Laterite"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Irrigation System
              </label>
              <input
                type="text"
                value={plotForm.irrigation_type}
                onChange={(e) => setPlotForm({ ...plotForm, irrigation_type: e.target.value })}
                placeholder="e.g. Automated Drip Fertigation"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPlotModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingPlot ? 'Save Changes' : 'Add Plot'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD / EDIT CROP */}
      <Modal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        title={editingCrop ? 'Edit Crop Record' : 'Register Standing Crop'}
        description="Track growth stage, health, planting date, and harvest timeline."
      >
        <form onSubmit={handleSubmitCrop} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Farm *
              </label>
              <select
                value={cropForm.farm_id}
                onChange={(e) => {
                  setCropForm({ ...cropForm, farm_id: e.target.value, plot_id: '' });
                }}
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.farm_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Plot (Optional)
              </label>
              <select
                value={cropForm.plot_id}
                onChange={(e) => setCropForm({ ...cropForm, plot_id: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
              >
                <option value="">None / Entire Farm</option>
                {plots
                  .filter((p) => p.farm_id === cropForm.farm_id)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.plot_name} ({p.area_value} {p.area_unit})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Crop Name *
              </label>
              <input
                type="text"
                value={cropForm.crop_name}
                onChange={(e) => setCropForm({ ...cropForm, crop_name: e.target.value })}
                required
                placeholder="e.g. Paddy (Rice), Coconut, Black Pepper"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Variety (Optional)
              </label>
              <input
                type="text"
                value={cropForm.crop_variety}
                onChange={(e) => setCropForm({ ...cropForm, crop_variety: e.target.value })}
                placeholder="e.g. Uma, Jyothi, Karimunda"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Growth Stage *
              </label>
              <select
                value={cropForm.growth_stage}
                onChange={(e) => setCropForm({ ...cropForm, growth_stage: e.target.value as GrowthStage })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
              >
                {GROWTH_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Health Status *
              </label>
              <select
                value={cropForm.health_status}
                onChange={(e) => setCropForm({ ...cropForm, health_status: e.target.value as HealthStatus })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
              >
                {HEALTH_STATUSES.map((h) => (
                  <option key={h} value={h}>
                    {h.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Planting Date
              </label>
              <input
                type="date"
                value={cropForm.planting_date}
                onChange={(e) => setCropForm({ ...cropForm, planting_date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Expected Harvest Date
              </label>
              <input
                type="date"
                value={cropForm.expected_harvest_date}
                onChange={(e) => setCropForm({ ...cropForm, expected_harvest_date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCropModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingCrop ? 'Save Changes' : 'Register Crop'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRMATION MODAL: SAFE DELETION */}
      <Modal
        isOpen={Boolean(deleteConfirmation)}
        onClose={() => setDeleteConfirmation(null)}
        title={t('farm_mgmt.confirm_delete_title', 'Confirm Deletion')}
        description={
          deleteConfirmation?.type === 'farm'
            ? t(
                'farm_mgmt.confirm_delete_farm',
                'Are you sure you want to delete this farm? All associated plots and crops will also be permanently deleted.'
              )
            : deleteConfirmation?.type === 'plot'
            ? t('farm_mgmt.confirm_delete_plot', 'Are you sure you want to delete this plot?')
            : t('farm_mgmt.confirm_delete_crop', 'Are you sure you want to delete this crop record?')
        }
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-medium">
            Deleting: <strong className="font-bold">{deleteConfirmation?.name}</strong>. {t('farm_mgmt.delete_warning', 'This action cannot be undone.')}
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmation(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Permanently Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
