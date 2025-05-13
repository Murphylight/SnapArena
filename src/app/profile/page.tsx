'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

// Interface for match data / Interface pour les données de match
interface Match {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  date: string;
  score: string;
}

// Mock data for match history / Données fictives pour l'historique des matchs
const mockMatches: Match[] = [
  {
    id: '1',
    opponent: 'John Doe',
    result: 'win',
    date: '2024-03-15',
    score: '3-1'
  },
  {
    id: '2',
    opponent: 'Jane Smith',
    result: 'loss',
    date: '2024-03-14',
    score: '1-2'
  },
  {
    id: '3',
    opponent: 'Mike Johnson',
    result: 'draw',
    date: '2024-03-13',
    score: '2-2'
  }
];

// Profile page component / Composant de la page de profil
const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { profile, loading, user } = useAuth();

  console.log('Profile page - User:', user); // Debug log
  console.log('Profile page - Profile:', profile); // Debug log
  console.log('Profile page - Loading:', loading); // Debug log

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!profile || !user) {
    console.log('No profile or user found, showing not logged in message'); // Debug log
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t('profile.notLoggedIn')}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile header / En-tête du profil */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative w-24 h-24">
              <Image
                src={profile.photoUrl || '/default-avatar.png'}
                alt={profile.username || profile.firstName}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.username || profile.firstName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.firstName} {profile.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Match history / Historique des matchs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('profile.matchHistory')}
          </h2>
          <div className="space-y-4">
            {mockMatches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    vs {match.opponent}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {match.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {match.score}
                  </p>
                  <p className={`text-sm ${
                    match.result === 'win'
                      ? 'text-green-600 dark:text-green-400'
                      : match.result === 'loss'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {t(`profile.${match.result}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 