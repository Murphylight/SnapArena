import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Footer from '@/components/Footer';
import TelegramInit from '@/components/TelegramInit';
import BottomNav from '@/components/BottomNav';
import DebugPanel from '@/components/DebugPanel';

// Initialize Inter font / Initialiser la police Inter
const inter = Inter({ subsets: ['latin'] });

// Metadata for the application / Métadonnées pour l'application
export const metadata: Metadata = {
  title: 'SnapArena - Compete. Win. Repeat.',
  description: 'Play Unity WebGL games and win real money on SnapArena.',
  keywords: 'unity games, webgl, gaming, betting, telegram, online games, competitive gaming',
  authors: [{ name: 'SnapArena Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ],
};

// Root layout component / Composant de mise en page racine
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white antialiased`}>
        <Providers>
          <TelegramInit />
          <main className="pb-16">
            {children}
          </main>
          <BottomNav />
          <Footer />
          <DebugPanel />
        </Providers>
      </body>
    </html>
  );
}
