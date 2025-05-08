'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
        };
      };
    };
  }
}

const TelegramWebAppButton = () => {
  const { loginWithTelegram } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (webApp) {
      // Initialiser la Web App
      webApp.ready();
      webApp.expand();

      // Configurer le bouton principal
      webApp.MainButton.setText('Se connecter');
      webApp.MainButton.show();

      // Gérer le clic sur le bouton principal
      webApp.MainButton.onClick(async () => {
        if (webApp.initDataUnsafe.user) {
          const user = {
            id: webApp.initDataUnsafe.user.id,
            first_name: webApp.initDataUnsafe.user.first_name,
            last_name: webApp.initDataUnsafe.user.last_name,
            username: webApp.initDataUnsafe.user.username,
            auth_date: Math.floor(Date.now() / 1000),
            hash: webApp.initData,
          };

          try {
            await loginWithTelegram(user);
            // Rediriger vers la page de profil
            router.push('/profile');
          } catch (error) {
            console.error('Error during Telegram login:', error);
          }
        }
      });
    }

    return () => {
      if (webApp) {
        webApp.MainButton.hide();
      }
    };
  }, [loginWithTelegram, router]);

  // Si nous sommes dans Telegram Web App, ne pas afficher le bouton
  if (window.Telegram?.WebApp) {
    return null;
  }

  // Sinon, afficher le bouton normal
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