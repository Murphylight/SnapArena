'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { profile, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 animate-pulse">
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900"
      >
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xl text-gray-800 dark:text-gray-200 mb-2">
            {t('auth.pleaseLogin')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('auth.loginRequired')}
          </p>
          <Link 
            href="/login" 
            className="mt-4 inline-block px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            {t('auth.login')}
          </Link>
        </div>
      </motion.div>
    );
  }

  // Get display name for avatar alt text
  const displayName = profile.username || profile.firstName || 'User';

  return (
    <div className="flex flex-col min-h-screen">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              SnapArena
            </h1>
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
          </div>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        <motion.main 
          key={window.location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-grow pt-20 pb-16"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <motion.footer 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow z-50"
      >
        <div className="container mx-auto px-4 py-3">
          <nav className="flex justify-around items-center">
            <Link href="/dashboard" className="flex flex-col items-center text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">{t('nav.home')}</span>
            </Link>
            <Link href="/games" className="flex flex-col items-center text-gray-600 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs mt-1">{t('nav.games')}</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center text-gray-600 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">{t('nav.profile')}</span>
            </Link>
          </nav>
        </div>
      </motion.footer>
    </div>
  );
} 