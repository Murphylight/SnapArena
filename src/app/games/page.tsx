'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import Link from 'next/link';

// Types pour les jeux
interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  minimumBet: number;
  maxPlayers: number;
  currentPlayers: number;
  status: 'open' | 'ongoing' | 'completed';
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Données de jeux factices pour la démonstration
const demoGames: Game[] = [
  {
    id: 'racing-fury',
    title: 'Racing Fury',
    description: 'Course à grande vitesse avec des obstacles et des bonus.',
    thumbnail: '/images/games/racing-fury.jpg',
    minimumBet: 5,
    maxPlayers: 8,
    currentPlayers: 3,
    status: 'open',
  },
  {
    id: 'sniper-elite',
    title: 'Sniper Elite',
    description: 'Jeu de tir de précision avec des cibles en mouvement.',
    thumbnail: '/images/games/sniper-elite.jpg',
    minimumBet: 10,
    maxPlayers: 6,
    currentPlayers: 6,
    status: 'ongoing',
  },
  {
    id: 'puzzle-masters',
    title: 'Puzzle Masters',
    description: 'Résolvez des énigmes complexes plus rapidement que vos adversaires.',
    thumbnail: '/images/games/puzzle-masters.jpg',
    minimumBet: 2,
    maxPlayers: 4,
    currentPlayers: 0,
    status: 'open',
  },
  {
    id: 'galaxy-wars',
    title: 'Galaxy Wars',
    description: 'Combat spatial avec des vaisseaux personnalisables.',
    thumbnail: '/images/games/galaxy-wars.jpg',
    minimumBet: 15,
    maxPlayers: 10,
    currentPlayers: 8,
    status: 'ongoing',
  },
];

export default function GamesPage() {
  const { t } = useTranslation();
  const { preferences } = useUserPreferences();
  const { currency } = preferences;
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un chargement de données
  useEffect(() => {
    const loadGames = async () => {
      // Ici, vous pourriez charger les jeux depuis une API ou Firestore
      await new Promise(resolve => setTimeout(resolve, 1000)); // Délai simulé
      setGames(demoGames);
      setIsLoading(false);
    };

    loadGames();
  }, []);

  // Format de la devise
  const formatCurrency = (amount: number) => {
    return `${amount} ${currency.symbol}`;
  };

  // Obtenir le statut formaté d'un jeu
  const getStatusBadge = (status: Game['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            {t('games.status.open')}
          </span>
        );
      case 'ongoing':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            {t('games.status.ongoing')}
          </span>
        );
      case 'completed':
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
            {t('games.status.completed')}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            {t('games.title')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {t('games.subtitle')}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <motion.div
            className="mt-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative aspect-w-16 aspect-h-9">
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {game.title}
                      </h3>
                      {getStatusBadge(game.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {game.description}
                    </p>
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{t('games.minimumBet')}</span>
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          {formatCurrency(game.minimumBet)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{t('games.players')}</span>
                        <span className="font-medium">
                          {game.currentPlayers} / {game.maxPlayers}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href={`/games/${game.id}`} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        game.status === 'open' 
                          ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}>
                        {game.status === 'open' 
                          ? t('games.joinGame') 
                          : game.status === 'ongoing' 
                            ? t('games.watchGame') 
                            : t('games.gameEnded')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 