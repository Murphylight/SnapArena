'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import authService, { UserProfile } from '@/services/AuthService';
import { TelegramUser } from '@/types/telegram';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Interface for user profile / Interface pour le profil utilisateur
interface UserProfile {
  id: string;
  username: string;
  email: string;
  photoURL?: string;
  telegramId?: string;
  createdAt: Date;
  lastLogin: Date;
}

// Interface for auth context / Interface pour le contexte d'authentification
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

// Create context / Créer le contexte
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

// Provider component / Composant Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Listen for auth state changes / Écouter les changements d'état d'authentification
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(true);

      if (user) {
        try {
          // Get user profile from Firestore / Obtenir le profil utilisateur depuis Firestore
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile({
              id: user.uid,
              username: userData.username,
              email: userData.email,
              photoURL: userData.photoURL,
              telegramId: userData.telegramId,
              createdAt: userData.createdAt.toDate(),
              lastLogin: userData.lastLogin.toDate()
            });
          }
        } catch (err) {
          setError('Error loading user profile / Erreur lors du chargement du profil utilisateur');
          console.error('Error loading user profile / Erreur lors du chargement du profil utilisateur:', err);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    // Cleanup subscription / Nettoyer l'abonnement
    return () => unsubscribe();
  }, []);

  // Login with Telegram / Connexion avec Telegram
  const loginWithTelegram = async (telegramUser: TelegramUser) => {
    setLoading(true);
    setError(null);
    
    try {
      const userProfile = await authService.loginWithTelegram(telegramUser);
      const currentUser = await authService.getCurrentUser();
      
      setUser(currentUser);
      setProfile(userProfile);
      
      // Redirect to games page after successful login / Rediriger vers la page des jeux après connexion réussie
      router.push('/games');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login with Telegram');
    } finally {
      setLoading(false);
    }
  };

  // Logout / Déconnexion
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.logout();
      setUser(null);
      setProfile(null);
      
      // Redirect to home page after logout / Rediriger vers la page d'accueil après déconnexion
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