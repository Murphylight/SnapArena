import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

// Type pour les codes de pays
export type CountryCode = 'US' | 'GB' | 'FR' | 'SN' | 'NG' | string;

// Mappings de pays vers langue
export const countryToLanguage: Record<CountryCode, string> = {
  'US': 'en',
  'GB': 'en',
  'FR': 'fr',
  'SN': 'fr',
  'NG': 'en',
  // Ajouter d'autres pays selon les besoins
};

// Mappings de pays vers devise
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Taux de conversion par rapport au USD
}

export const countryCurrencies: Record<CountryCode, Currency> = {
  'US': { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1 },
  'GB': { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.79 },
  'FR': { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.93 },
  'SN': { code: 'XOF', symbol: 'CFA', name: 'CFA Franc', exchangeRate: 611.03 },
  'NG': { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', exchangeRate: 1530.56 },
  // Ajouter d'autres pays selon les besoins
};

// Initialiser i18next
i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
    },
    lng: 'en', // Langue par défaut
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
  });

export default i18next; 