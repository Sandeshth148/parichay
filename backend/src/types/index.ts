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
