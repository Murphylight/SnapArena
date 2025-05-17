'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile, default as authService } from '@/services/AuthService';

interface TelegramData {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  hash: string;
}

// Interface for auth context / Interface pour le contexte d'authentification
interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  loginWithTelegram: (telegramData: TelegramData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component / Composant Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Listen for auth state changes / Écouter les changements d'état d'authentification
  useEffect(() => {
    console.log('AuthProvider - Setting up auth state listener');
    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      console.log('Auth state changed:', currentUser?.uid);
      setLoading(true);
      setError(null);

      try {
        if (currentUser) {
          setUser(currentUser);
          const userProfile = await authService.getUserProfile(currentUser.uid);
          console.log('User profile fetched:', userProfile);
          setProfile(userProfile);

          // Ensure profile is set before redirecting
          if (userProfile) {
            console.log('Redirecting to dashboard');
            router.push('/dashboard');
          }
        } else {
          console.log('No user found, clearing state');
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider - Cleaning up auth state listener');
      unsubscribe();
    };
  }, [router]);

  // Login with Telegram / Connexion avec Telegram
  const loginWithTelegram = async (telegramData: TelegramData) => {
    try {
      setError(null);
      console.log('Attempting Telegram login with data:', telegramData);
      
      // La méthode loginWithTelegram gère maintenant la redirection
      await authService.loginWithTelegram(telegramData);
      
      // Pas besoin de gérer le retour utilisateur ici car la redirection
      // vers /auth/callback s'en charge
    } catch (error) {
      console.error('Error in loginWithTelegram:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  // Logout / Déconnexion
  const logout = async () => {
    try {
      console.log('Attempting logout');
      setLoading(true);
      setError(null);

      await authService.logout();
      console.log('Logout successful');

      setUser(null);
      setProfile(null);
      router.push('/');
    } catch (err) {
      console.error('Error in logout:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 