import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { Bet, BetStatus, BetType } from '@/types/bet';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { orderBy, limit } from 'firebase/firestore';

class BettingService {
  private readonly betsCollection = 'bets';

  // Create a new bet / Créer un nouveau pari
  async createBet(bet: Omit<Bet, 'id'>): Promise<Bet> {
    try {
      const betRef = await addDoc(collection(db, this.betsCollection), {
        ...bet,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return {
        ...bet,
        id: betRef.id,
      };
    } catch (error) {
      console.error('Error creating bet:', error);
      throw new Error('Failed to create bet');
    }
  }

  // Get a bet by ID / Obtenir un pari par ID
  async getBetById(betId: string): Promise<Bet | null> {
    try {
      const betDoc = await getDoc(doc(db, this.betsCollection, betId));
      if (!betDoc.exists()) {
        return null;
      }

      return {
        id: betDoc.id,
        ...betDoc.data(),
      } as Bet;
    } catch (error) {
      console.error('Error getting bet:', error);
      throw new Error('Failed to get bet');
    }
  }

  // Get all bets for a user / Obtenir tous les paris d'un utilisateur
  async getUserBets(userId: string): Promise<Bet[]> {
    try {
      const betsQuery = query(
        collection(db, this.betsCollection),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(betsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Bet[];
    } catch (error) {
      console.error('Error getting user bets:', error);
      throw new Error('Failed to get user bets');
    }
  }

  // Update a bet / Mettre à jour un pari
  async updateBet(betId: string, updates: Partial<Bet>): Promise<void> {
    try {
      const betRef = doc(db, this.betsCollection, betId);
      await updateDoc(betRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating bet:', error);
      throw new Error('Failed to update bet');
    }
  }

  // Delete a bet / Supprimer un pari
  async deleteBet(betId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.betsCollection, betId));
    } catch (error) {
      console.error('Error deleting bet:', error);
      throw new Error('Failed to delete bet');
    }
  }

  // Get active bets / Obtenir les paris actifs
  async getActiveBets(): Promise<Bet[]> {
    try {
      const betsQuery = query(
        collection(db, this.betsCollection),
        where('status', '==', BetStatus.ACTIVE)
      );

      const querySnapshot = await getDocs(betsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Bet[];
    } catch (error) {
      console.error('Error getting active bets:', error);
      throw new Error('Failed to get active bets');
    }
  }

  // Get bets by type / Obtenir les paris par type
  async getBetsByType(type: BetType): Promise<Bet[]> {
    try {
      const betsQuery = query(
        collection(db, this.betsCollection),
        where('type', '==', type)
      );

      const querySnapshot = await getDocs(betsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Bet[];
    } catch (error) {
      console.error('Error getting bets by type:', error);
      throw new Error('Failed to get bets by type');
    }
  }
}

export const bettingService = new BettingService();
export default bettingService;

// Function to place a new bet / Fonction pour placer un nouveau pari
export const placeBet = async (matchId: string, amount: number, prediction: string): Promise<string> => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User must be authenticated to place a bet / L\'utilisateur doit être authentifié pour placer un pari');
  }

  try {
    const betRef = await addDoc(collection(db, 'bets'), {
      userId: user.uid,
      matchId,
      amount,
      prediction,
      status: 'pending',
      createdAt: Timestamp.now()
    });

    return betRef.id;
  } catch (error) {
    throw new Error(`Error placing bet / Erreur lors du placement du pari: ${error}`);
  }
};

// Function to get user's active bets / Fonction pour obtenir les paris actifs de l'utilisateur
export const getUserActiveBets = async (): Promise<Bet[]> => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User must be authenticated to view bets / L\'utilisateur doit être authentifié pour voir les paris');
  }

  try {
    const betsQuery = query(
      collection(db, 'bets'),
      where('userId', '==', user.uid),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(betsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Bet[];
  } catch (error) {
    throw new Error(`Error fetching active bets / Erreur lors de la récupération des paris actifs: ${error}`);
  }
};

// Function to get user's bet history / Fonction pour obtenir l'historique des paris de l'utilisateur
export const getUserBetHistory = async (limit: number = 10): Promise<Bet[]> => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User must be authenticated to view bet history / L\'utilisateur doit être authentifié pour voir l\'historique des paris');
  }

  try {
    const betsQuery = query(
      collection(db, 'bets'),
      where('userId', '==', user.uid),
      where('status', 'in', ['won', 'lost']),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );

    const querySnapshot = await getDocs(betsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Bet[];
  } catch (error) {
    throw new Error(`Error fetching bet history / Erreur lors de la récupération de l'historique des paris: ${error}`);
  }
};

// Function to get upcoming matches / Fonction pour obtenir les matchs à venir
export const getUpcomingMatches = async (limit: number = 5): Promise<Match[]> => {
  const db = getFirestore();

  try {
    const matchesQuery = query(
      collection(db, 'matches'),
      where('status', '==', 'scheduled'),
      where('startTime', '>', Timestamp.now()),
      orderBy('startTime', 'asc'),
      limit(limit)
    );

    const querySnapshot = await getDocs(matchesQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Match[];
  } catch (error) {
    throw new Error(`Error fetching upcoming matches / Erreur lors de la récupération des matchs à venir: ${error}`);
  }
};

// Function to get live matches / Fonction pour obtenir les matchs en direct
export const getLiveMatches = async (): Promise<Match[]> => {
  const db = getFirestore();

  try {
    const matchesQuery = query(
      collection(db, 'matches'),
      where('status', '==', 'live')
    );

    const querySnapshot = await getDocs(matchesQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Match[];
  } catch (error) {
    throw new Error(`Error fetching live matches / Erreur lors de la récupération des matchs en direct: ${error}`);
  }
}; 