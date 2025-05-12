"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { TelegramUser } from '@/types/telegram';

// Component to display logs / Composant pour afficher les logs
const DebugLog = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg max-w-md overflow-auto max-h-48">
    <pre className="text-sm">{message}</pre>
  </div>
);

const TelegramWebAppButton: React.FC = () => {
  const { loginWithTelegram } = useAuth();
  const router = useRouter();
  const [debugLog, setDebugLog] = useState<string>('');

  const addLog = (message: string) => {
    setDebugLog(prev => `${new Date().toISOString()}: ${message}\n${prev}`);
  };

  useEffect(() => {
    const initTelegramWebApp = async () => {
      try {
        addLog('Initializing Telegram WebApp...');
        
        // Check if Telegram script is loaded / Vérifier si le script Telegram est chargé
        if (typeof window.Telegram === 'undefined') {
          addLog('Telegram script not loaded, adding it...');
          const script = document.createElement('script');
          script.src = 'https://telegram.org/js/telegram-web-app.js';
          script.async = true;
          document.body.appendChild(script);
          
          // Wait for script to load / Attendre que le script soit chargé
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        // Check if we're in Telegram / Vérifier si nous sommes dans Telegram
        if (window.Telegram?.WebApp) {
          addLog('Telegram WebApp detected');
          
          // Initialize WebApp / Initialiser le WebApp
          const webApp = window.Telegram.WebApp;
          webApp.ready();
          webApp.expand();
          
          addLog(`WebApp initData: ${webApp.initData}`);
          addLog(`WebApp initDataUnsafe: ${JSON.stringify(webApp.initDataUnsafe, null, 2)}`);
          
          const user = webApp.initDataUnsafe.user;
          
          if (user) {
            addLog(`User found: ${JSON.stringify(user, null, 2)}`);
            const telegramUser: TelegramUser = {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              auth_date: Math.floor(Date.now() / 1000),
              hash: webApp.initData,
            };
            
            addLog('Attempting to login with Telegram...');
            await loginWithTelegram(telegramUser);
            addLog('Login successful');
            
            // Redirect to profile page / Rediriger vers la page de profil
            router.push('/profile');
          } else {
            addLog('No user data found in WebApp');
          }
        } else {
          addLog('Not in Telegram WebApp');
          addLog(`window.Telegram: ${typeof window.Telegram}`);
          addLog(`window.Telegram?.WebApp: ${typeof window.Telegram?.WebApp}`);
        }
      } catch (error) {
        addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
        console.error('Error during Telegram WebApp initialization:', error);
      }
    };

    initTelegramWebApp();
  }, [loginWithTelegram, router]);

  return <DebugLog message={debugLog} />;
};

export default TelegramWebAppButton; 