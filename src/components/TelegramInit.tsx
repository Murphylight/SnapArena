'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function TelegramInit() {
  const { user, loginWithTelegram } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const webApp = window.Telegram?.WebApp;
      console.log('TelegramInit - WebApp object:', webApp);

      if (webApp) {
        console.log('TelegramInit - Initializing WebApp');
        webApp.ready();
        webApp.expand();

        // Si l'utilisateur n'est pas connecté et que nous avons des données d'initialisation
        if (!user && webApp.initDataUnsafe?.user) {
          console.log('TelegramInit - User data from WebApp:', webApp.initDataUnsafe.user);
          const userData = {
            ...webApp.initDataUnsafe.user,
            hash: webApp.initData
          };
          loginWithTelegram(userData)
            .then(() => {
              console.log('TelegramInit - Login successful');
              router.push('/dashboard');
            })
            .catch((error) => {
              console.error('TelegramInit - Login failed:', error);
            });
        }
      } else {
        console.log('TelegramInit - Not in Telegram WebApp');
      }
    }
  }, [user, loginWithTelegram, router]);

  return null;
} 