import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { subscribeToRoom } from "../services/roomService";

export function useRoom(roomCode: string | undefined) {
  const room = useGameStore((state) => state.room);
  const syncRoom = useGameStore((state) => state.syncRoom);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = subscribeToRoom(roomCode, (updatedRoom) => {
      syncRoom(updatedRoom);
    });

    return () => unsubscribe();
  }, [roomCode, syncRoom]);

  return room;
}
