"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { TelegramUser } from '@/types/telegram';

// Interface for Telegram WebApp / Interface pour Telegram WebApp
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

// Component to display logs / Composant pour afficher les logs
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
  const [debugLog, setDebugLog] = useState<string>('');

  const addLog = (message: string) => {
    setDebugLog(prev => `${new Date().toISOString()}: ${message}\n${prev}`);
  };

  useEffect(() => {
    const loadTelegramScript = async () => {
      try {
        addLog('Loading Telegram script...');
        
        // Check if script is already loaded / Vérifier si le script est déjà chargé
        if (typeof window.Telegram !== 'undefined') {
          addLog('Telegram script already loaded');
          return;
        }

        // Create and load script / Créer et charger le script
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;
        
        // Wait for script to load / Attendre que le script soit chargé
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
        
        addLog('Telegram script loaded successfully');
      } catch (error) {
        addLog(`Error loading Telegram script: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    const checkTelegramAuth = async () => {
      try {
        addLog('Checking Telegram WebApp...');
        
        // Ensure script is loaded / S'assurer que le script est chargé
        await loadTelegramScript();
        
        // Check if we're in Telegram / Vérifier si nous sommes dans Telegram
        const isTelegramWebApp = window.Telegram?.WebApp?.initDataUnsafe?.user !== undefined;
        addLog(`Is Telegram WebApp: ${isTelegramWebApp}`);
        
        if (isTelegramWebApp) {
          addLog('Telegram WebApp detected with user data');
          
          // Initialize WebApp / Initialiser le WebApp
          if (!window.Telegram?.WebApp) {
            addLog('Telegram WebApp not available');
            return;
          }
          
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
            
            if (onAuth) {
              onAuth(telegramUser);
            }
            // Redirect to profile page / Rediriger vers la page de profil
            router.push('/profile');
          } else {
            addLog('No user data found in WebApp');
          }
        } else {
          addLog('Not in Telegram WebApp or no user data available');
          addLog(`window.Telegram: ${typeof window.Telegram}`);
          addLog(`window.Telegram?.WebApp: ${typeof window.Telegram?.WebApp}`);
          addLog(`window.Telegram?.WebApp?.initDataUnsafe: ${JSON.stringify(window.Telegram?.WebApp?.initDataUnsafe)}`);
        }
      } catch (error) {
        addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
        console.error('Error during automatic Telegram login:', error);
      }
    };

    checkTelegramAuth();
  }, [loginWithTelegram, onAuth, router]);

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