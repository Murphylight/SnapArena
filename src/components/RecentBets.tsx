'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { formatCurrency } from '@/utils/currency';

// Animation variants / Variantes d'animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

interface Bet {
  id: string;
  gameName: string;
  amount: number;
  status: 'won' | 'lost' | 'pending';
  timestamp: Date;
}

interface RecentBetsProps {
  limit?: number;
}

const mockBets: Bet[] = [
  {
    id: '1',
    gameName: 'Racing Fury',
    amount: 10,
    status: 'won',
    timestamp: new Date()
  },
  {
    id: '2',
    gameName: 'Sniper Elite',
    amount: 5,
    status: 'lost',
    timestamp: new Date()
  },
  {
    id: '3',
    gameName: 'Puzzle Masters',
    amount: 8,
    status: 'pending',
    timestamp: new Date()
  },
  {
    id: '4',
    gameName: 'Galaxy Wars',
    amount: 12,
    status: 'won',
    timestamp: new Date()
  },
  {
    id: '5',
    gameName: 'Battle Chess',
    amount: 7,
    status: 'lost',
    timestamp: new Date()
  },
  {
    id: '6',
    gameName: 'Speed Run',
    amount: 15,
    status: 'won',
    timestamp: new Date()
  }
];

const RecentBets: React.FC<RecentBetsProps> = ({ limit }) => {
  const { t } = useTranslation();
  const { preferences } = useUserPreferences();
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    // Replace this with real fetch logic if needed
    setBets(mockBets);
  }, []);

  const displayedBets = limit ? bets.slice(0, limit) : bets;

  // Currency format / Format de la devise
  const formatAmount = (amount: number) => {
    return formatCurrency(amount, preferences.currency);
  };

  // Date format / Format de la date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(preferences.language, {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('bets.recent')}
      </h2>
      <div className="space-y-4">
        {displayedBets.map((bet) => (
          <motion.div
            key={bet.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${
                bet.status === 'won' ? 'bg-green-100 dark:bg-green-900' :
                bet.status === 'lost' ? 'bg-red-100 dark:bg-red-900' :
                'bg-yellow-100 dark:bg-yellow-900'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{bet.gameName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(bet.timestamp)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium ${
                bet.status === 'won' ? 'text-green-600 dark:text-green-400' :
                bet.status === 'lost' ? 'text-red-600 dark:text-red-400' :
                'text-yellow-600 dark:text-yellow-400'
              }`}>
                {formatAmount(bet.amount)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(`bets.status.${bet.status}`)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentBets; 