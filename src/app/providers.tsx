"use client";

import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

// Composant pour gérer les thèmes avec next-themes
function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}

// Composant pour gérer les traductions avec i18next
function TranslationProviders({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

// Composant principal qui combine tous les providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviders>
      <TranslationProviders>
        <UserPreferencesProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </UserPreferencesProvider>
      </TranslationProviders>
    </ThemeProviders>
  );
} 