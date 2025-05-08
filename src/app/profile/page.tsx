'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const router = useRouter();

  if (!profile || !user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center space-x-4">
            {profile.photoUrl ? (
              <div className="relative h-16 w-16">
                <Image
                  src={profile.photoUrl}
                  alt={profile.firstName}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl text-gray-600 dark:text-gray-300">
                  {profile.firstName[0]}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h1>
              {profile.username && (
                <p className="text-gray-600 dark:text-gray-300">
                  @{profile.username}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  ID Telegram
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {profile.telegramId}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Solde
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {profile.balance} crédits
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 