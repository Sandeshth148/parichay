import { create } from 'zustand';
import type { Room, Card } from '../types';
import { levels } from '../data/topics';

interface GameState {
  room: Room | null;
  cards: Card[];
  selectedCard: Card | null;
  isViewingOnly: boolean;
  setRoom: (room: Room) => void;
  setCards: (cards: Card[]) => void;
  selectCard: (card: Card | null) => void;
  viewCard: (card: Card) => void;
  openCard: (cardId: number, userId: string) => void;
  getCardsForLevel: (level: number) => Card[];
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  cards: [],
  selectedCard: null,
  isViewingOnly: false,

  setRoom: (room) => set({ room }),

  setCards: (cards) => set({ cards }),

  selectCard: (card) => set({ selectedCard: card, isViewingOnly: false }),

  viewCard: (card) => set({ selectedCard: card, isViewingOnly: true }),

  openCard: (cardId, userId) => {
    const cards = get().cards.map((c) =>
      c.id === cardId ? { ...c, opened: true, openedBy: userId } : c
    );
    set({ cards, selectedCard: null, isViewingOnly: false });
  },

  getCardsForLevel: (level) => {
    const levelData = levels.find((l) => l.id === level);
    if (!levelData) return [];
    return levelData.cards.map((c) => ({ ...c }));
  },

  reset: () => set({ room: null, cards: [], selectedCard: null, isViewingOnly: false }),
}));
