import { useParams, useNavigate } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { useAuthStore } from "../store/authStore";
import { useGameStore } from "../store/gameStore";
import { CardGrid } from "../components/CardGrid/CardGrid";
import { PlayerPanel } from "../components/PlayerPanel/PlayerPanel";
import { DiscussionModal } from "../components/DiscussionModal/DiscussionModal";
import { advanceLevel, completeRoom } from "../services/roomService";
import { levels } from "../data/topics";
import { Copy, Check, LogOut, ChevronRight, Trophy } from "lucide-react";
import { useState } from "react";

const MAX_LEVEL = levels.length;

export function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const room = useRoom(roomId);
  const user = useAuthStore((state) => state.user);
  const selectedCard = useGameStore((state) => state.selectedCard);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const copyRoomCode = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-amber-700 text-lg">Loading room...</div>
      </div>
    );
  }

  if (room.status === "waiting") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-3">
            Waiting for Partner
          </h2>
          <p className="text-amber-700 mb-6 text-sm">
            Share this room code with your partner
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <code className="text-2xl sm:text-3xl font-bold tracking-widest text-amber-800 bg-amber-100 px-4 sm:px-6 py-3 rounded-lg">
              {roomId}
            </code>
            <button
              onClick={copyRoomCode}
              className="p-2 text-amber-600 hover:text-amber-800 transition-colors"
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </button>
          </div>
          <div className="animate-pulse text-amber-500 text-sm">
            Waiting for your partner to join...
          </div>
        </div>
      </div>
    );
  }

  if (room.status === "completed") {
    navigate("/summary");
    return null;
  }

  const isMyTurn = room.currentTurn === user?.uid;
  const activePlayerName = room.players.find(
    (p) => p.id === room.currentTurn,
  )?.name;

  const levelDone = room.openedCards.length >= 16;
  const isLastLevel = room.level >= MAX_LEVEL;
  const currentLevel = levels.find((l) => l.id === room.level);
  const nextLevel = levels.find((l) => l.id === room.level + 1);

  const handleAdvanceLevel = async () => {
    if (!roomId) return;
    setAdvancing(true);
    await advanceLevel(roomId);
    setAdvancing(false);
  };

  const handleFinishGame = async () => {
    if (!roomId) return;
    await completeRoom(roomId);
    navigate("/summary");
  };

  // Level complete screen
  if (levelDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-8 h-8 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            {currentLevel?.title} Complete!
          </h2>
          <p className="text-amber-600 text-sm mb-6">
            You discussed all 16 topics in this level. Well done, both of you.
          </p>

          {!isLastLevel && nextLevel ? (
            <>
              <div className="bg-amber-50 rounded-xl p-5 mb-6 text-left">
                <h3 className="text-sm font-bold text-amber-900 mb-1">
                  Up next: {nextLevel.title}
                </h3>
                <p className="text-amber-600 text-sm leading-relaxed">
                  {nextLevel.description}
                </p>
              </div>
              <button
                onClick={handleAdvanceLevel}
                disabled={advancing}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Continue to {nextLevel.title}
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <p className="text-amber-700 text-sm mb-6">
                You have completed all {MAX_LEVEL} levels. This was a meaningful journey.
              </p>
              <button
                onClick={handleFinishGame}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                View Summary
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-amber-900 truncate">
              {room.players.map((p) => p.name).join(" & ")}
            </h1>
            <p className="text-amber-500 text-xs">Room: {roomId}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <PlayerPanel
              players={room.players}
              currentTurn={room.currentTurn}
            />
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 text-amber-400 hover:text-amber-700 transition-colors"
              title="Leave room"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-5xl mx-auto">
        {/* Level header */}
        <div className="text-center mb-3">
          <h2 className="text-sm font-semibold text-amber-700">
            {currentLevel?.title}
          </h2>
          <p className="text-xs text-amber-400 mt-0.5">
            {currentLevel?.description}
          </p>
        </div>

        {/* Turn indicator */}
        <div className="text-center mb-4">
          <div
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              isMyTurn
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {isMyTurn
              ? "Your turn — tap a card!"
              : `${activePlayerName}'s turn...`}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-amber-500 mb-1.5 px-1">
            <span>{room.openedCards.length} / 16 discussed</span>
            <span>Level {room.level} of {MAX_LEVEL}</span>
          </div>
          <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(room.openedCards.length / 16) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Grid */}
        <CardGrid />

        {/* Hint */}
        <p className="text-center text-xs text-amber-400 mt-4">
          Tap any opened card to read its questions again
        </p>
      </div>

      {/* Discussion Modal */}
      {selectedCard && <DiscussionModal />}
    </div>
  );
}
