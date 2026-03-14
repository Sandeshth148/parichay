import { create } from "zustand";
import type { Room, Card } from "../types";
import { levels } from "../data/topics";
import { cardMeta } from "../data/cardMeta";

interface GameState {
  room: Room | null;
  cards: Card[];
  selectedCard: Card | null;
  isViewingOnly: boolean;
  isAutoOpened: boolean;
  setRoom: (room: Room) => void;
  setCards: (cards: Card[]) => void;
  /** Atomically syncs room + derived cards in one set() call — use this from Firestore callbacks */
  syncRoom: (room: Room) => void;
  selectCard: (card: Card | null) => void;
  viewCard: (card: Card, auto?: boolean) => void;
  closeAuto: () => void;
  openCard: (cardId: number, userId: string) => void;
  skipCard: (cardId: number, userId: string) => void;
  getCardsForLevel: (level: number) => Card[];
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  cards: [],
  selectedCard: null,
  isViewingOnly: false,
  isAutoOpened: false,

  setRoom: (room) => set({ room }),

  setCards: (cards) => set({ cards }),

  syncRoom: (room) => {
    const levelData = levels.find((l) => l.id === room.level);
    if (!levelData) {
      set({ room });
      return;
    }
    const openedSet = new Set(room.openedCards);
    const skippedSet = new Set(room.skippedCards || []);
    const levelMeta = cardMeta[room.level] ?? {};
    const cards = levelData.cards.map((c) => {
      const meta = levelMeta[c.id];
      return {
        ...c,
        opened: openedSet.has(c.id) || skippedSet.has(c.id),
        status: openedSet.has(c.id)
          ? ("discussed" as const)
          : skippedSet.has(c.id)
            ? ("skipped" as const)
            : ("unvisited" as const),
        isPillar: meta?.isPillar ?? false,
        depthPoints: meta?.depthPoints ?? 5,
      };
    });
    set({ room, cards });
  },

  selectCard: (card) =>
    set({ selectedCard: card, isViewingOnly: false, isAutoOpened: false }),

  viewCard: (card, auto) =>
    set({
      selectedCard: card,
      isViewingOnly: true,
      isAutoOpened: auto ?? false,
    }),

  closeAuto: () => {
    if (get().isAutoOpened) {
      set({ selectedCard: null, isViewingOnly: false, isAutoOpened: false });
    }
  },

  openCard: (cardId, userId) => {
    const cards = get().cards.map((c) =>
      c.id === cardId
        ? { ...c, opened: true, openedBy: userId, status: "discussed" as const }
        : c,
    );
    set({ cards, selectedCard: null, isViewingOnly: false });
  },

  skipCard: (cardId, userId) => {
    const cards = get().cards.map((c) =>
      c.id === cardId
        ? { ...c, opened: true, openedBy: userId, status: "skipped" as const }
        : c,
    );
    set({ cards, selectedCard: null, isViewingOnly: false });
  },

  getCardsForLevel: (level) => {
    const levelData = levels.find((l) => l.id === level);
    if (!levelData) return [];
    return levelData.cards.map((c) => ({ ...c, status: "unvisited" as const }));
  },

  reset: () =>
    set({
      room: null,
      cards: [],
      selectedCard: null,
      isViewingOnly: false,
      isAutoOpened: false,
    }),
}));
