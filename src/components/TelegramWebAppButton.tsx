'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

const TelegramWebAppButton = () => {
  const { loginWithTelegram } = useAuth();

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (webApp && webApp.initDataUnsafe.user) {
      const user = {
        id: webApp.initDataUnsafe.user.id,
        first_name: webApp.initDataUnsafe.user.first_name,
        last_name: webApp.initDataUnsafe.user.last_name,
        username: webApp.initDataUnsafe.user.username,
        auth_date: Math.floor(Date.now() / 1000),
        hash: webApp.initData,
      };

      console.log('Telegram Web App user:', user);
      loginWithTelegram(user).catch(error => {
        console.error('Error during Telegram login:', error);
      });
    }
  }, [loginWithTelegram]);

  return (
    <button
      className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-2 px-4 rounded"
      onClick={() => {
        const webApp = window.Telegram?.WebApp;
        if (webApp && webApp.initDataUnsafe.user) {
          const user = {
            id: webApp.initDataUnsafe.user.id,
            first_name: webApp.initDataUnsafe.user.first_name,
            last_name: webApp.initDataUnsafe.user.last_name,
            username: webApp.initDataUnsafe.user.username,
            auth_date: Math.floor(Date.now() / 1000),
            hash: webApp.initData,
          };
          loginWithTelegram(user).catch(error => {
            console.error('Error during Telegram login:', error);
          });
        }
      }}
    >
      Se connecter avec Telegram
    </button>
  );
};

export default TelegramWebAppButton; 