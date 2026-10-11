'use client';

import React, { useState } from 'react';
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
  X,
  CheckCircle2,
  AlertCircle,
  Sprout,
  BarChart2,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';

interface FarmPlot {
  id: string;
  name: string;
  acres: number;
  soil: string;
  crops: string;
  irrigation: string;
  pH: number;
  organicCarbon: string;
}

export default function MyFarmPage() {
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();

  const [plots, setPlots] = useState<FarmPlot[]>([
    {
      id: 'p1',
      name: 'Plot 1: Main Canal Holding',
      acres: 4.5,
      soil: 'Rich Alluvial Loam',
      crops: 'Paddy Rice (BPT-5204 / Sona Masuri)',
      irrigation: 'Drip Network & Canal Feeder',
      pH: 6.8,
      organicCarbon: '0.85% (Optimal)',
    },
    {
      id: 'p2',
      name: 'Plot 2: Upper Plateau Field',
      acres: 3.0,
      soil: 'Medium Black Cotton Soil',
      crops: 'Bt Cotton & Pigeon Pea Intercrop',
      irrigation: 'Borewell Micro-Sprinkler',
      pH: 7.4,
      organicCarbon: '0.62% (Moderate)',
    },
    {
      id: 'p3',
      name: 'Plot 3: Orchard & Cash Basin',
      acres: 2.5,
      soil: 'Red Sandy Loam',
      crops: 'Red Chilli & Commercial Vegetables',
      irrigation: 'Automated Drip Fertigation',
      pH: 6.4,
      organicCarbon: '1.10% (High)',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlotForReport, setSelectedPlotForReport] = useState<FarmPlot>(plots[0]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    acres: '',
    soil: 'Rich Alluvial Loam',
    crops: '',
    irrigation: 'Drip Irrigation Network',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const totalAcres = plots.reduce((acc, p) => acc + p.acres, 0).toFixed(1);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Plot name must be at least 2 characters';
    }
    const acresNum = parseFloat(formData.acres);
    if (!formData.acres || isNaN(acresNum) || acresNum <= 0) {
      errors.acres = 'Enter a valid area in acres (e.g. 2.5)';
    }
    if (!formData.crops.trim()) {
      errors.crops = 'Please specify cultivated crop or variety';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newPlot: FarmPlot = {
      id: `p_${Date.now()}`,
      name: formData.name.trim(),
      acres: parseFloat(formData.acres),
      soil: formData.soil,
      crops: formData.crops.trim(),
      irrigation: formData.irrigation,
      pH: 6.6,
      organicCarbon: '0.78% (Good)',
    };

    setPlots((prev) => [newPlot, ...prev]);
    setSelectedPlotForReport(newPlot);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      acres: '',
      soil: 'Rich Alluvial Loam',
      crops: '',
      irrigation: 'Drip Irrigation Network',
    });
    setFormErrors({});
  };

  const handleDeletePlot = (id: string) => {
    if (plots.length <= 1) {
      alert('You must have at least one active plot in demonstration mode.');
      return;
    }
    const updated = plots.filter((p) => p.id !== id);
    setPlots(updated);
    if (selectedPlotForReport.id === id) {
      setSelectedPlotForReport(updated[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Add Plot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <Map className="w-5 h-5 text-emerald-700" />
                <span>Add New Farm Plot (Demo)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlot} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Plot Name / Identifier *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Plot 4: North Well Field"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    formErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Plot Area in Acres *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.acres}
                  onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                  placeholder="e.g. 3.5"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    formErrors.acres ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                  }`}
                />
                {formErrors.acres && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formErrors.acres}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Soil Classification
                </label>
                <select
                  value={formData.soil}
                  onChange={(e) => setFormData({ ...formData, soil: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Rich Alluvial Loam">Rich Alluvial Loam</option>
                  <option value="Black Cotton Soil">Medium Black Cotton Soil</option>
                  <option value="Red Laterite Soil">Red Laterite Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Clayey Wetland Basin">Clayey Wetland Basin</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Cultivated Crops & Variety *
                </label>
                <input
                  type="text"
                  value={formData.crops}
                  onChange={(e) => setFormData({ ...formData, crops: e.target.value })}
                  placeholder="e.g. Maize, Cotton, or Paddy"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    formErrors.crops ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300'
                  }`}
                />
                {formErrors.crops && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formErrors.crops}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Irrigation System
                </label>
                <select
                  value={formData.irrigation}
                  onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Drip Irrigation Network">Drip Irrigation Network</option>
                  <option value="Canal Sluice Flooding">Canal Sluice Flooding</option>
                  <option value="Borewell Open Basin">Borewell Open Basin</option>
                  <option value="Rainfed (Monsoon Dependent)">Rainfed (Monsoon Dependent)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Plot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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

          <Button
            variant="primary"
            size="sm"
            className="shrink-0 cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Plot (Demo)
          </Button>
        </div>
      </div>

      <AlertBanner
        type="info"
        title="Supabase PostgreSQL Storage Planned for Phase 2"
        message={`In Phase 2, plot GIS boundaries, GPS field coordinates, and official Soil Health Card (SHC) reports will be securely stored in Supabase PostgreSQL for ${selectedDistrict}, ${selectedState}. The demonstration ledger below is fully interactive in this session.`}
      />

      {/* Farm Summary Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-emerald-800 font-bold block uppercase tracking-wider">
              Farm Location & Total Holding
            </span>
            <span className="text-sm font-bold text-stone-900">
              {selectedDistrict} District, {selectedState} • {plots.length} Active Plots ({totalAcres} Acres Total)
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-xs">
          Interactive Ledger Active
        </span>
      </div>

      {/* Plot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plots.map((plot) => (
          <Card
            key={plot.id}
            className={`p-5 space-y-4 transition-all cursor-pointer ${
              selectedPlotForReport.id === plot.id
                ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                : 'hover:border-emerald-300'
            }`}
            onClick={() => setSelectedPlotForReport(plot)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">{plot.name}</h3>
                <span className="text-xs font-semibold text-emerald-800">
                  {plot.acres} Acres Total
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePlot(plot.id);
                }}
                title="Delete Plot"
                className="p-1 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
              <span>{selectedPlotForReport.id === plot.id ? 'Viewing Soil Health Below' : 'Click to inspect soil'}</span>
              <span>↓</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Soil Health Card Component */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            <FileText className="w-5 h-5 text-emerald-700" />
            Soil Health Card Diagnostic Report ({selectedPlotForReport.name})
          </CardTitle>
          <Badge variant="success" size="sm">
            Optimal Soil Status
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Soil pH</span>
              <span className="text-xl font-bold text-stone-900">{selectedPlotForReport.pH}</span>
              <span className="text-[10px] text-emerald-700 block">Normal / Healthy</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Organic Carbon</span>
              <span className="text-xl font-bold text-stone-900">{selectedPlotForReport.organicCarbon}</span>
              <span className="text-[10px] text-emerald-700 block">High Biological Activity</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Available Nitrogen (N)</span>
              <span className="text-xl font-bold text-stone-900">320 kg/ha</span>
              <span className="text-[10px] text-stone-600 block">Medium Index</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Available Potash (K)</span>
              <span className="text-xl font-bold text-stone-900">260 kg/ha</span>
              <span className="text-[10px] text-emerald-700 block">Adequate</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
            <span>
              Recommendation for {selectedPlotForReport.crops}: Add 25 kg/acre vermicompost prior to secondary till.
            </span>
            <span className="text-[11px] text-stone-400">
              Soil Testing Lab, {selectedDistrict}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
