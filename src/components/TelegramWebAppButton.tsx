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
      console.log('🔍 Initializing WebApp...');
      console.log('Window Telegram object:', window.Telegram);
      
      try {
        // Vérifier si nous sommes dans Telegram WebApp
        if (!window.Telegram?.WebApp) {
          console.log('❌ Not in Telegram WebApp');
          setIsInTelegram(false);
          setIsLoading(false);
          return;
        }

        const webApp = window.Telegram.WebApp as TelegramWebApp;
        console.log('✅ In Telegram WebApp');
        console.log('WebApp platform:', webApp.platform);
        console.log('WebApp initDataUnsafe:', webApp.initDataUnsafe);
        
        setIsInTelegram(true);

        // Initialiser WebApp
        webApp.ready();
        webApp.expand();
        console.log('✅ WebApp initialized and expanded');

        // Si nous sommes dans Telegram et que l'utilisateur n'est pas connecté
        if (!user && webApp.initDataUnsafe.user) {
          console.log('👤 User not logged in, attempting auto-login');
          try {
            const userData = webApp.initDataUnsafe.user;
            console.log('User data from Telegram:', userData);
            
            await loginWithTelegram({
              id: userData.id,
              first_name: userData.first_name,
              last_name: userData.last_name,
              username: userData.username,
              hash: webApp.initData
            });
            console.log('✅ Login successful, redirecting to dashboard');
            router.push('/dashboard');
          } catch (error) {
            console.error('❌ Login error:', error);
          }
        } else {
          console.log('User status:', user ? 'Logged in' : 'Not logged in');
          console.log('Telegram user data:', webApp.initDataUnsafe.user ? 'Present' : 'Not present');
        }
      } catch (error) {
        console.error('❌ Error initializing WebApp:', error);
      } finally {
        setIsLoading(false);
        console.log('🏁 Initialization complete');
        console.log('Current state:', {
          isInTelegram,
          isLoading,
          isUserLoggedIn: !!user
        });
      }
    };

    initWebApp();
  }, [loginWithTelegram, router, user]);

  if (isLoading) {
    console.log('⏳ Loading state...');
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Ne rien afficher si nous sommes dans Telegram
  if (isInTelegram) {
    console.log('🎯 In Telegram, not showing button');
    return null;
  }

  // Afficher le bouton de connexion Telegram uniquement si nous ne sommes pas dans Telegram
  console.log('🔘 Showing Telegram login button');
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
            console.log('🔑 Telegram auth callback received:', user);
            window.location.href = '/api/auth/telegram?user=' + encodeURIComponent(JSON.stringify(user));
          }
        `}
      </Script>
    </>
  );
};

export default TelegramWebAppButton; 