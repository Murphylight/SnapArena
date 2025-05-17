import { auth, db } from '@/config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  Unsubscribe,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

interface TelegramData {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  hash: string;
}

// Types / Types
export interface UserProfile {
  uid: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public onAuthStateChanged(callback: (user: FirebaseUser | null) => void): Unsubscribe {
    return firebaseOnAuthStateChanged(auth, callback);
  }

  public async loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
    try {
      console.log('Attempting email login for:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email login successful for:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  }

  public async registerWithEmail(email: string, password: string, username: string): Promise<FirebaseUser> {
    try {
      console.log('Attempting email registration for:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Email registration successful for:', userCredential.user.uid);
      
      // Create user profile
      await this.createUserProfile(userCredential.user, {
        email,
        username,
        balance: 0,
      });
      
      return userCredential.user;
    } catch (error) {
      console.error('Email registration error:', error);
      throw error;
    }
  }

  public async loginWithTelegram(telegramData: TelegramData): Promise<void> {
    try {
      console.log('Attempting Telegram login with data:', telegramData);
      
      // Vérifier que nous avons toutes les données nécessaires
      if (!telegramData.id || !telegramData.hash) {
        throw new Error('Missing required Telegram data');
      }

      // Préparer les données pour l'API
      const userData = {
        id: telegramData.id,
        first_name: telegramData.first_name,
        last_name: telegramData.last_name,
        username: telegramData.username,
        photo_url: telegramData.photo_url,
        hash: telegramData.hash
      };

      console.log('Sending data to API:', userData);
      
      // Appeler l'API pour obtenir un token personnalisé
      const response = await fetch(`/api/auth/telegram?user=${encodeURIComponent(JSON.stringify(userData))}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', errorText);
        throw new Error(`Failed to get custom token: ${errorText}`);
      }
      
      console.log('API response successful, redirecting to:', response.url);
      
      // Rediriger vers la page de callback qui gérera l'authentification
      window.location.href = response.url;
    } catch (error) {
      console.error('Telegram login error:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      console.log('Attempting logout');
      await signOut(auth);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  public getCurrentUser(): FirebaseUser | null {
    const user = auth.currentUser;
    console.log('Getting current user:', user?.uid);
    return user;
  }

  public async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      console.log('Fetching user profile for:', uid);
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('User profile found:', data);
        return {
          uid: userDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as UserProfile;
      }
      
      console.log('No user profile found for:', uid);
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  private async createUserProfile(user: FirebaseUser, profileData: Partial<UserProfile>): Promise<void> {
    try {
      console.log('Creating/updating user profile for:', user.uid);
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      const now = new Date();
      const profile: Partial<UserProfile> = {
        ...profileData,
        updatedAt: now,
      };
      
      if (!userDoc.exists()) {
        console.log('Creating new user profile');
        await setDoc(userRef, {
          ...profile,
          createdAt: now,
        });
      } else {
        console.log('Updating existing user profile');
        await updateDoc(userRef, profile);
      }
      
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  }
}

export default AuthService.getInstance(); 