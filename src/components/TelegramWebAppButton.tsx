"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const TelegramWebAppButton: React.FC = () => {
  const { t } = useTranslation();
  const { loginWithTelegram, user } = useAuth();
  const router = useRouter();
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initWebApp = async () => {
      try {
        // Vérifier si nous sommes dans Telegram WebApp
        if (!window.Telegram?.WebApp) {
          setIsInTelegram(false);
          setIsLoading(false);
          return;
        }

        const webApp = window.Telegram.WebApp as {
          ready: () => void;
          expand: () => void;
          initData: string;
          colorScheme: string;
          initDataUnsafe: {
            user?: {
              id: number;
              first_name: string;
              last_name?: string;
              username?: string;
            };
          };
        };

        // Initialiser WebApp
        webApp.ready();
        webApp.expand();

        if (webApp.initDataUnsafe.user) {
          setIsInTelegram(true);
          const userData = webApp.initDataUnsafe.user;
          
          try {
            // Connexion automatique avec Telegram
            await loginWithTelegram({
              id: userData.id,
              first_name: userData.first_name,
              last_name: userData.last_name,
              username: userData.username,
              hash: webApp.initData
            });

            // Sauvegarder les préférences utilisateur
            localStorage.setItem('userPreferences', JSON.stringify({
              theme: webApp.colorScheme || 'light',
              lastLogin: new Date().toISOString()
            }));

            // Rediriger vers le dashboard
            router.push('/dashboard');
          } catch (error) {
            console.error('Login error:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing WebApp:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initWebApp();
  }, [loginWithTelegram, router]);

  const handlePlayNow = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (isInTelegram && user) {
    return (
      <button
        onClick={handlePlayNow}
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        {t('common.playNow')}
      </button>
    );
  }

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="SnapArenaBot"
        data-size="large"
        data-radius="8"
        data-request-access="write"
        data-userpic="false"
        data-onauth="onTelegramAuth(user)"
        strategy="lazyOnload"
      />
      <Script id="telegram-login-handler">
        {`
          function onTelegramAuth(user) {
            window.location.href = '/api/auth/telegram?user=' + encodeURIComponent(JSON.stringify(user));
          }
        `}
      </Script>
    </>
  );
};

export default TelegramWebAppButton; 