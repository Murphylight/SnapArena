'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import authService, { UserProfile } from '@/services/AuthService';
import { TelegramUser } from '@/components/TelegramLoginButton';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  loginWithTelegram: (telegramUser: TelegramUser) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  profile: null,
  loading: true,
  error: null,
  loginWithTelegram: async () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Vérifier l'état de l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          
          // Charger le profil utilisateur
          const userProfile = await authService.getUserProfile(currentUser.uid);
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Connexion avec Telegram
  const loginWithTelegram = async (telegramUser: TelegramUser) => {
    setLoading(true);
    setError(null);
    
    try {
      const userProfile = await authService.loginWithTelegram(telegramUser);
      const currentUser = await authService.getCurrentUser();
      
      setUser(currentUser);
      setProfile(userProfile);
      
      // Rediriger vers la page des jeux après connexion réussie
      router.push('/games');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login with Telegram');
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.logout();
      setUser(null);
      setProfile(null);
      
      // Rediriger vers la page d'accueil après déconnexion
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    loginWithTelegram,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 