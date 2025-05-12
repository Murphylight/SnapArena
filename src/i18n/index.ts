// i18n configuration / Configuration i18n
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations / Importer les traductions
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';

// Country code type / Type pour les codes de pays
export type CountryCode = 'US' | 'FR' | 'GB' | 'DE' | 'ES' | 'IT' | 'JP' | 'CN' | 'RU' | 'BR';

// Country to language mappings / Mappings de pays vers langue
export const countryToLanguage: Record<CountryCode, string> = {
  US: 'en',
  FR: 'fr',
  GB: 'en',
  DE: 'de',
  ES: 'es',
  IT: 'it',
  JP: 'ja',
  CN: 'zh',
  RU: 'ru',
  BR: 'pt',
  // Add other countries as needed / Ajouter d'autres pays selon les besoins
};

// Country to currency mappings / Mappings de pays vers devise
export const countryCurrencies: Record<CountryCode, Currency> = {
  US: { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1 },
  FR: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 1.1 },
  GB: { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 1.3 },
  DE: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 1.1 },
  ES: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 1.1 },
  IT: { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 1.1 },
  JP: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', exchangeRate: 0.007 },
  CN: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', exchangeRate: 0.14 },
  RU: { code: 'RUB', symbol: '₽', name: 'Russian Ruble', exchangeRate: 0.011 },
  BR: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', exchangeRate: 0.2 },
  // Add other countries as needed / Ajouter d'autres pays selon les besoins
};

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Conversion rate to USD / Taux de conversion par rapport au USD
}

export const countryNames: Record<CountryCode, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  FR: 'France',
  DE: 'Germany',
  ES: 'Spain',
  IT: 'Italy',
  JP: 'Japan',
  CN: 'China',
  RU: 'Russia',
  BR: 'Brazil',
  // Ajoutez d'autres pays selon vos besoins
};

// Configure i18n / Configurer i18n
i18n
  // Detect user language / Détecter la langue de l'utilisateur
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next / Passer l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialize i18n / Initialiser i18n
  .init({
    // Available languages / Langues disponibles
    resources: {
      en: {
        translation: enTranslations
      },
      fr: {
        translation: frTranslations
      }
    },
    // Default language / Langue par défaut
    fallbackLng: 'en',
    // Debug mode / Mode debug
    debug: process.env.NODE_ENV === 'development',
    // Interpolation options / Options d'interpolation
    interpolation: {
      escapeValue: false
    },
    // Detection options / Options de détection
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n; 