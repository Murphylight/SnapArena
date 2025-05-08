"use client";

import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

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

// Interface pour l'objet Telegram
interface TelegramInterface {
  Login: {
    auth: (options: Record<string, unknown>) => void;
  };
}

// Étendre l'interface Window pour Telegram
declare global {
  interface Window {
    Telegram?: TelegramInterface;
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

interface TelegramLoginButtonProps {
  botName: string;
  onAuth?: (user: TelegramUser) => void;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: boolean;
  className?: string;
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botName,
  onAuth,
  buttonSize = 'large',
  cornerRadius = 8,
  requestAccess = true,
  className = '',
}) => {
  const { loginWithTelegram, loading } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.innerHTML = '';
    }
    
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', cornerRadius.toString());
    script.setAttribute('data-request-access', requestAccess ? 'write' : 'read');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-onauth', 'onTelegramAuth');
    script.async = true;

    window.onTelegramAuth = (user: TelegramUser) => {
      console.log('Telegram auth callback received:', user);
      loginWithTelegram(user).catch(error => {
        console.error('Error during Telegram login:', error);
      });
      
      if (onAuth) {
        onAuth(user);
      }
    };

    if (currentContainer) {
      currentContainer.appendChild(script);
    }

    return () => {
      if (currentContainer) {
        const scriptElement = currentContainer.querySelector('script');
        if (scriptElement) {
          currentContainer.removeChild(scriptElement);
        }
      }
      delete window.onTelegramAuth;
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, loginWithTelegram, onAuth]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {loading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      ) : (
        <div ref={containerRef} id="telegram-login-container" className="telegram-login"></div>
      )}
    </div>
  );
};

export default TelegramLoginButton;