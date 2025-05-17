'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function TelegramInit() {
  const { user, loginWithTelegram } = useAuth();
  const router = useRouter();
  const [isTelegramScriptLoaded, setIsTelegramScriptLoaded] = useState(false);

  useEffect(() => {
    // Vérifier si le script Telegram est déjà chargé
    if (window.Telegram?.WebApp) {
      setIsTelegramScriptLoaded(true);
      return;
    }

    // Si le script n'est pas chargé, l'ajouter
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      console.log('Telegram script loaded');
      setIsTelegramScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isTelegramScriptLoaded) return;

    const webApp = window.Telegram?.WebApp;
    console.log('TelegramInit - WebApp object:', webApp);

    if (webApp) {
      console.log('TelegramInit - Initializing WebApp');
      console.log('Platform:', webApp.platform);
      console.log('InitData:', webApp.initData);
      console.log('InitDataUnsafe:', webApp.initDataUnsafe);
      
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
  }, [isTelegramScriptLoaded, user, loginWithTelegram, router]);

  return null;
} 