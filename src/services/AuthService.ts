import { auth, db } from '@/config/firebase';
import { 
  signInWithCustomToken, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import type { TelegramUser } from '@/types/telegram';

// Types / Types
export interface UserProfile {
  uid: string;
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  balance: number;
  lastLoginAt: Timestamp;
  createdAt: Timestamp;
}

// Telegram Auth API URL / URL de l'API d'authentification Telegram
const TELEGRAM_AUTH_API = process.env.NEXT_PUBLIC_API_URL || 'https://snap-arena-5meo.vercel.app';

class AuthService {
  // Check authentication state / Vérifier l'état de l'authentification
  getCurrentUser(): Promise<FirebaseUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
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
      console.log('Starting Telegram login process with:', telegramUser);
      
      // Validate Telegram auth and get Firebase token
      const customToken = await this.validateTelegramLogin(telegramUser);
      console.log('Received custom token');
      
      // Sign in to Firebase with custom token
      const userCredential = await signInWithCustomToken(auth, customToken);
      const { user } = userCredential;
      console.log('Firebase user created:', user.uid);
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      let userProfile: UserProfile;
      
      if (userSnap.exists()) {
        console.log('Updating existing user profile');
        // Update login information
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name || '',
          username: telegramUser.username || '',
          photoUrl: telegramUser.photo_url || '',
        });
        
        // Get updated profile
        const updatedSnap = await getDoc(userRef);
        userProfile = updatedSnap.data() as UserProfile;
      } else {
        console.log('Creating new user profile');
        // Create new user profile
        userProfile = {
          uid: user.uid,
          telegramId: telegramUser.id,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username,
          photoUrl: telegramUser.photo_url,
          balance: 0,
          lastLoginAt: serverTimestamp() as Timestamp,
          createdAt: serverTimestamp() as Timestamp,
        };
        
        await setDoc(userRef, userProfile);
      }
      
      console.log('Final user profile:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error logging in with Telegram:', error);
      throw error;
    }
  }

  // Logout / Se déconnecter
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get user profile / Obtenir le profil utilisateur
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService; 