import { auth, db } from '@/config/firebase';
import {
  signInWithCustomToken,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { TelegramUser } from '@/types/telegram';

// Types / Types
export interface UserProfile {
  uid: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  balance: number;
  telegramId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Telegram Auth API URL / URL de l'API d'authentification Telegram
const TELEGRAM_AUTH_API = process.env.NEXT_PUBLIC_API_URL || 'https://snap-arena-5meo.vercel.app';

class AuthService {
  // Check authentication state / Vérifier l'état de l'authentification
  getCurrentUser(): Promise<FirebaseUser | null> {
    return auth.currentUser;
  }

  // Validate Telegram authentication / Vérifier l'authentification Telegram
  async validateTelegramLogin(telegramUser: TelegramUser): Promise<string> {
    try {
      console.log('Validating Telegram login with:', telegramUser);
      console.log('API URL:', TELEGRAM_AUTH_API);
      
      const response = await fetch(`${TELEGRAM_AUTH_API}/auth/telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram validation failed:', errorData);
        throw new Error(errorData.message || 'Telegram authentication failed');
      }

      const data = await response.json();
      console.log('Telegram validation successful:', data);
      return data.customToken;
    } catch (error) {
      console.error('Error validating Telegram login:', error);
      throw error;
    }
  }

  // Login with Telegram / Se connecter avec Telegram
  async loginWithTelegram(telegramUser: TelegramUser): Promise<UserProfile> {
    try {
      console.log('Starting Telegram login process...'); // Debug log
      
      // Get custom token from your backend
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramUser),
      });

      if (!response.ok) {
        throw new Error('Failed to get custom token');
      }

      const { token } = await response.json();
      console.log('Received custom token'); // Debug log

      // Sign in with custom token
      const userCredential = await signInWithCustomToken(auth, token);
      const user = userCredential.user;
      console.log('Signed in with custom token:', user.uid); // Debug log

      // Create or update user profile
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      const userData: Partial<UserProfile> = {
        uid: user.uid,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        photoUrl: telegramUser.photo_url,
        telegramId: telegramUser.id.toString(),
        updatedAt: new Date(),
      };

      if (!userDoc.exists()) {
        // New user
        console.log('Creating new user profile...'); // Debug log
        await setDoc(userRef, {
          ...userData,
          balance: 1000, // Starting balance
          createdAt: new Date(),
        });
      } else {
        // Update existing user
        console.log('Updating existing user profile...'); // Debug log
        await setDoc(userRef, userData, { merge: true });
      }

      // Get the complete user profile
      const updatedUserDoc = await getDoc(userRef);
      if (!updatedUserDoc.exists()) {
        throw new Error('Failed to create user profile');
      }

      const userProfile = updatedUserDoc.data() as UserProfile;
      console.log('User profile created/updated:', userProfile); // Debug log
      
      return userProfile;
    } catch (error) {
      console.error('Error in loginWithTelegram:', error);
      throw error;
    }
  }

  // Logout / Se déconnecter
  async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  // Get user profile / Obtenir le profil utilisateur
  async getUserProfile(uid: string): Promise<UserProfile> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      return userDoc.data() as UserProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService; 