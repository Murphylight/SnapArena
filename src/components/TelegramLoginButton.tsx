"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

interface TelegramAuthUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// Interface for Telegram WebApp / Interface pour Telegram WebApp
declare global {
  interface Window {
    TelegramLoginWidget?: {
      dataOnauth: (user: TelegramAuthUser) => void;
    };
  }
}

const TelegramLoginButton: React.FC = () => {
  const { t } = useTranslation();
  const { loginWithTelegram, loading, error } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log('TelegramLoginButton - Initializing');
    
    // Vérifier si le script Telegram est déjà chargé
    if (window.TelegramLoginWidget) {
      console.log('Telegram script already loaded');
      setIsInitialized(true);
      return;
    }

    // Charger le script Telegram
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || '');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    // Définir la fonction de callback
    window.TelegramLoginWidget = {
      dataOnauth: async (user: TelegramAuthUser) => {
        console.log('Telegram auth callback received:', user);
        try {
          await loginWithTelegram(user);
          console.log('Telegram login successful');
        } catch (err) {
          console.error('Error in Telegram login callback:', err);
        }
      },
    };

    // Ajouter le script à la page
    document.body.appendChild(script);
    setIsInitialized(true);

    return () => {
      console.log('TelegramLoginButton - Cleaning up');
      document.body.removeChild(script);
      if (window.TelegramLoginWidget) {
        window.TelegramLoginWidget = undefined;
      }
    };
  }, [loginWithTelegram]);

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
    <div id="telegram-login-button" className="flex justify-center">
      {!isInitialized && (
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
          {t('auth.loading')}
        </div>
      )}
    </div>
  );
};

export default TelegramLoginButton;