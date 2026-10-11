-- ========================================================
-- KrishiMitra — Planned Database Schema (Phase 2 Blueprint)
-- Target: Supabase PostgreSQL with PostGIS & pgvector
-- ========================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Farmer Profile table (linked to supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE,
  preferred_language TEXT DEFAULT 'ml',
  district TEXT NOT NULL,
  panchayat TEXT,
  total_land_acres NUMERIC(6, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Farm Plots table
CREATE TABLE IF NOT EXISTS farm_plots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plot_name TEXT NOT NULL,
  area_acres NUMERIC(6, 2) NOT NULL,
  soil_type TEXT,
  irrigation_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Crops table
CREATE TABLE IF NOT EXISTS crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plot_id UUID REFERENCES farm_plots(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  variety TEXT,
  planting_date DATE,
  stage TEXT,
  current_health TEXT DEFAULT 'healthy',
  expected_harvest_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Crop Disease Diagnostics
CREATE TABLE IF NOT EXISTS disease_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  diagnosed_disease TEXT NOT NULL,
  confidence_score NUMERIC(5, 2),
  recommended_treatment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Advisory Conversation Logs
CREATE TABLE IF NOT EXISTS advisory_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  query_language TEXT DEFAULT 'ml',
  response_text TEXT NOT NULL,
  model_used TEXT DEFAULT 'gemini-1.5-flash',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
