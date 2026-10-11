'use client';

import React from 'react';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { LocationProvider } from '@/lib/LocationContext';
import { WelcomeLanguageModal } from '@/components/common/WelcomeLanguageModal';
import { DemoDataBanner } from '@/components/layout/DemoDataBanner';
import { SidebarTaskbar } from '@/components/layout/SidebarTaskbar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LocationProvider>
        <div className="min-h-screen flex flex-col bg-[#fbfcfb] text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
          <DemoDataBanner />
          <div className="flex flex-1 w-full min-h-0">
            {/* Left-side Taskbar Navigation */}
            <SidebarTaskbar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
          </div>
          <WelcomeLanguageModal />
        </div>
      </LocationProvider>
    </LanguageProvider>
  );
}
