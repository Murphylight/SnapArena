import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp, 
  DocumentData,
  Timestamp 
} from 'firebase/firestore';

export interface Bet {
  id?: string;
  userId: string;
  userName: string;
  gameId: string;
  amount: number;
  timestamp: Timestamp;
  status: 'pending' | 'confirmed' | 'won' | 'lost';
}

export interface Game {
  id?: string;
  title: string;
  description: string;
  thumbnail: string;
  minimumBet: number;
  maxPlayers: number;
  currentPlayers: number;
  status: 'open' | 'ongoing' | 'completed';
  potAmount: number;
  winnerId?: string;
  startTime?: Timestamp;
  endTime?: Timestamp;
}

export interface BetResult {
  id?: string;
  gameId: string;
  winnerId: string;
  winnerName: string;
  potAmount: number;
  timestamp: Timestamp;
}

class BettingService {
  // Récupérer tous les jeux disponibles
  async getGames(): Promise<Game[]> {
    try {
      const gamesCollection = collection(db, 'games');
      const gamesSnapshot = await getDocs(gamesCollection);
      return gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  // Récupérer un jeu spécifique
  async getGame(gameId: string): Promise<Game | null> {
    try {
      const gameDoc = doc(db, 'games', gameId);
      const gameSnapshot = await getDoc(gameDoc);
      
      if (!gameSnapshot.exists()) {
        return null;
      }
      
      return { id: gameSnapshot.id, ...gameSnapshot.data() } as Game;
    } catch (error) {
      console.error(`Error fetching game with ID ${gameId}:`, error);
      throw error;
    }
  }

  // Créer un nouveau pari
  async placeBet(betData: Omit<Bet, 'id' | 'timestamp' | 'status'>): Promise<Bet> {
    try {
      // Vérifier si le jeu existe et est ouvert
      const game = await this.getGame(betData.gameId);
      if (!game) {
        throw new Error('Game not found');
      }
      
      if (game.status !== 'open') {
        throw new Error('Game is not open for betting');
      }
      
      if (betData.amount < game.minimumBet) {
        throw new Error(`Minimum bet amount is ${game.minimumBet}`);
      }
      
      // Créer le pari
      const newBet: Omit<Bet, 'id'> = {
        ...betData,
        timestamp: serverTimestamp() as Timestamp,
        status: 'pending'
      };
      
      const betRef = await addDoc(collection(db, 'bets'), newBet);
      
      // Mettre à jour le pot du jeu
      const gameRef = doc(db, 'games', betData.gameId);
      await updateDoc(gameRef, {
        potAmount: game.potAmount + betData.amount,
        currentPlayers: game.currentPlayers + 1
      });
      
      return { id: betRef.id, ...newBet };
    } catch (error) {
      console.error('Error placing bet:', error);
      throw error;
    }
  }

  // Récupérer les paris d'un utilisateur
  async getUserBets(userId: string): Promise<Bet[]> {
    try {
      const betsCollection = collection(db, 'bets');
      const q = query(betsCollection, where('userId', '==', userId));
      const betsSnapshot = await getDocs(q);
      
      return betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bet));
    } catch (error) {
      console.error(`Error fetching bets for user ${userId}:`, error);
      throw error;
    }
  }

  // Récupérer les paris pour un jeu spécifique
  async getGameBets(gameId: string): Promise<Bet[]> {
    try {
      const betsCollection = collection(db, 'bets');
      const q = query(betsCollection, where('gameId', '==', gameId));
      const betsSnapshot = await getDocs(q);
      
      return betsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bet));
    } catch (error) {
      console.error(`Error fetching bets for game ${gameId}:`, error);
      throw error;
    }
  }

  // Mettre à jour le statut d'un jeu (commencer ou terminer)
  async updateGameStatus(gameId: string, status: Game['status'], winnerId?: string): Promise<void> {
    try {
      const gameRef = doc(db, 'games', gameId);
      const updateData: Partial<DocumentData> = { status };
      
      if (status === 'ongoing') {
        updateData.startTime = serverTimestamp();
      } else if (status === 'completed' && winnerId) {
        updateData.endTime = serverTimestamp();
        updateData.winnerId = winnerId;
        
        // Mettre à jour les statuts des paris
        await this.updateBetsForGameEnd(gameId, winnerId);
      }
      
      await updateDoc(gameRef, updateData);
    } catch (error) {
      console.error(`Error updating game status for game ${gameId}:`, error);
      throw error;
    }
  }

  // Mettre à jour les paris lorsqu'un jeu se termine
  private async updateBetsForGameEnd(gameId: string, winnerId: string): Promise<void> {
    try {
      const bets = await this.getGameBets(gameId);
      
      for (const bet of bets) {
        if (!bet.id) continue;
        
        const betRef = doc(db, 'bets', bet.id);
        const status = bet.userId === winnerId ? 'won' : 'lost';
        await updateDoc(betRef, { status });
      }
      
      // Enregistrer le résultat du pari
      const game = await this.getGame(gameId);
      if (game) {
        const winnerBet = bets.find(b => b.userId === winnerId);
        
        if (winnerBet) {
          const betResult: Omit<BetResult, 'id'> = {
            gameId,
            winnerId,
            winnerName: winnerBet.userName,
            potAmount: game.potAmount,
            timestamp: serverTimestamp() as Timestamp
          };
          
          await addDoc(collection(db, 'betResults'), betResult);
        }
      }
    } catch (error) {
      console.error(`Error updating bets for game end ${gameId}:`, error);
      throw error;
    }
  }

  // Obtenir les résultats des paris récents
  async getRecentResults(limit: number = 10): Promise<BetResult[]> {
    try {
      const resultsCollection = collection(db, 'betResults');
      const resultsSnapshot = await getDocs(resultsCollection);
      
      const results = resultsSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data } as BetResult;
      });
      
      return results
        .sort((a, b) => {
          if (!a.timestamp || !b.timestamp) return 0;
          return b.timestamp.toMillis() - a.timestamp.toMillis();
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent results:', error);
      throw error;
    }
  }
}

export const bettingService = new BettingService();
export default bettingService; 