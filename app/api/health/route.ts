import { NextResponse } from 'next/server';
import { isSupabaseServerConfigured } from '@/lib/supabase/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    project: 'KrishiMitra — AI-Powered Personal Farming Assistant for Kerala Farmers',
    phase: 'Phase 1: Project Setup, Multilingual Foundation & Frontend Architecture',
    supportedLanguages: ['ml', 'en', 'hi', 'kn', 'ta', 'te'],
    services: {
      nextjs: 'active',
      supabase: isSupabaseServerConfigured() ? 'configured' : 'standby (Phase 2)',
      gemini_ai: 'planned (Phase 2)',
      imd_weather: 'planned (Phase 3)',
      agmarknet: 'planned (Phase 4)',
    },
    timestamp: new Date().toISOString(),
  });
}
