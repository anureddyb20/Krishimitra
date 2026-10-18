-- ========================================================
-- KrishiMitra — Database Schema (Phase 2 Master Schema)
-- Target: Supabase PostgreSQL with RLS and Auth Triggers
-- ========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------
-- Function: Auto-update updated_at timestamp
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------
-- Table A: profiles
-- Linked to auth.users. Automatically created on registration.
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'ml'
    CHECK (preferred_language IN ('ml', 'en', 'hi', 'kn', 'ta', 'te')),
  district TEXT
    CHECK (district IS NULL OR district IN (
      'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
      'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
      'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
    )),
  village_or_town TEXT,
  phone_number TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatic profile creation on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    preferred_language,
    district,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'ml'),
    NULLIF(NEW.raw_user_meta_data->>'district', ''),
    FALSE
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    preferred_language = EXCLUDED.preferred_language,
    updated_at = NOW()
  WHERE public.profiles.full_name IS NULL OR public.profiles.full_name = '';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------
-- Table B: farms
-- Multiple farms per farmer
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farm_name TEXT NOT NULL,
  district TEXT NOT NULL
    CHECK (district IN (
      'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
      'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
      'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
    )),
  village_or_town TEXT,
  area_value NUMERIC(10, 2) NOT NULL CHECK (area_value > 0),
  area_unit TEXT NOT NULL DEFAULT 'acres'
    CHECK (area_unit IN ('acres', 'cents', 'hectares', 'sq_ft', 'sq_m')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_farm_owner UNIQUE (id, owner_id)
);

CREATE INDEX IF NOT EXISTS idx_farms_owner_id ON public.farms(owner_id);

DROP TRIGGER IF EXISTS trg_farms_updated_at ON public.farms;
CREATE TRIGGER trg_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------
-- Table C: farm_plots
-- Plots within a farm. Strong owner & farm linkage prevents foreign association.
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farm_plots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  plot_name TEXT NOT NULL,
  area_value NUMERIC(10, 2) NOT NULL CHECK (area_value > 0),
  area_unit TEXT NOT NULL DEFAULT 'acres'
    CHECK (area_unit IN ('acres', 'cents', 'hectares', 'sq_ft', 'sq_m')),
  soil_type TEXT,
  irrigation_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_plot_farm_owner FOREIGN KEY (farm_id, owner_id)
    REFERENCES public.farms(id, owner_id) ON DELETE CASCADE,
  CONSTRAINT uq_plot_farm_owner UNIQUE (id, farm_id, owner_id)
);

CREATE INDEX IF NOT EXISTS idx_farm_plots_farm_id ON public.farm_plots(farm_id);
CREATE INDEX IF NOT EXISTS idx_farm_plots_owner_id ON public.farm_plots(owner_id);

DROP TRIGGER IF EXISTS trg_farm_plots_updated_at ON public.farm_plots;
CREATE TRIGGER trg_farm_plots_updated_at
  BEFORE UPDATE ON public.farm_plots
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------
-- Table D: farm_crops
-- Crops linked to farm and optional plot.
-- Composite foreign keys guarantee crop cannot belong to another farmer or another farm.
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farm_crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  farm_id UUID NOT NULL,
  plot_id UUID,
  crop_name TEXT NOT NULL,
  crop_variety TEXT,
  planting_date DATE,
  expected_harvest_date DATE,
  growth_stage TEXT NOT NULL DEFAULT 'Vegetative'
    CHECK (growth_stage IN (
      'Sowing', 'Germination', 'Vegetative', 'Flowering',
      'Fruit Formation', 'Harvesting', 'Post-Harvest'
    )),
  area_value NUMERIC(10, 2) CHECK (area_value IS NULL OR area_value > 0),
  area_unit TEXT DEFAULT 'acres'
    CHECK (area_unit IN ('acres', 'cents', 'hectares', 'sq_ft', 'sq_m')),
  health_status TEXT NOT NULL DEFAULT 'healthy'
    CHECK (health_status IN ('healthy', 'attention', 'critical')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_crop_farm_owner FOREIGN KEY (farm_id, owner_id)
    REFERENCES public.farms(id, owner_id) ON DELETE CASCADE,
  CONSTRAINT fk_crop_plot_farm_owner FOREIGN KEY (plot_id, farm_id, owner_id)
    REFERENCES public.farm_plots(id, farm_id, owner_id) ON DELETE SET NULL,
  CONSTRAINT chk_crop_harvest_date CHECK (
    expected_harvest_date IS NULL OR planting_date IS NULL OR expected_harvest_date >= planting_date
  )
);

CREATE INDEX IF NOT EXISTS idx_farm_crops_farm_id ON public.farm_crops(farm_id);
CREATE INDEX IF NOT EXISTS idx_farm_crops_plot_id ON public.farm_crops(plot_id);
CREATE INDEX IF NOT EXISTS idx_farm_crops_owner_id ON public.farm_crops(owner_id);

DROP TRIGGER IF EXISTS trg_farm_crops_updated_at ON public.farm_crops;
CREATE TRIGGER trg_farm_crops_updated_at
  BEFORE UPDATE ON public.farm_crops
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ========================================================
-- Row Level Security (RLS) Configuration
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_crops ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 2. Farms Policies
DROP POLICY IF EXISTS "Farmers can view own farms" ON public.farms;
CREATE POLICY "Farmers can view own farms"
  ON public.farms FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Farmers can create own farms" ON public.farms;
CREATE POLICY "Farmers can create own farms"
  ON public.farms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Farmers can update own farms" ON public.farms;
CREATE POLICY "Farmers can update own farms"
  ON public.farms FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Farmers can delete own farms" ON public.farms;
CREATE POLICY "Farmers can delete own farms"
  ON public.farms FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- 3. Farm Plots Policies
DROP POLICY IF EXISTS "Farmers can view plots of own farms" ON public.farm_plots;
CREATE POLICY "Farmers can view plots of own farms"
  ON public.farm_plots FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Farmers can create plots in own farms" ON public.farm_plots;
CREATE POLICY "Farmers can create plots in own farms"
  ON public.farm_plots FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Farmers can update plots of own farms" ON public.farm_plots;
CREATE POLICY "Farmers can update plots of own farms"
  ON public.farm_plots FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Farmers can delete plots of own farms" ON public.farm_plots;
CREATE POLICY "Farmers can delete plots of own farms"
  ON public.farm_plots FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- 4. Farm Crops Policies
DROP POLICY IF EXISTS "Farmers can view crops in own farms" ON public.farm_crops;
CREATE POLICY "Farmers can view crops in own farms"
  ON public.farm_crops FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Farmers can create crops in own farms" ON public.farm_crops;
CREATE POLICY "Farmers can create crops in own farms"
  ON public.farm_crops FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Farmers can update crops in own farms" ON public.farm_crops;
CREATE POLICY "Farmers can update crops in own farms"
  ON public.farm_crops FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM public.farms f WHERE f.id = farm_id AND f.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Farmers can delete crops in own farms" ON public.farm_crops;
CREATE POLICY "Farmers can delete crops in own farms"
  ON public.farm_crops FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);
