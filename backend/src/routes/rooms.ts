import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import { adminDb } from "../services/firebaseAdmin";
import { Room } from "../types";

const router = Router();

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new room
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const uid = req.uid!;
    const roomCode = generateRoomCode();

    const room: Omit<Room, "id"> = {
      hostUserId: uid,
      players: [{ id: uid, name: name || "Player 1" }],
      currentTurn: uid,
      level: 1,
      openedCards: [],
      status: "waiting",
      createdAt: Date.now(),
    };

    await adminDb.collection("rooms").doc(roomCode).set(room);

    res.status(201).json({ id: roomCode, ...room });
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// Join an existing room
router.post(
  "/:id/join",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const { name } = req.body;
      const uid = req.uid!;

      const roomRef = adminDb.collection("rooms").doc(id);
      const roomDoc = await roomRef.get();

      if (!roomDoc.exists) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      const room = roomDoc.data() as Omit<Room, "id">;

      if (room.players.length >= 2) {
        // Check if the user is already in the room
        if (room.players.some((p) => p.id === uid)) {
          res.json({ id, ...room });
          return;
        }
        res.status(400).json({ error: "Room is full" });
        return;
      }

      const updatedPlayers = [
        ...room.players,
        { id: uid, name: name || "Player 2" },
      ];

      await roomRef.update({
        players: updatedPlayers,
        status: "active",
      });

      res.json({
        id,
        ...room,
        players: updatedPlayers,
        status: "active",
      });
    } catch (err) {
      console.error("Error joining room:", err);
      res.status(500).json({ error: "Failed to join room" });
    }
  },
);

// Get room details
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const roomDoc = await adminDb.collection("rooms").doc(id).get();

    if (!roomDoc.exists) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    res.json({ id, ...roomDoc.data() });
  } catch (err) {
    console.error("Error getting room:", err);
    res.status(500).json({ error: "Failed to get room" });
  }
});

export default router;
