'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import bettingService, { BetResult } from '@/services/BettingService';
import { Timestamp } from 'firebase/firestore';

// Animation variants
const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
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

interface RecentBetsProps {
  limit?: number;
}

const RecentBets: React.FC<RecentBetsProps> = ({ limit = 5 }) => {
  const { t } = useTranslation();
  const { currency } = useUserPreferences();
  const [results, setResults] = useState<BetResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentResults = async () => {
      try {
        setIsLoading(true);
        const recentResults = await bettingService.getRecentResults(limit);
        setResults(recentResults);
      } catch (error) {
        console.error('Error fetching recent results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentResults();
  }, [limit]);

  // Format de la devise
  const formatCurrency = (amount: number) => {
    return `${amount} ${currency.symbol}`;
  };

  // Format de la date
  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp.toMillis());
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {t('recentBets.noResults')}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="overflow-hidden"
    >
      <div className="space-y-3">
        {results.map((result, index) => (
          <motion.div
            key={result.id || index}
            variants={fadeInRight}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {result.winnerName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(result.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {formatCurrency(result.potAmount)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('recentBets.winnerPot')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentBets; 