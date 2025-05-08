"use client";

import React from 'react';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { CountryCode, countryNames } from '@/i18n';

const CountrySelector: React.FC = () => {
  const { country, setCountry, isLoading } = useUserPreferences();

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-8 w-24"></div>
    );
  }

  return (
    <div className="relative">
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value as CountryCode)}
        className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
      >
        {Object.entries(countryNames).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default CountrySelector; 