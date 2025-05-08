"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import CountrySelector from './CountrySelector';
import ThemeToggle from './ThemeToggle';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900 dark:text-white">SnapArena</span>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} SnapArena. All rights reserved.
            </p>
          </div>
          
          {/* Liens */}
          <div className="flex flex-col space-y-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Links
            </p>
            <div className="flex flex-col space-y-2">
              <Link 
                href="/terms" 
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              >
                {t('footer.termsOfService')}
              </Link>
              <Link 
                href="/privacy" 
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              >
                {t('footer.privacyPolicy')}
              </Link>
            </div>
          </div>
          
          {/* Contrôles */}
          <div className="flex flex-col space-y-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Settings
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <CountrySelector />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Theme:</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 