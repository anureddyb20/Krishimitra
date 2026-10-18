export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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

export type SupportedLanguage = 'ml' | 'en' | 'hi' | 'kn' | 'ta' | 'te';

export type AreaUnit = 'acres' | 'cents' | 'hectares' | 'sq_ft' | 'sq_m';

export type GrowthStage =
  | 'Sowing'
  | 'Germination'
  | 'Vegetative'
  | 'Flowering'
  | 'Fruit Formation'
  | 'Harvesting'
  | 'Post-Harvest';

export type HealthStatus = 'healthy' | 'attention' | 'critical';

export type Profile = {
  id: string;
  full_name: string | null;
  preferred_language: SupportedLanguage;
  district: KeralaDistrict | null;
  village_or_town: string | null;
  phone_number: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Farm = {
  id: string;
  owner_id: string;
  farm_name: string;
  district: KeralaDistrict;
  village_or_town: string | null;
  area_value: number;
  area_unit: AreaUnit;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type FarmPlot = {
  id: string;
  farm_id: string;
  owner_id: string;
  plot_name: string;
  area_value: number;
  area_unit: AreaUnit;
  soil_type: string | null;
  irrigation_type: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type FarmCrop = {
  id: string;
  owner_id: string;
  farm_id: string;
  plot_id: string | null;
  crop_name: string;
  crop_variety: string | null;
  planting_date: string | null;
  expected_harvest_date: string | null;
  growth_stage: GrowthStage;
  area_value: number | null;
  area_unit: AreaUnit | null;
  health_status: HealthStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          preferred_language: SupportedLanguage;
          district: KeralaDistrict | null;
          village_or_town: string | null;
          phone_number: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          preferred_language?: SupportedLanguage;
          district?: KeralaDistrict | null;
          village_or_town?: string | null;
          phone_number?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          preferred_language?: SupportedLanguage;
          district?: KeralaDistrict | null;
          village_or_town?: string | null;
          phone_number?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      farms: {
        Row: {
          id: string;
          owner_id: string;
          farm_name: string;
          district: KeralaDistrict;
          village_or_town: string | null;
          area_value: number;
          area_unit: AreaUnit;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          farm_name: string;
          district: KeralaDistrict;
          village_or_town?: string | null;
          area_value: number;
          area_unit?: AreaUnit;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          farm_name?: string;
          district?: KeralaDistrict;
          village_or_town?: string | null;
          area_value?: number;
          area_unit?: AreaUnit;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'farms_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      farm_plots: {
        Row: {
          id: string;
          farm_id: string;
          owner_id: string;
          plot_name: string;
          area_value: number;
          area_unit: AreaUnit;
          soil_type: string | null;
          irrigation_type: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          owner_id: string;
          plot_name: string;
          area_value: number;
          area_unit?: AreaUnit;
          soil_type?: string | null;
          irrigation_type?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          owner_id?: string;
          plot_name?: string;
          area_value?: number;
          area_unit?: AreaUnit;
          soil_type?: string | null;
          irrigation_type?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'farm_plots_farm_id_owner_id_fkey';
            columns: ['farm_id', 'owner_id'];
            isOneToOne: false;
            referencedRelation: 'farms';
            referencedColumns: ['id', 'owner_id'];
          }
        ];
      };
      farm_crops: {
        Row: {
          id: string;
          owner_id: string;
          farm_id: string;
          plot_id: string | null;
          crop_name: string;
          crop_variety: string | null;
          planting_date: string | null;
          expected_harvest_date: string | null;
          growth_stage: GrowthStage;
          area_value: number | null;
          area_unit: AreaUnit | null;
          health_status: HealthStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          farm_id: string;
          plot_id?: string | null;
          crop_name: string;
          crop_variety?: string | null;
          planting_date?: string | null;
          expected_harvest_date?: string | null;
          growth_stage?: GrowthStage;
          area_value?: number | null;
          area_unit?: AreaUnit | null;
          health_status?: HealthStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          farm_id?: string;
          plot_id?: string | null;
          crop_name?: string;
          crop_variety?: string | null;
          planting_date?: string | null;
          expected_harvest_date?: string | null;
          growth_stage?: GrowthStage;
          area_value?: number | null;
          area_unit?: AreaUnit | null;
          health_status?: HealthStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'farm_crops_farm_id_owner_id_fkey';
            columns: ['farm_id', 'owner_id'];
            isOneToOne: false;
            referencedRelation: 'farms';
            referencedColumns: ['id', 'owner_id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
