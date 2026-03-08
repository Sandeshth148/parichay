// LOCAL MOCK room service — uses localStorage instead of Firebase/backend
// Works fully offline for local development

import type { Room } from "../types";

const ROOMS_KEY = "cd_rooms";

function getRooms(): Record<string, Room> {
  try {
    return JSON.parse(localStorage.getItem(ROOMS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveRooms(rooms: Record<string, Room>) {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  // Trigger storage event so subscribeToRoom picks up changes in same tab
  window.dispatchEvent(new Event("cd_rooms_updated"));
}

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem("cd_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function createRoom(name: string): Promise<Room> {
  const user = getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const rooms = getRooms();
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

  rooms[id] = room;
  saveRooms(rooms);
  return room;
}

export async function joinRoom(roomCode: string, name: string): Promise<Room> {
  const user = getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const rooms = getRooms();
  const room = rooms[roomCode];

  if (!room) throw new Error("Room not found");

  // Already in room
  if (room.players.some((p) => p.id === user.uid)) return room;

  if (room.players.length >= 2) throw new Error("Room is full");

  const updated: Room = {
    ...room,
    players: [...room.players, { id: user.uid, name }],
    status: "active",
  };

  rooms[roomCode] = updated;
  saveRooms(rooms);
  return updated;
}

export async function getRoom(roomCode: string): Promise<Room | null> {
  const rooms = getRooms();
  return rooms[roomCode] || null;
}

export function subscribeToRoom(
  roomCode: string,
  callback: (room: Room) => void,
): () => void {
  // Initial call
  const rooms = getRooms();
  if (rooms[roomCode]) callback(rooms[roomCode]);

  // Listen for updates (works in same tab via custom event)
  const handler = () => {
    const updated = getRooms();
    if (updated[roomCode]) callback(updated[roomCode]);
  };

  window.addEventListener("cd_rooms_updated", handler);

  // Also poll every second to handle multi-tab scenarios
  const interval = setInterval(handler, 1000);

  return () => {
    window.removeEventListener("cd_rooms_updated", handler);
    clearInterval(interval);
  };
}

export async function updateRoomCards(
  roomCode: string,
  openedCards: number[],
  currentTurn: string,
): Promise<void> {
  const rooms = getRooms();
  if (!rooms[roomCode]) return;
  rooms[roomCode] = { ...rooms[roomCode], openedCards, currentTurn };
  saveRooms(rooms);
}

export async function advanceLevel(roomCode: string): Promise<void> {
  const rooms = getRooms();
  if (!rooms[roomCode]) return;
  const room = rooms[roomCode];
  rooms[roomCode] = {
    ...room,
    level: room.level + 1,
    openedCards: [],
    currentTurn: room.hostUserId,
  };
  saveRooms(rooms);
}

export async function completeRoom(roomCode: string): Promise<void> {
  const rooms = getRooms();
  if (!rooms[roomCode]) return;
  rooms[roomCode] = { ...rooms[roomCode], status: "completed" };
  saveRooms(rooms);
}
