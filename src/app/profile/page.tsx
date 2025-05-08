'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Interface pour un match
interface Match {
  id: string;
  date: string;
  game: string;
  result: 'win' | 'loss' | 'draw';
  amount: number;
}

// Données de test pour l'historique des matchs
const mockMatches: Match[] = [
  {
    id: '1',
    date: '2024-03-20',
    game: 'Snap Battle',
    result: 'win',
    amount: 100,
  },
  {
    id: '2',
    date: '2024-03-19',
    game: 'Snap Battle',
    result: 'loss',
    amount: -50,
  },
  {
    id: '3',
    date: '2024-03-18',
    game: 'Snap Battle',
    result: 'win',
    amount: 75,
  },
];

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
        {/* Carte de profil */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
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

        {/* Historique des matchs */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Historique des matchs
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockMatches.map((match) => (
              <div key={match.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {match.game}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(match.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        match.result === 'win'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : match.result === 'loss'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {match.result === 'win'
                        ? 'Victoire'
                        : match.result === 'loss'
                        ? 'Défaite'
                        : 'Égalité'}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        match.amount > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {match.amount > 0 ? '+' : ''}
                      {match.amount} crédits
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 