'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const TelegramInit: React.FC = () => {
  const { loginWithTelegram } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initTelegram = async () => {
      if (typeof window === 'undefined' || !window.Telegram?.WebApp) return;

      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand();

      if (webApp.initDataUnsafe?.user) {
        try {
          await loginWithTelegram({
            id: webApp.initDataUnsafe.user.id,
            first_name: webApp.initDataUnsafe.user.first_name,
            last_name: webApp.initDataUnsafe.user.last_name,
            username: webApp.initDataUnsafe.user.username,
            hash: webApp.initData
          });
          router.push('/dashboard');
        } catch (error) {
          console.error('Telegram login error:', error);
        }
      }
    };

    initTelegram();
  }, [loginWithTelegram, router]);

  return null;
};

export default TelegramInit; 