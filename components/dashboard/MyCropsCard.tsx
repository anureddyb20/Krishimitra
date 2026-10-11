'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';

interface CropData {
  id: string;
  name: string;
  variety: string;
  acres: number;
  stage: string;
  health: number;
  status: 'healthy' | 'attention';
  statusText: string;
  details?: {
    irrigation: string;
    lastNutrient: string;
    harvestExpected: string;
  };
}

export function MyCropsCard() {
  const { t } = useTranslation();

  const [crops, setCrops] = useState<CropData[]>([
    {
      id: 'crop_1',
      name: 'Nendran Banana (നേന്ത്രവാഴ)',
      variety: 'Neduneran Hybrid',
      acres: 2.5,
      stage: 'Bunch Emergence',
      health: 88,
      status: 'attention',
      statusText: t('common.attention', 'Attention Needed'),
      details: {
        irrigation: 'Drip 3x weekly (45L/plant)',
        lastNutrient: 'Potash & Cow dung slurry (6 days ago)',
        harvestExpected: 'Approx. 45 days',
      },
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
      details: {
        irrigation: 'Basin flood watering (weekly)',
        lastNutrient: 'Micronutrient root feed (2 weeks ago)',
        harvestExpected: 'Monthly cycle',
      },
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
      details: {
        irrigation: 'Monsoon-assisted gravity drip',
        lastNutrient: 'Trichoderma enriched compost',
        harvestExpected: 'December - January',
      },
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
      details: {
        irrigation: 'Regulated canal sluice',
        lastNutrient: 'Top dressed Nitrogen (10 days ago)',
        harvestExpected: 'Approx. 35 days',
      },
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'attention'>('all');
  const [selectedCrop, setSelectedCrop] = useState<CropData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for adding crop
  const [newCropName, setNewCropName] = useState('');
  const [newVariety, setNewVariety] = useState('');
  const [newAcres, setNewAcres] = useState('');
  const [newStage, setNewStage] = useState('Vegetative');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const filteredCrops = crops.filter((crop) => {
    if (statusFilter === 'all') return true;
    return crop.status === statusFilter;
  });

  const totalAcres = crops.reduce((acc, c) => acc + c.acres, 0);

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim()) {
      setFormError(t('common.field_required', 'Crop name is required'));
      return;
    }
    const acresNum = parseFloat(newAcres);
    if (isNaN(acresNum) || acresNum <= 0) {
      setFormError('Please enter a valid acreage greater than 0');
      return;
    }

    const created: CropData = {
      id: `crop_${Date.now()}`,
      name: newCropName.trim(),
      variety: newVariety.trim() || 'Standard Variety',
      acres: acresNum,
      stage: newStage,
      health: 90,
      status: 'healthy',
      statusText: t('common.healthy', 'Healthy'),
      details: {
        irrigation: 'Scheduled Drip',
        lastNutrient: 'Organic Biofertilizer',
        harvestExpected: 'Next season',
      },
    };

    setCrops([created, ...crops]);
    setNewCropName('');
    setNewVariety('');
    setNewAcres('');
    setFormError('');
    setIsAddModalOpen(false);
    setSuccessMessage(`Added ${created.name} to active session`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>
            <Sprout className="w-5 h-5 text-emerald-700" />
            {t('dashboard.crops_card_title', 'My Active Crops')}
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs py-1 px-2.5 h-8 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-emerald-700" />
            {t('common.add_crop', 'Add Crop (Demo)')}
          </Button>

          <span className="text-xs font-semibold text-stone-500">
            Total: {totalAcres.toFixed(1)} {t('common.acres', 'Acres')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {successMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs font-medium flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage('')}>
              <X className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t('common.all_filter', 'All')} ({crops.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('healthy')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'healthy'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t('common.healthy', 'Healthy')} (
            {crops.filter((c) => c.status === 'healthy').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('attention')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'attention'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t('common.attention', 'Attention Needed')} (
            {crops.filter((c) => c.status === 'attention').length})
          </button>
        </div>

        {/* Crops List */}
        {filteredCrops.length === 0 ? (
          <EmptyState
            title={t('common.no_items_found', 'No crops found')}
            description="No active crops match the selected filter."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                {t('common.reset_filter', 'Reset Filter')}
              </Button>
            }
          />
        ) : (
          filteredCrops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-400 hover:bg-stone-50/70 transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900 group-hover:text-emerald-900 transition-colors truncate">
                    {crop.name}
                  </span>
                  <Badge
                    variant={crop.status === 'healthy' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {crop.statusText}
                  </Badge>
                </div>
                <p className="text-xs text-stone-500 truncate">
                  {crop.variety} • {crop.acres} {t('common.acres', 'Acres')} • {crop.stage}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[11px] font-semibold text-stone-500">
                  {t('dashboard.crop_health_score', 'Health')}
                </div>
                <div className="text-base font-extrabold text-emerald-800">
                  {crop.health}%
                </div>
              </div>
            </div>
          ))
        )}
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

      {/* Crop Details Modal */}
      {selectedCrop && (
        <Modal
          isOpen={Boolean(selectedCrop)}
          onClose={() => setSelectedCrop(null)}
          title={selectedCrop.name}
          description={`${selectedCrop.variety} • ${selectedCrop.acres} Acres`}
        >
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-0.5">Health Score</span>
                <span className="text-lg font-bold text-emerald-800">
                  {selectedCrop.health}%
                </span>
                <span className="block text-[11px] text-stone-600 mt-0.5">
                  Status: {selectedCrop.statusText}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-0.5">Growth Stage</span>
                <span className="text-base font-bold text-stone-900">
                  {selectedCrop.stage}
                </span>
                <span className="block text-[11px] text-stone-600 mt-0.5">
                  Acreage: {selectedCrop.acres} Acres
                </span>
              </div>
            </div>

            {selectedCrop.details && (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-emerald-950 block">Irrigation Schedule:</span>
                  <span className="text-emerald-900">{selectedCrop.details.irrigation}</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-950 block">Last Nutrient Feeding:</span>
                  <span className="text-emerald-900">{selectedCrop.details.lastNutrient}</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-950 block">Expected Harvest:</span>
                  <span className="text-emerald-900">{selectedCrop.details.harvestExpected}</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setSelectedCrop(null)}>
                {t('common.close', 'Close')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Crop Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={t('common.add_crop', 'Add New Crop (Demo)')}
          description="Add a crop plot to your current farmer dashboard session."
        >
          <form onSubmit={handleAddCrop} className="space-y-3.5 pt-1 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                {t('common.crop_name', 'Crop Name')} *
              </label>
              <input
                type="text"
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                placeholder="e.g. Cardamom / ಏಲಕ್ಕಿ / ഏലം"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                {t('common.crop_variety', 'Variety / Cultivar')}
              </label>
              <input
                type="text"
                value={newVariety}
                onChange={(e) => setNewVariety(e.target.value)}
                placeholder="e.g. Njallani Hybrid"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Area ({t('common.acres', 'Acres')}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newAcres}
                  onChange={(e) => setNewAcres(e.target.value)}
                  placeholder="e.g. 2.0"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  {t('common.crop_stage', 'Stage')}
                </label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Fruiting">Fruiting</option>
                  <option value="Ripening">Ripening</option>
                  <option value="Harvest Ready">Harvest Ready</option>
                </select>
              </div>
            </div>

            {formError && (
              <p className="text-xs text-rose-600 font-semibold">{formError}</p>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" variant="primary" size="sm">
                {t('common.save', 'Save Crop')}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
}
