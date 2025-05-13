"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';

const UserInfo: React.FC = () => {
  const { t } = useTranslation();
  const { profile, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="animate-pulse flex items-center space-x-4">
        <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        {t('auth.login')}
      </Link>
    );
  }

  // Get display name for avatar alt text
  const displayName = profile.username || profile.firstName || 'User';

  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('dashboard.balance')}
        </p>
        <p className="text-lg font-semibold text-amber-500">
          {profile.balance} {t('common.coins')}
        </p>
      </div>
      <Link href="/profile" className="flex items-center space-x-2">
        <div className="relative w-10 h-10">
          <Image
            src={profile.photoUrl || '/default-avatar.png'}
            alt={displayName}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-gray-900 dark:text-white">
          {displayName}
        </span>
      </Link>
    </div>
  );
};

export default UserInfo; 