"use client";

import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { CountryCode } from '@/i18n';

// Liste des pays disponibles
const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  // Ajouter d'autres pays selon les besoins
];

const CountrySelector: React.FC = () => {
  const { t } = useTranslation();
  const { country, setCountry } = useUserPreferences();
  
  // Trouver le pays actuellement sélectionné
  const selectedCountry = countries.find(c => c.code === country) || countries[0];

  const handleCountryChange = (countryObj: { code: string, name: string, flag: string }) => {
    setCountry(countryObj.code as CountryCode);
  };

  return (
    <div className="w-72 z-10">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {t('country.select')}
      </label>
      <Listbox value={selectedCountry} onChange={handleCountryChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="flex items-center truncate">
              <span className="mr-2">{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-5 w-5 text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {countries.map((country) => (
                <Listbox.Option
                  key={country.code}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-white' : 'text-gray-900 dark:text-gray-200'
                    }`
                  }
                  value={country}
                >
                  {({ selected }) => (
                    <>
                      <span className={`flex items-center truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        <span className="mr-2">{country.flag}</span>
                        <span>{country.name}</span>
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600 dark:text-amber-400">
                          <svg className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CountrySelector; 