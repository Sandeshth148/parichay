import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";
import type { Room } from "../types";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createRoom(name: string): Promise<Room> {
  const user = auth!.currentUser;
  if (!user) throw new Error("Not authenticated");

  const id = generateRoomCode();
  const room: Room = {
    id,
    hostUserId: user.uid,
    players: [{ id: user.uid, name }],
    playerIds: [user.uid],
    currentTurn: user.uid,
    level: 1,
    openedCards: [],
    skippedCards: [],
    levelProgress: {},
    status: "waiting",
    createdAt: Date.now(),
  };

  await setDoc(doc(db!, "rooms", id), room);
  return room;
}

export async function joinRoom(roomCode: string, name: string): Promise<Room> {
  const user = auth!.currentUser;
  if (!user) throw new Error("Not authenticated");

  const ref = doc(db!, "rooms", roomCode);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Room not found");

  const room = snap.data() as Room;
  if (room.players.some((p) => p.id === user.uid)) return room;
  if (room.players.length >= 2) throw new Error("Room is full");

  const updated: Room = {
    ...room,
    players: [...room.players, { id: user.uid, name }],
    playerIds: [...(room.playerIds || [room.hostUserId]), user.uid],
    status: "active",
  };
  await updateDoc(ref, {
    players: updated.players,
    playerIds: updated.playerIds,
    status: "active",
  });
  return updated;
}

export async function getRoom(roomCode: string): Promise<Room | null> {
  const snap = await getDoc(doc(db!, "rooms", roomCode));
  return snap.exists() ? (snap.data() as Room) : null;
}

export function subscribeToRoom(
  roomCode: string,
  callback: (room: Room) => void,
): () => void {
  return onSnapshot(doc(db!, "rooms", roomCode), (snap) => {
    if (snap.exists()) callback(snap.data() as Room);
  });
}

export async function updateRoomCards(
  roomCode: string,
  openedCards: number[],
  skippedCards: number[],
  currentTurn: string,
): Promise<void> {
  await updateDoc(doc(db!, "rooms", roomCode), {
    openedCards,
    skippedCards,
    currentTurn,
  });
}

export async function advanceLevel(roomCode: string): Promise<void> {
  const snap = await getDoc(doc(db!, "rooms", roomCode));
  if (!snap.exists()) return;
  const room = snap.data() as Room;
  const levelKey = String(room.level);
  const savedProgress = room.levelProgress || {};

  // Save current level's progress
  savedProgress[levelKey] = {
    openedCards: room.openedCards,
    skippedCards: room.skippedCards || [],
  };

  const nextLevel = room.level + 1;
  const nextKey = String(nextLevel);
  const nextProgress = savedProgress[nextKey] || {
    openedCards: [],
    skippedCards: [],
  };

  await updateDoc(doc(db!, "rooms", roomCode), {
    level: nextLevel,
    openedCards: nextProgress.openedCards,
    skippedCards: nextProgress.skippedCards,
    levelProgress: savedProgress,
    currentTurn: room.players[0].id,
  });
}

export async function goToLevel(
  roomCode: string,
  level: number,
): Promise<void> {
  const snap = await getDoc(doc(db!, "rooms", roomCode));
  if (!snap.exists()) return;
  const room = snap.data() as Room;
  const currentKey = String(room.level);
  const savedProgress = room.levelProgress || {};

  // Save current level's progress before jumping
  savedProgress[currentKey] = {
    openedCards: room.openedCards,
    skippedCards: room.skippedCards || [],
  };

  const targetKey = String(level);
  const targetProgress = savedProgress[targetKey] || {
    openedCards: [],
    skippedCards: [],
  };

  await updateDoc(doc(db!, "rooms", roomCode), {
    level,
    openedCards: targetProgress.openedCards,
    skippedCards: targetProgress.skippedCards,
    levelProgress: savedProgress,
    currentTurn: room.players[0].id,
  });
}

export async function completeRoom(roomCode: string): Promise<void> {
  await updateDoc(doc(db!, "rooms", roomCode), { status: "completed" });
}

export async function getMyRooms(userId: string): Promise<Room[]> {
  const q = query(
    collection(db!, "rooms"),
    where("playerIds", "array-contains", userId),
  );
  const snap = await getDocs(q);
  const rooms = snap.docs.map((d) => d.data() as Room);
  return rooms
    .filter((r) => r.status !== "completed")
    .sort((a, b) => b.createdAt - a.createdAt);
}
