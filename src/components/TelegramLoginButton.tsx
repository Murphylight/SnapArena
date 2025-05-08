"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Déclaration d'interface pour l'utilisateur Telegram
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// Interface pour Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          query_id?: string;
          auth_date?: number;
          hash?: string;
        };
      };
    };
  }
}

interface TelegramLoginButtonProps {
  botName: string;
  onAuth?: (user: TelegramUser) => void;
  className?: string;
}

// Composant pour afficher les logs
const DebugLog = ({ message }: { message: string }) => (
  <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg max-w-md overflow-auto max-h-48">
    <pre className="text-sm">{message}</pre>
  </div>
);

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botName,
  onAuth,
  className = '',
}) => {
  const { loginWithTelegram, loading } = useAuth();
  const router = useRouter();
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [debugLog, setDebugLog] = useState<string>('');

  const addLog = (message: string) => {
    setDebugLog(prev => `${new Date().toISOString()}: ${message}\n${prev}`);
  };

  useEffect(() => {
    const checkTelegramAuth = async () => {
      try {
        addLog('Checking Telegram WebApp...');
        
        // Vérifier si le script Telegram est chargé
        if (typeof window.Telegram === 'undefined') {
          addLog('Telegram script not loaded, adding it...');
          const script = document.createElement('script');
          script.src = 'https://telegram.org/js/telegram-web-app.js';
          script.async = true;
          document.body.appendChild(script);
          
          // Attendre que le script soit chargé
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        // Vérifier si nous sommes dans Telegram
        if (window.Telegram?.WebApp) {
          addLog('Telegram WebApp detected');
          
          // Initialiser le WebApp
          const webApp = window.Telegram.WebApp;
          webApp.ready();
          webApp.expand();
          
          addLog(`WebApp initData: ${webApp.initData}`);
          addLog(`WebApp initDataUnsafe: ${JSON.stringify(webApp.initDataUnsafe, null, 2)}`);
          
          setIsInTelegram(true);
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
            
            if (onAuth) {
              onAuth(telegramUser);
            }
            // Rediriger vers la page de profil
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
        console.error('Error during automatic Telegram login:', error);
      }
    };

    checkTelegramAuth();
  }, [loginWithTelegram, onAuth, router]);

  // Si nous sommes dans Telegram, ne pas afficher le bouton
  if (isInTelegram) {
    return <DebugLog message={debugLog} />;
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {loading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      ) : (
        <button
          onClick={() => {
            addLog('Login button clicked');
            window.open(`https://t.me/${botName}?start=login`, '_blank');
          }}
          className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.7 2.97-1.23 3.58-1.44 3.98-1.44.09 0 .28.02.4.09.11.06.18.14.21.23.03.1.04.2.01.32z"/>
          </svg>
          <span>Se connecter avec Telegram</span>
        </button>
      )}
      <DebugLog message={debugLog} />
    </div>
  );
};

export default TelegramLoginButton;