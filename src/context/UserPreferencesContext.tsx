"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Currency } from '@/i18n';

// Context for user preferences / Contexte pour les préférences utilisateur
interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  sound: boolean;
  currency: Currency;
}

// Default preferences / Préférences par défaut
const defaultPreferences: UserPreferences = {
  language: 'en',
  theme: 'system',
  notifications: true,
  sound: true,
  currency: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 1
  }
};

// Create context / Créer le contexte
const UserPreferencesContext = createContext<{
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
}>({
  preferences: defaultPreferences,
  updatePreferences: () => {}
});

// Provider component / Composant Provider
export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const { i18n } = useTranslation();

  // Load preferences from localStorage / Charger les préférences depuis localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      const parsedPreferences = JSON.parse(savedPreferences);
      setPreferences(parsedPreferences);
      i18n.changeLanguage(parsedPreferences.language);
    }
  }, [i18n]);

  // Update preferences / Mettre à jour les préférences
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
    
    // Update language if changed / Mettre à jour la langue si elle a changé
    if (newPreferences.language) {
      i18n.changeLanguage(newPreferences.language);
    }
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Custom hook to use preferences / Hook personnalisé pour utiliser les préférences
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider / useUserPreferences doit être utilisé dans un UserPreferencesProvider');
  }
  return context;
};

export default UserPreferencesContext; 