"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const TelegramWebAppButton: React.FC = () => {
  const { t } = useTranslation();
  const { loginWithTelegram } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    const initWebApp = async () => {
      try {
        addLog('Initializing WebApp...');
        
        if (!window.Telegram?.WebApp) {
          addLog('Telegram WebApp not found');
          return;
        }

        // Initialize WebApp / Initialiser le WebApp
        const webApp = window.Telegram.WebApp as {
          ready: () => void;
          expand: () => void;
          initData: string;
          initDataUnsafe: {
            user?: {
              id: number;
              first_name: string;
              last_name?: string;
              username?: string;
            };
          };
        };
        webApp.ready();
        webApp.expand();

        addLog(`WebApp initData: ${webApp.initData}`);

        if (webApp.initDataUnsafe.user) {
          addLog('User data found in WebApp');
          const userData = webApp.initDataUnsafe.user;
          
          try {
            await loginWithTelegram({
              id: userData.id,
              first_name: userData.first_name,
              last_name: userData.last_name,
              username: userData.username,
              hash: webApp.initData
            });
            addLog('Login successful');
            
            // Redirect to profile page / Rediriger vers la page de profil
            router.push('/profile');
          } catch (error) {
            addLog(`Login error: ${error instanceof Error ? error.message : String(error)}`);
          }
        } else {
          addLog('No user data in WebApp');
        }
      } catch (error) {
        addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    initWebApp();
  }, [loginWithTelegram, router]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t('auth.telegramWebApp')}</h2>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <pre className="whitespace-pre-wrap text-sm">
          {logs.join('\n')}
        </pre>
      </div>
    </div>
  );
};

export default TelegramWebAppButton; 