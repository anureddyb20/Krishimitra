import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '@/components/layout/AppProviders';

export const metadata: Metadata = {
  title: 'KrishiMitra | AI-Powered Personal Farming Assistant for Indian Farmers',
  description:
    'Empowering Indian farmers across all states with AI farming assistance, localized weather intelligence, crop disease diagnosis, and mandi market prices. Supports 6 Indian languages.',
  keywords: [
    'KrishiMitra',
    'Indian Agriculture',
    'Multilingual Agri AI',
    'Smart India Hackathon',
    'Crop Disease Diagnosis',
    'Weather Advisory IMD',
    'Mandi Prices APMC',
    'Kannada Telugu Tamil Malayalam Hindi English Farming',
  ],
  authors: [{ name: 'KrishiMitra Development Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
