export interface Player {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  hostUserId: string;
  players: Player[];
  currentTurn: string;
  level: number;
  openedCards: number[];
  status: 'waiting' | 'active' | 'completed';
  createdAt: number;
}

export interface Card {
  id: number;
  topic: string;
  prompts: string[];
  opened: boolean;
  openedBy: string | null;
}

export interface Level {
  id: number;
  title: string;
  cards: Card[];
}

export interface AppUser {
  uid: string;
  name: string;
  email: string;
}
