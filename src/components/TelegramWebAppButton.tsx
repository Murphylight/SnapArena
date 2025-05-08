'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

interface TelegramWebApp {
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
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

const DebugLog = ({ message }: { message: string }) => (
  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
    {message}
  </div>
);

const TelegramWebAppButton = () => {
  const { loginWithTelegram } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('TelegramWebAppButton mounted');
    const webApp = window.Telegram?.WebApp;
    addLog(`WebApp available: ${!!webApp}`);
    
    if (webApp) {
      addLog('Initializing WebApp');
      webApp.ready();
      webApp.expand();

      addLog('Configuring MainButton');
      webApp.MainButton.setText('Se connecter');
      webApp.MainButton.show();

      webApp.MainButton.onClick(async () => {
        addLog('MainButton clicked');
        if (webApp.initDataUnsafe.user) {
          addLog(`User data available: ${JSON.stringify(webApp.initDataUnsafe.user)}`);
          const user = {
            id: webApp.initDataUnsafe.user.id,
            first_name: webApp.initDataUnsafe.user.first_name,
            last_name: webApp.initDataUnsafe.user.last_name,
            username: webApp.initDataUnsafe.user.username,
            auth_date: Math.floor(Date.now() / 1000),
            hash: webApp.initData,
          };

          try {
            addLog('Attempting to login with Telegram');
            await loginWithTelegram(user);
            addLog('Login successful, redirecting to profile');
            router.push('/profile');
          } catch (error) {
            addLog(`Error during Telegram login: ${error}`);
          }
        } else {
          addLog('No user data available in initDataUnsafe');
        }
      });
    }

    return () => {
      if (webApp) {
        addLog('Cleaning up WebApp');
        webApp.MainButton.hide();
      }
    };
  }, [loginWithTelegram, router]);

  // Si nous sommes dans Telegram Web App, ne pas afficher le bouton
  if (window.Telegram?.WebApp) {
    console.log('Running inside Telegram WebApp, not showing button');
    return null;
  }

  // Sinon, afficher le bouton normal
  return (
    <div className="space-y-4">
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
        onLoad={() => addLog('Telegram script loaded')}
        onError={(e) => addLog(`Error loading Telegram script: ${e}`)}
      />
      
      {!window.Telegram?.WebApp && (
        <button
          className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            addLog('Button clicked');
            const webApp = window.Telegram?.WebApp;
            addLog(`WebApp available in click handler: ${!!webApp}`);
            
            if (webApp && webApp.initDataUnsafe.user) {
              addLog(`User data available in click handler: ${JSON.stringify(webApp.initDataUnsafe.user)}`);
              const user = {
                id: webApp.initDataUnsafe.user.id,
                first_name: webApp.initDataUnsafe.user.first_name,
                last_name: webApp.initDataUnsafe.user.last_name,
                username: webApp.initDataUnsafe.user.username,
                auth_date: Math.floor(Date.now() / 1000),
                hash: webApp.initData,
              };
              addLog('Attempting to login with Telegram');
              loginWithTelegram(user)
                .then(() => {
                  addLog('Login successful');
                  router.push('/profile');
                })
                .catch(error => {
                  addLog(`Error during Telegram login: ${error}`);
                });
            } else {
              addLog('No user data available in click handler');
            }
          }}
        >
          Se connecter avec Telegram
        </button>
      )}

      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Logs de débogage :</h3>
        <div className="space-y-1">
          {logs.map((log, index) => (
            <DebugLog key={index} message={log} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TelegramWebAppButton; 