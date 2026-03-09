export interface Player {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  hostUserId: string;
  players: Player[];
  playerIds: string[];
  currentTurn: string;
  level: number;
  openedCards: number[];
  skippedCards: number[];
  levelProgress: Record<
    string,
    { openedCards: number[]; skippedCards: number[] }
  >;
  status: "waiting" | "active" | "completed";
  createdAt: number;
}

export interface Card {
  id: number;
  topic: string;
  prompts: string[];
  opened: boolean;
  openedBy: string | null;
  status?: "unvisited" | "discussed" | "skipped";
}

export interface Level {
  id: number;
  title: string;
  description: string;
  cards: Card[];
}

export interface AppUser {
  uid: string;
  name: string;
  email: string;
}
