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

interface TelegramLoginButtonProps {
  botName: string;
  onAuth?: (user: TelegramUser) => void;
  className?: string;
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botName,
  onAuth,
  className = '',
}) => {
  const { loginWithTelegram, loading } = useAuth();
  const router = useRouter();
  const [isInTelegram, setIsInTelegram] = useState(false);

  useEffect(() => {
    const checkTelegramAuth = async () => {
      try {
        // Vérifier si nous sommes dans Telegram
        if (window.Telegram?.WebApp) {
          setIsInTelegram(true);
          const webApp = window.Telegram.WebApp;
          const user = webApp.initDataUnsafe.user;
          
          if (user) {
            console.log('User found in Telegram WebApp:', user);
            const telegramUser: TelegramUser = {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              auth_date: Math.floor(Date.now() / 1000),
              hash: webApp.initData,
            };
            
            await loginWithTelegram(telegramUser);
            if (onAuth) {
              onAuth(telegramUser);
            }
            // Rediriger vers la page de profil
            router.push('/profile');
          }
        }
      } catch (error) {
        console.error('Error during automatic Telegram login:', error);
      }
    };

    checkTelegramAuth();
  }, [loginWithTelegram, onAuth, router]);

  // Si nous sommes dans Telegram, ne pas afficher le bouton
  if (isInTelegram) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {loading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      ) : (
        <button
          onClick={() => window.open(`https://t.me/${botName}?start=login`, '_blank')}
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
    </div>
  );
};

export default TelegramLoginButton;