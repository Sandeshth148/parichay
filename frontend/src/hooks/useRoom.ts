import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { subscribeToRoom } from "../services/roomService";

export function useRoom(roomCode: string | undefined) {
  const room = useGameStore((state) => state.room);
  const setRoom = useGameStore((state) => state.setRoom);
  const setCards = useGameStore((state) => state.setCards);
  const getCardsForLevel = useGameStore((state) => state.getCardsForLevel);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = subscribeToRoom(roomCode, (updatedRoom) => {
      setRoom(updatedRoom);

      const cards = getCardsForLevel(updatedRoom.level);
      if (cards.length > 0) {
        const openedSet = new Set(updatedRoom.openedCards);
        const skippedSet = new Set(updatedRoom.skippedCards || []);
        const updatedCards = cards.map((c) => ({
          ...c,
          opened: openedSet.has(c.id) || skippedSet.has(c.id),
          status: openedSet.has(c.id)
            ? ("discussed" as const)
            : skippedSet.has(c.id)
              ? ("skipped" as const)
              : ("unvisited" as const),
        }));
        setCards(updatedCards);
      }
    });

    return () => unsubscribe();
  }, [roomCode, setRoom, setCards, getCardsForLevel]);

  return room;
}
