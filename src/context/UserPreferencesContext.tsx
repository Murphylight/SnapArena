"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CountryCode, countryToLanguage, countryCurrencies, Currency } from '@/i18n';
import { getGeoLocation } from '@/services/GeoLocationService';

interface UserPreferences {
  country: CountryCode;
  language: string;
  currency: Currency;
  setCountry: (country: CountryCode) => void;
  isLoading: boolean;
}

const defaultCountry: CountryCode = 'US';

const UserPreferencesContext = createContext<UserPreferences>({
  country: defaultCountry,
  language: 'en',
  currency: countryCurrencies[defaultCountry],
  setCountry: () => {},
  isLoading: true,
});

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [country, setCountryState] = useState<CountryCode>(defaultCountry);
  const [language, setLanguage] = useState<string>(countryToLanguage[defaultCountry]);
  const [currency, setCurrency] = useState<Currency>(countryCurrencies[defaultCountry]);
  const [isLoading, setIsLoading] = useState(true);

  const setCountry = (newCountry: CountryCode) => {
    setCountryState(newCountry);
    
    const newLanguage = countryToLanguage[newCountry] || 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    
    setCurrency(countryCurrencies[newCountry] || countryCurrencies['US']);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('userCountry', newCountry);
    }
  };

  useEffect(() => {
    const initializeUserPreferences = async () => {
      try {
        // D'abord, essayer de récupérer les préférences sauvegardées
        const savedCountry = localStorage.getItem('userCountry') as CountryCode;
        
        if (savedCountry && Object.keys(countryToLanguage).includes(savedCountry)) {
          setCountry(savedCountry);
        } else {
          // Si pas de préférences sauvegardées, détecter le pays
          const geoData = await getGeoLocation();
          const detectedCountry = geoData.country_code as CountryCode;
          
          if (Object.keys(countryToLanguage).includes(detectedCountry)) {
            setCountry(detectedCountry);
          } else {
            setCountry(defaultCountry);
          }
        }
      } catch (error) {
        console.error('Error initializing user preferences:', error);
        setCountry(defaultCountry);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUserPreferences();
  }, []);

  return (
    <UserPreferencesContext.Provider
      value={{
        country,
        language,
        currency,
        setCountry,
        isLoading,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);

export default UserPreferencesContext; 