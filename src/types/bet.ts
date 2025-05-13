import { Timestamp } from 'firebase/firestore';

export enum BetStatus {
  PENDING = 'pending',
  WON = 'won',
  LOST = 'lost',
  CANCELLED = 'cancelled'
}

export enum BetType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  SYSTEM = 'system'
}

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  amount: number;
  prediction: string;
  status: BetStatus;
  type: BetType;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Match {
  id: string;
  title: string;
  description: string;
  startTime: Timestamp;
  endTime: Timestamp;
  status: 'scheduled' | 'live' | 'finished';
  participants: string[];
  winner?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 