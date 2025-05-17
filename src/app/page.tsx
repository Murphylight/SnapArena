'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import HomeSlider from '@/components/HomeSlider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedLogo from '@/components/AnimatedLogo';
import RecentBets from '@/components/RecentBets';
import UserInfo from '@/components/UserInfo';
import CountrySelector from '@/components/CountrySelector';
import ThemeToggle from '@/components/ThemeToggle';
import TelegramWebAppButton from '@/components/TelegramWebAppButton';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
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

export default function Home() {
  const { t } = useTranslation();
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Home page - Auth state:', { user: user?.uid, profile, loading });
    
    // Si l'utilisateur est connecté et a un profil, rediriger vers le dashboard
    if (!loading && user && profile) {
      console.log('User is authenticated, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [user, profile, loading, router]);

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const features = [
    {
      title: t('home.features.unityGames.title'),
      description: t('home.features.unityGames.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    },
    {
      title: t('home.features.placeBets.title'),
      description: t('home.features.placeBets.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: t('home.features.globalCompetition.title'),
      description: t('home.features.globalCompetition.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: t('home.features.instantRewards.title'),
      description: t('home.features.instantRewards.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <AnimatedLogo />
          <div className="flex items-center space-x-4">
            <CountrySelector />
            <ThemeToggle />
            <UserInfo />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              SnapArena
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-gray-600 dark:text-gray-300 sm:text-2xl md:mt-5 md:max-w-3xl">
              {t('home.slogan')}
            </p>
            <div className="mt-10 space-y-6">
              {!profile && !user && (
                <div className="mt-8 flex justify-center">
                  <TelegramWebAppButton />
                </div>
              )}
              <Link 
                href="/games" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 md:py-4 md:text-lg md:px-10"
              >
                {t('home.exploreGames')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Slider Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <HomeSlider />
          </motion.div>
        </div>
      </section>

      {/* Feature Section with Recent Bets */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Features */}
            <div className="lg:col-span-2">
              <motion.div 
                className="text-center mb-12"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                  {t('home.whyChooseUs')}
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                  {t('home.platformDescription')}
                </p>
              </motion.div>

              <motion.div 
                className="mt-10"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUp}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6"
                    >
                      <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Bets */}
            <div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600">
                  <h3 className="text-xl font-bold text-white">{t('home.recentWinners')}</h3>
                </div>
                <div className="p-4">
                  <RecentBets limit={5} />
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700">
                  <Link href="/games" className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700">
                    {t('home.joinGames')}
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              {t('home.readyToStart')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-white opacity-90">
              {t('home.joinToday')}
            </p>
            <div className="mt-8">
              <Link 
                href="/games" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-amber-600 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
              >
                {t('home.startPlaying')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
