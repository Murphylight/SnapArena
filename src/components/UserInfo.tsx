"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import Link from 'next/link';
import Image from 'next/image';

const UserInfo: React.FC = () => {
  const { t } = useTranslation();
  const { profile, loading, logout } = useAuth();
  const { currency } = useUserPreferences();

  // Si le profil est en cours de chargement
  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté
  if (!profile) {
    return null;
  }

  // Formater le solde
  const formatBalance = (balance: number) => {
    return `${balance} ${currency.symbol}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-md p-1 flex items-center">
        <div className="flex items-center mr-2">
          <div className="flex items-center bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 p-1.5 rounded-full mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{formatBalance(profile.balance)}</span>
        </div>
        
        <div className="relative">
          <button className="flex items-center space-x-2 focus:outline-none">
            <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={profile.firstName}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">
                  {profile.firstName.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:block">
              {profile.firstName}
            </span>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              {t('user.profile')}
            </Link>
            <button
              onClick={() => logout()}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {t('user.logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 