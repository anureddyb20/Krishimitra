export type KeralaDistrict =
  | 'Alappuzha'
  | 'Ernakulam'
  | 'Idukki'
  | 'Kannur'
  | 'Kasaragod'
  | 'Kollam'
  | 'Kottayam'
  | 'Kozhikode'
  | 'Malappuram'
  | 'Palakkad'
  | 'Pathanamthitta'
  | 'Thiruvananthapuram'
  | 'Thrissur'
  | 'Wayanad';

export interface WeatherData {
  district: KeralaDistrict;
  temp: number;
  condition: string;
  conditionCode: 'rain' | 'cloudy' | 'sunny' | 'humid';
  humidity: number;
  rainfallMm: number;
  windSpeedKmh: number;
  forecast: {
    day: string;
    temp: number;
    rainfallMm: number;
    condition: string;
  }[];
  advisory: string;
  isDemo: boolean;
}

export interface CropItem {
  id: string;
  nameKey: string;
  defaultName: string;
  category: 'Spices' | 'Plantation' | 'Cash Crop' | 'Paddy' | 'Fruits' | 'Vegetables';
  areaAcres: number;
  plantingDate: string;
  stage: string;
  healthStatus: 'healthy' | 'attention' | 'critical';
  healthScore: number;
  imageUrl?: string;
}

export interface CropDiseaseAlert {
  id: string;
  cropName: string;
  diseaseName: string;
  severity: 'low' | 'moderate' | 'high';
  affectedArea: string;
  recommendedAction: string;
  identifiedDate: string;
  isDemo: boolean;
}

export interface MarketPriceItem {
  id: string;
  cropKey: string;
  cropName: string;
  marketName: string;
  district: KeralaDistrict;
  pricePerKg: number;
  priceChange: number; // e.g. +5.2%
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  isDemo: boolean;
}

export interface FarmTaskItem {
  id: string;
  titleKey: string;
  defaultTitle: string;
  crop: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: 'irrigation' | 'fertilizer' | 'pest_control' | 'harvesting';
}

export interface QuickAIPrompt {
  id: string;
  textKey: string;
  defaultText: string;
  category: 'disease' | 'weather' | 'fertilizer' | 'scheme';
}
