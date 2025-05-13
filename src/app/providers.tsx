"use client";

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import { AuthProvider } from '@/context/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

// Provider component that combines all providers / Composant Provider qui combine tous les providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <UserPreferencesProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </UserPreferencesProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
} 