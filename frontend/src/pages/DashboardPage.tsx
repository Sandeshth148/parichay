import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { createRoom, joinRoom, getMyRooms } from "../services/roomService";
import { usePageTitle } from "../hooks/usePageTitle";
import type { Room } from "../types";
import { LogOut, Plus, ArrowRight, PlayCircle } from "lucide-react";
import { levels } from "../data/topics";

export function DashboardPage() {
  usePageTitle("Dashboard");
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myRooms, setMyRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (!user) return;
    getMyRooms(user.uid)
      .then(setMyRooms)
      .catch(() => setMyRooms([]));
  }, [user]);

  const handleCreateRoom = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const room = await createRoom(user.name);
      navigate(`/room/${room.id}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create room";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !roomCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      await joinRoom(roomCode.trim().toUpperCase(), user.name);
      navigate(`/room/${roomCode.trim().toUpperCase()}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to join room";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-6">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">
              Welcome, {user?.name}
            </h1>
            <p className="text-amber-700 text-sm mt-1">
              Start a new conversation or join an existing room
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Resume active rooms */}
        {myRooms.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-amber-700 mb-3 uppercase tracking-wide">
              Resume a Previous Session
            </h2>
            <div className="space-y-2">
              {myRooms.map((r) => {
                const partner = r.players.find((p) => p.id !== user?.uid);
                const levelTitle =
                  levels.find((l) => l.id === r.level)?.title ??
                  `Level ${r.level}`;
                const discussed = r.openedCards?.length ?? 0;
                const skipped = (r.skippedCards || []).length;
                const statusLabel =
                  r.status === "waiting"
                    ? "Waiting for partner"
                    : `L${r.level} · ${discussed} discussed${skipped > 0 ? `, ${skipped} skipped` : ""}`;
                return (
                  <button
                    key={r.id}
                    onClick={() => navigate(`/room/${r.id}`)}
                    className="w-full bg-white rounded-xl shadow-sm border border-amber-200 px-4 py-3 flex items-center gap-3 hover:border-amber-400 hover:shadow-md transition-all text-left"
                  >
                    <PlayCircle className="w-8 h-8 text-amber-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-amber-900 truncate">
                        {partner
                          ? `With ${partner.name}`
                          : "Waiting for partner"}
                      </p>
                      <p className="text-xs text-amber-500 truncate">
                        {levelTitle} · {statusLabel}
                      </p>
                    </div>
                    <code className="text-xs font-mono text-amber-400 shrink-0">
                      {r.id}
                    </code>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Create Room Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-amber-900 mb-2">
              Create Room
            </h2>
            <p className="text-amber-600 text-sm mb-6">
              Start a new session and invite your partner
            </p>
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create New Room"}
            </button>
          </div>

          {/* Join Room Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
              <ArrowRight className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-xl font-semibold text-amber-900 mb-2">
              Join Room
            </h2>
            <p className="text-amber-600 text-sm mb-6">
              Enter the room code shared by your partner
            </p>
            <form onSubmit={handleJoinRoom} className="w-full space-y-3">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter Room Code"
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 bg-amber-50 text-center font-mono text-lg tracking-widest uppercase"
                maxLength={8}
                required
              />
              <button
                type="submit"
                disabled={loading || !roomCode.trim()}
                className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join Room"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
