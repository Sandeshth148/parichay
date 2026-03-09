import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
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
    currentTurn: user.uid,
    level: 1,
    openedCards: [],
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
    status: "active",
  };
  await updateDoc(ref, {
    players: updated.players,
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
  currentTurn: string,
): Promise<void> {
  await updateDoc(doc(db!, "rooms", roomCode), { openedCards, currentTurn });
}

export async function advanceLevel(roomCode: string): Promise<void> {
  const snap = await getDoc(doc(db!, "rooms", roomCode));
  if (!snap.exists()) return;
  const room = snap.data() as Room;
  await updateDoc(doc(db!, "rooms", roomCode), {
    level: room.level + 1,
    openedCards: [],
    currentTurn: room.players[0].id,
  });
}

export async function goToLevel(roomCode: string, level: number): Promise<void> {
  const snap = await getDoc(doc(db!, "rooms", roomCode));
  if (!snap.exists()) return;
  const room = snap.data() as Room;
  await updateDoc(doc(db!, "rooms", roomCode), {
    level,
    openedCards: [],
    currentTurn: room.players[0].id,
  });
}

export async function completeRoom(roomCode: string): Promise<void> {
  await updateDoc(doc(db!, "rooms", roomCode), { status: "completed" });
}
