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
  Search,
  X,
  Scan,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { useLocation } from '@/lib/LocationContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertBanner } from '@/components/ui/AlertBanner';

interface DiseaseItem {
  id: string;
  name: string;
  crop: string;
  category: 'cereals' | 'cash' | 'vegetables' | 'spices';
  pathogen: string;
  symptoms: string;
  treatment: string;
  organicRemedy: string;
  severity: 'critical' | 'high' | 'moderate';
}

export default function CropHealthPage() {
  const { t } = useTranslation();
  const { selectedState, selectedDistrict } = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cereals' | 'cash' | 'vegetables' | 'spices'>('all');
  const [activeDossier, setActiveDossier] = useState<DiseaseItem | null>(null);

  // Scanner modal state
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedSpecimen, setSelectedSpecimen] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    disease: string;
    crop: string;
    confidence: number;
    severity: string;
    remedy: string;
  } | null>(null);

  const testSpecimens = [
    {
      label: 'Specimen 1: Paddy / Rice Leaf Blast',
      crop: 'Paddy Rice',
      disease: 'Magnaporthe oryzae (Leaf Blast)',
      severity: 'high',
      confidence: 96.4,
      remedy: 'Apply Tricyclazole 75% WP @ 0.6g/L or Pseudomonas fluorescens bio-fungicide.',
      color: 'from-amber-700/20 to-stone-900',
    },
    {
      label: 'Specimen 2: Cotton Leaf Curl Virus',
      crop: 'Bt Cotton',
      disease: 'Cotton Leaf Curl Geminivirus',
      severity: 'critical',
      confidence: 94.1,
      remedy: 'Manage whitefly vectors with yellow sticky traps & spray Diafenthiuron 50% WP @ 1g/L.',
      color: 'from-rose-800/20 to-stone-900',
    },
    {
      label: 'Specimen 3: Banana Sigatoka Leaf Spot',
      crop: 'Banana (Nendran / Robusta)',
      disease: 'Pseudocercospora musae',
      severity: 'moderate',
      confidence: 97.8,
      remedy: 'De-leaf infected foliage and spray 1% Bordeaux mixture or Propiconazole 0.1%.',
      color: 'from-emerald-800/20 to-stone-900',
    },
  ];

  const diseaseCatalog: DiseaseItem[] = [
    {
      id: 'd1',
      name: 'Rice Blast & Sheath Blight (ಬೆಂಕಿ ರೋಗ / అగ్గితెగులు)',
      crop: 'Paddy / Rice',
      category: 'cereals',
      pathogen: 'Magnaporthe oryzae / Rhizoctonia solani',
      symptoms: 'Spindle-shaped lesions with brown margins and grey ash centers on leaf blades and neck node.',
      treatment: 'Apply Tricyclazole 75 WP (0.6 g/L) or Azoxystrobin 18.2% + Difenoconazole 11.4% SC.',
      organicRemedy: 'Foliar spray of 2% neem oil formulation or seed treatment with Trichoderma viride (10 g/kg seed).',
      severity: 'high',
    },
    {
      id: 'd2',
      name: 'Cotton Leaf Curl & Bollworm (ಹತ್ತಿ ಎಲೆ ಸುರುಳಿ / పత్తి ఆకు ముడత)',
      crop: 'Cotton',
      category: 'cash',
      pathogen: 'Cotton Leaf Curl Virus (CLCuV) & Whitefly vector',
      symptoms: 'Upward or downward leaf curling, vein thickening, and enations on the lower leaf surface.',
      treatment: 'Spray Flonicamid 50 WG (0.3 g/L) or Dinotefuran 20 SG (0.3 g/L) targeting whitefly nymphs.',
      organicRemedy: 'Erect 10-12 yellow sticky traps per acre; spray 5% Neem Seed Kernel Extract (NSKE).',
      severity: 'critical',
    },
    {
      id: 'd3',
      name: 'Tomato Early Blight & Fruit Borer (ಟೊಮೇಟೊ ಕಪ್ಪು ಚುಕ್ಕೆ)',
      crop: 'Tomato & Solanaceous Vegetables',
      category: 'vegetables',
      pathogen: 'Alternaria solani',
      symptoms: 'Concentric ring "target-board" brown spots appearing on lower leaves, rapidly expanding upwards.',
      treatment: 'Spray Chlorothalonil 75 WP @ 2g/L or Mancozeb 75 WP @ 2.5g/L at initial symptom onset.',
      organicRemedy: 'Soil drenching with Trichoderma harzianum; mulching with paddy straw to prevent spore splash.',
      severity: 'moderate',
    },
    {
      id: 'd4',
      name: 'Chilli Anthracnose & Die-back (ಮೆಣಸಿನಕಾಯಿ ಕೊಳೆರೋಗ / మిరప కొమ్మ ఎండు)',
      crop: 'Red & Green Chilli',
      category: 'spices',
      pathogen: 'Colletotrichum capsici',
      symptoms: 'Necrotic sunken spots with concentric rings on ripe fruits; twig die-back from tip downward.',
      treatment: 'Spray Propiconazole 25 EC (1 ml/L) or Copper Oxychloride 50 WP (2.5 g/L).',
      organicRemedy: 'Spray fermented butter-milk (10%) or Pseudomonas fluorescens suspension @ 5g/L.',
      severity: 'high',
    },
    {
      id: 'd5',
      name: 'Banana Sigatoka & Rhizome Rot (ಬಾಳೆ ಎಲೆ ಚುಕ್ಕೆ / అరటి ఆకుమచ్చ)',
      crop: 'Banana',
      category: 'vegetables',
      pathogen: 'Pseudocercospora musae',
      symptoms: 'Linear yellowish streaks on older leaves turning dark reddish-brown with ash centers.',
      treatment: 'Foliar spray with Propiconazole (0.1%) or Mineral oil emulsion (1%) with Mancozeb.',
      organicRemedy: 'Pruning and safe burning of severely spotted lower leaves; drench basin with bio-agents.',
      severity: 'moderate',
    },
    {
      id: 'd6',
      name: 'Sugarcane Red Rot (ಕಬ್ಬು ಕೆಂಪು ಕೊಳೆರೋಗ / చెరకు ఎర్ర కుళ్లు)',
      crop: 'Sugarcane',
      category: 'cash',
      pathogen: 'Colletotrichum falcatum',
      symptoms: 'Discoloration of crown leaves, internal pith reddening with diagnostic transverse white patches.',
      treatment: 'Plant disease-free certified sets; set dipping in Carbendazim 50 WP (0.1%) before planting.',
      organicRemedy: 'Deep summer ploughing and crop rotation with green manure crops (Daincha/Sunnhemp).',
      severity: 'critical',
    },
  ];

  const filtered = diseaseCatalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartScan = (specimenIdx: number) => {
    setSelectedSpecimen(specimenIdx);
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const chosen = testSpecimens[specimenIdx];
      setScanResult({
        disease: chosen.disease,
        crop: chosen.crop,
        confidence: chosen.confidence,
        severity: chosen.severity,
        remedy: chosen.remedy,
      });
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Dossier Detail Modal */}
      {activeDossier && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold text-stone-900">{activeDossier.name}</h3>
                <span className="text-xs text-emerald-800 font-semibold block mt-0.5">
                  Host Crop: {activeDossier.crop} • <span className="italic text-stone-500">{activeDossier.pathogen}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveDossier(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-700">
              <div className="p-3 bg-stone-50 rounded-xl space-y-1 border border-stone-200/70">
                <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider">
                  Field Diagnostic Symptoms:
                </span>
                <p className="text-stone-600 leading-relaxed">{activeDossier.symptoms}</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl space-y-1 border border-emerald-200/70">
                <span className="font-bold text-emerald-950 block text-xs uppercase tracking-wider">
                  Organic & Biological Management:
                </span>
                <p className="text-emerald-900 leading-relaxed">{activeDossier.organicRemedy}</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl space-y-1 border border-amber-200/70">
                <span className="font-bold text-amber-950 block text-xs uppercase tracking-wider">
                  Recommended Chemical Control:
                </span>
                <p className="text-amber-900 leading-relaxed">{activeDossier.treatment}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-[11px] text-stone-400">
              <span>National Crop Protection Protocol</span>
              <Button variant="outline" size="sm" onClick={() => setActiveDossier(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Simulator Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <Camera className="w-5 h-5 text-emerald-700" />
                <span>AI Plant Doctor Camera Simulator</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsScanModalOpen(false);
                  setScanResult(null);
                }}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-stone-600 block">
                Choose a specimen leaf below to test the diagnostic pipeline:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {testSpecimens.map((specimen, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleStartScan(idx)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      selectedSpecimen === idx
                        ? 'border-emerald-600 bg-emerald-50/80 font-bold'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Leaf className="w-4 h-4 text-emerald-700 mb-1" />
                    <span className="line-clamp-2">{specimen.label}</span>
                  </button>
                ))}
              </div>

              {/* Viewfinder simulation */}
              <div className="relative rounded-2xl bg-stone-900 h-52 flex flex-col items-center justify-center overflow-hidden border border-stone-700 text-white p-4">
                {/* Viewfinder crosshairs */}
                <div className="absolute inset-4 border-2 border-dashed border-emerald-400/50 rounded-xl pointer-events-none" />

                {isScanning ? (
                  <div className="text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <div>
                      <p className="text-sm font-bold text-white">Analyzing Foliar Lesions...</p>
                      <p className="text-xs text-emerald-300">Running CNN Edge Feature Classification</p>
                    </div>
                  </div>
                ) : scanResult ? (
                  <div className="text-center space-y-1.5 z-10 p-2">
                    <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Confidence: {scanResult.confidence}%
                    </span>
                    <h4 className="text-base font-bold text-white">{scanResult.disease}</h4>
                    <p className="text-xs text-stone-300">Host: {scanResult.crop}</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Scan className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
                    <p className="text-xs text-stone-300 max-w-xs">
                      Click any specimen above or press button below to trigger simulated diagnostic classification.
                    </p>
                  </div>
                )}
              </div>

              {scanResult && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
                  <span className="font-bold text-emerald-950 block">Agronomic Prescription:</span>
                  <p className="text-emerald-900">{scanResult.remedy}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-[11px] text-stone-400">
                Phase 3 will support live camera stream and PWA offline inference.
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStartScan(selectedSpecimen)}
                disabled={isScanning}
              >
                {isScanning ? 'Scanning...' : 'Rescan Specimen'}
              </Button>
            </div>
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
                'Computer vision model trained to classify agricultural plant pathogens from leaf photographs.'
              )}
            </p>
          </div>
        </div>
      </div>

      <AlertBanner
        type="info"
        title="Vision Inference Model Status: Planned for Phase 3"
        message={`A deep learning vision classifier tailored for major Indian field crops in ${selectedDistrict}, ${selectedState} will be integrated in Phase 3. Below is an interactive demonstration of the diagnostic workflow and disease catalog.`}
      />

      {/* Camera / Scan Mockup Card */}
      <Card className="border-dashed border-2 border-emerald-300 bg-emerald-50/20">
        <CardContent className="py-10 px-6 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
            <Camera className="w-8 h-8 text-emerald-700" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-stone-900">
              AI Plant Doctor Camera Scanner
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
              Take a clear picture of affected leaves, stems, or fruits. The AI will classify the disease and provide tailored organic & chemical treatments for your farm.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto cursor-pointer"
              onClick={() => setIsScanModalOpen(true)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture with Camera (Demo)
            </Button>
            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto cursor-pointer"
              onClick={() => setIsScanModalOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image File (Demo)
            </Button>
          </div>

          <p className="text-[11px] text-stone-400">
            Supports JPEG/PNG • Works offline via PWA in Phase 5
          </p>
        </CardContent>
      </Card>

      {/* Indian Crop Pathogen Catalog */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              National Crop Disease & Pest Catalog
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Curated agronomic reference aligned with ICAR and State Agricultural Universities
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs overflow-x-auto">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'cereals', label: 'Cereals' },
                { id: 'cash', label: 'Cash Crops' },
                { id: 'vegetables', label: 'Vegetables' },
                { id: 'spices', label: 'Spices' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop, pathogen name, or symptom (e.g. blast, spots, curling)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        {/* Catalog grid */}
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 space-y-2">
            <p className="text-sm font-semibold text-stone-700">No diseases match your search criteria.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Reset Search & Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((d) => (
              <Card
                key={d.id}
                className="p-5 space-y-3 cursor-pointer hover:border-emerald-400 hover:shadow-xs transition-all"
                onClick={() => setActiveDossier(d)}
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
                    <span className="line-clamp-2">{d.symptoms}</span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                    <span className="font-semibold text-emerald-900">Recommended Treatment: </span>
                    <span className="line-clamp-2">{d.treatment}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                  <span>Click to view complete advisory & bio-remedy</span>
                  <span>↗</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
