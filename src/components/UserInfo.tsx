"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { formatCurrency } from '@/utils/currency';
import Image from 'next/image';

const UserInfo: React.FC = () => {
  const { profile, loading } = useAuth();
  const { preferences } = useUserPreferences();

  // If profile is loading / Si le profil est en cours de chargement
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3 mt-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // If user is not logged in / Si l'utilisateur n'est pas connecté
  if (!profile) {
    return null;
  }

  // Format balance / Formater le solde
  const formattedBalance = formatCurrency(profile.balance, preferences.currency);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 relative w-10 h-10">
        <Image
          src={profile.photoUrl || '/default-avatar.png'}
          alt={profile.username || profile.firstName}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {profile.username || profile.firstName}
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="ml-1">{formattedBalance}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 