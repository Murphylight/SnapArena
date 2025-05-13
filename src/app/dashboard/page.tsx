'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { profile, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t('auth.pleaseLogin')}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats / Statistiques rapides */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.quickStats')}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                {t('dashboard.totalGames')}
              </span>
              <span className="text-gray-900 dark:text-white font-semibold">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                {t('dashboard.winRate')}
              </span>
              <span className="text-gray-900 dark:text-white font-semibold">0%</span>
            </div>
          </div>
        </div>

        {/* Active Games / Jeux actifs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.activeGames')}
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard.noActiveGames')}
            </p>
          </div>
        </div>

        {/* Recent Activity / Activité récente */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.recentActivity')}
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard.noRecentActivity')}
            </p>
          </div>
        </div>
      </div>

      {/* Game Categories / Catégories de jeux */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('dashboard.availableGames')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/games/racing-fury" className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Racing Fury
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('games.racingFury.description')}
              </p>
            </div>
          </Link>
          {/* Add more game categories here */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 