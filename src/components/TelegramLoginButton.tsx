"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const TelegramLoginButton: React.FC = () => {
  const { t } = useTranslation();
  const { loginWithTelegram, loading, error, user } = useAuth();
  const [isInTelegram, setIsInTelegram] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initWebApp = async () => {
      try {
        // Vérifier si nous sommes dans Telegram WebApp
        if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
          console.log('Not in Telegram WebApp');
          setIsInTelegram(false);
          return;
        }

        const webApp = window.Telegram.WebApp as {
          ready: () => void;
          expand: () => void;
          close: () => void;
          initData: string;
          initDataUnsafe: {
            user?: {
              id: number;
              first_name: string;
              last_name?: string;
              username?: string;
            };
          };
          isExpanded: boolean;
          platform: string;
        };

        // Initialiser WebApp
        webApp.ready();
        if (!webApp.isExpanded) {
          webApp.expand();
        }

        // Vérifier si nous sommes dans Telegram
        if (webApp.platform !== 'unknown') {
          setIsInTelegram(true);
          
          // Si nous avons des données utilisateur, tenter la connexion
          if (webApp.initDataUnsafe.user) {
            const userData = webApp.initDataUnsafe.user;
            try {
              await loginWithTelegram({
                id: userData.id,
                first_name: userData.first_name,
                last_name: userData.last_name,
                username: userData.username,
                hash: webApp.initData
              });
              console.log('Telegram login successful');
              // Rediriger vers le dashboard après connexion réussie
              router.push('/dashboard');
            } catch (error) {
              console.error('Login error:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing WebApp:', error);
        setIsInTelegram(false);
      }
    };

    initWebApp();
  }, [loginWithTelegram, router]);

  // Si nous sommes déjà connectés ou dans Telegram, ne rien afficher
  if (user || isInTelegram) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
      <p className="text-yellow-800 dark:text-yellow-200 mb-2">
        {t('auth.telegramWebAppRequired')}
      </p>
      <a
        href="https://t.me/SnapArenaBot"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0088cc] hover:bg-[#0077b3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0088cc]"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.7 2.97-1.23 3.58-1.44 3.98-1.44.09 0 .28.02.4.12.11.08.14.19.15.27-.01.06.01.24 0 .38z"/>
        </svg>
        {t('auth.openInTelegram')}
      </a>
    </div>
  );
};

export default TelegramLoginButton;