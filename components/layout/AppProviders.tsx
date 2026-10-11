'use client';

import React from 'react';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { WelcomeLanguageModal } from '@/components/common/WelcomeLanguageModal';
import { DemoDataBanner } from '@/components/layout/DemoDataBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#fbfcfb] text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
        <DemoDataBanner />
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <WelcomeLanguageModal />
      </div>
    </LanguageProvider>
  );
}
