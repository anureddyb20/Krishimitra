'use client';

import React, { Suspense } from 'react';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { LocationProvider } from '@/lib/LocationContext';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { WelcomeLanguageModal } from '@/components/common/WelcomeLanguageModal';
import { SidebarTaskbar } from '@/components/layout/SidebarTaskbar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LocationProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-[#fbfcfb] text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
            <div className="flex flex-1 w-full min-h-0">
              {/* Left-side Taskbar Navigation wrapped in Suspense for usePathname */}
              <Suspense fallback={<aside className="w-16 sm:w-20 lg:w-64 shrink-0 bg-white border-r border-stone-200/80" />}>
                <SidebarTaskbar />
              </Suspense>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0">
                <Suspense fallback={<div className="h-16 bg-white border-b border-stone-200/80" />}>
                  <Header />
                </Suspense>
                <main className="flex-1 w-full">{children}</main>
                <Footer />
              </div>
            </div>
            <WelcomeLanguageModal />
          </div>
        </AuthProvider>
      </LocationProvider>
    </LanguageProvider>
  );
}
