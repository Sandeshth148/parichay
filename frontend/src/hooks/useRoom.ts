import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";
import { useAuthStore } from "../store/authStore";
import { subscribeToRoom } from "../services/roomService";

export function useRoom(roomCode: string | undefined) {
  const room = useGameStore((state) => state.room);
  const prevCardIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = subscribeToRoom(roomCode, (updatedRoom) => {
      // Atomically update room + cards
      useGameStore.getState().syncRoom(updatedRoom);

      // Auto-open / auto-close modal for the non-turn player
      const newCardId = updatedRoom.currentCardId ?? null;
      const currentUser = useAuthStore.getState().user;
      const isMyTurn = updatedRoom.currentTurn === currentUser?.uid;

      if (prevCardIdRef.current !== newCardId) {
        prevCardIdRef.current = newCardId;

        if (newCardId && !isMyTurn) {
          // Partner just opened a card — show it to me read-only
          const card = useGameStore
            .getState()
            .cards.find((c) => c.id === newCardId);
          if (card) useGameStore.getState().viewCard(card, true);
        } else if (!newCardId) {
          // Partner dismissed / committed — close my auto-opened modal
          useGameStore.getState().closeAuto();
        }
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  return room;
}
