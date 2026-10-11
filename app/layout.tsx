import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '@/components/layout/AppProviders';

export const metadata: Metadata = {
  title: 'KrishiMitra | AI-Powered Personal Farming Assistant for Kerala Farmers',
  description:
    'Empowering Kerala farmers with AI farming assistance, monsoon weather intelligence, crop disease diagnosis, and mandi market prices. Supports Malayalam and 5 other languages.',
  keywords: [
    'KrishiMitra',
    'Kerala Farming',
    'Malayalam AI',
    'Agriculture Kerala',
    'Smart India Hackathon',
    'Crop Disease Diagnosis',
    'Kerala Weather Advisory',
    'Mandi Prices Kerala',
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
