'use client';

import React, { useState } from 'react';
import { Sparkles, X, Info } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export function DemoDataBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useTranslation();

  if (dismissed) return null;

  return (
    <aside
      aria-label="Demonstration Notice"
      className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white text-xs py-2 px-4 shadow-inner border-b border-emerald-800/40"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 inline" /> {t('common.demo_mode', 'Demo Mode')}
          </span>
          <span className="font-medium text-stone-200">
            {t('demo_notice', 'Phase 1 Prototype — Demonstration Data Only.')}
          </span>
          <span className="hidden md:inline text-stone-400">
            • {t('common.phase_2_roadmap', 'Supabase, Gemini AI, IMD & Agmarknet APIs connect in later phases.')}
          </span>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-stone-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
