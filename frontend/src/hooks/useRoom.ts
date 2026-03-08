import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { subscribeToRoom } from '../services/roomService';

export function useRoom(roomCode: string | undefined) {
  const room = useGameStore((state) => state.room);
  const setRoom = useGameStore((state) => state.setRoom);
  const setCards = useGameStore((state) => state.setCards);
  const getCardsForLevel = useGameStore((state) => state.getCardsForLevel);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = subscribeToRoom(roomCode, (updatedRoom) => {
      setRoom(updatedRoom);

      // Initialize cards for the current level if not already set
      const cards = getCardsForLevel(updatedRoom.level);
      if (cards.length > 0) {
        // Mark already-opened cards
        const openedSet = new Set(updatedRoom.openedCards);
        const updatedCards = cards.map((c) => ({
          ...c,
          opened: openedSet.has(c.id),
        }));
        setCards(updatedCards);
      }
    });

    return () => unsubscribe();
  }, [roomCode, setRoom, setCards, getCardsForLevel]);

  return room;
}
