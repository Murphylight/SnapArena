"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import type { TelegramWebApp } from '@/types/telegram';

const TelegramWebAppButton: React.FC = () => {
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

        const webApp = window.Telegram.WebApp as TelegramWebApp;
        setIsInTelegram(true);

        // Initialiser WebApp
        webApp.ready();
        webApp.expand();

        // Si nous sommes dans Telegram et que l'utilisateur n'est pas connecté
        if (!user && webApp.initDataUnsafe.user) {
          try {
            const userData = webApp.initDataUnsafe.user;
            await loginWithTelegram({
              id: userData.id,
              first_name: userData.first_name,
              last_name: userData.last_name,
              username: userData.username,
              hash: webApp.initData
            });
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
  }, [loginWithTelegram, router, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Ne rien afficher si nous sommes dans Telegram
  if (isInTelegram) {
    return null;
  }

  // Afficher le bouton de connexion Telegram uniquement si nous ne sommes pas dans Telegram
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