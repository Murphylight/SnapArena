"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { TelegramUser } from '@/types/telegram';
import Script from 'next/script';

const TelegramLoginButton: React.FC = () => {
  const { t } = useTranslation();
  const { loginWithTelegram, loading, error } = useAuth();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Définir la fonction de callback globale
    window.onTelegramAuth = (user: TelegramUser) => {
      console.log('Telegram auth callback received:', user);
      handleLogin(user);
    };

    return () => {
      // Nettoyer la fonction de callback lors du démontage
      delete window.onTelegramAuth;
    };
  }, []);

  const handleLogin = async (userData: TelegramUser) => {
    try {
      console.log('Attempting Telegram login with data:', userData);
      await loginWithTelegram({
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        hash: userData.hash
      });
      console.log('Telegram login successful');
    } catch (err) {
      console.error('Error in Telegram login:', err);
    }
  };

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
        onLoad={() => setScriptLoaded(true)}
      />
      {!scriptLoaded && (
        <button
          disabled
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.7 2.97-1.23 3.58-1.44 3.98-1.44.09 0 .28.02.4.12.11.08.14.19.15.27-.01.06.01.24 0 .38z"/>
          </svg>
          {t('auth.connectWithTelegram')}
        </button>
      )}
    </>
  );
};

export default TelegramLoginButton;