"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CountryCode, countryToLanguage, countryCurrencies, Currency } from '@/i18n';

interface UserPreferences {
  country: CountryCode;
  language: string;
  currency: Currency;
  setCountry: (country: CountryCode) => void;
}

const defaultCountry: CountryCode = 'US';

const UserPreferencesContext = createContext<UserPreferences>({
  country: defaultCountry,
  language: 'en',
  currency: countryCurrencies[defaultCountry],
  setCountry: () => {},
});

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [country, setCountryState] = useState<CountryCode>(defaultCountry);
  const [language, setLanguage] = useState<string>(countryToLanguage[defaultCountry]);
  const [currency, setCurrency] = useState<Currency>(countryCurrencies[defaultCountry]);

  const setCountry = (newCountry: CountryCode) => {
    setCountryState(newCountry);
    
    // Mettre à jour la langue basée sur le pays
    const newLanguage = countryToLanguage[newCountry] || 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    
    // Mettre à jour la devise basée sur le pays
    setCurrency(countryCurrencies[newCountry] || countryCurrencies['US']);
    
    // Enregistrer les préférences dans le stockage local
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCountry', newCountry);
    }
  };

  // Charger les préférences sauvegardées au démarrage
  useEffect(() => {
    const savedCountry = localStorage.getItem('country');
    if (savedCountry) {
      setCountry(savedCountry);
    }
  }, [setCountry]);

  return (
    <UserPreferencesContext.Provider
      value={{
        country,
        language,
        currency,
        setCountry,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesContext; 