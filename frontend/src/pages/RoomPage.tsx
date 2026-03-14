import { useParams, useNavigate } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { useAuthStore } from "../store/authStore";
import { useGameStore } from "../store/gameStore";
import { CardGrid } from "../components/CardGrid/CardGrid";
import { PlayerPanel } from "../components/PlayerPanel/PlayerPanel";
import { DiscussionModal } from "../components/DiscussionModal/DiscussionModal";
import { advanceLevel, completeRoom, goToLevel } from "../services/roomService";
import { levels } from "../data/topics";
import { usePageTitle } from "../hooks/usePageTitle";
import { Copy, Check, LogOut, ChevronRight, Trophy } from "lucide-react";
import { useState } from "react";

const MAX_LEVEL = levels.length;

export function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const room = useRoom(roomId);
  const user = useAuthStore((state) => state.user);
  const selectedCard = useGameStore((state) => state.selectedCard);
  const cards = useGameStore((state) => state.cards);
  usePageTitle(room ? `Room ${roomId}` : "Room");
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

  const discussedCount = room.openedCards.length;
  const skippedCount = (room.skippedCards || []).length;
  const levelDone = discussedCount + skippedCount >= cards.length;
  const totalPoints = cards.reduce((sum, c) => sum + (c.depthPoints ?? 5), 0);
  const earnedPoints = cards
    .filter((c) => c.status === "discussed")
    .reduce((sum, c) => sum + (c.depthPoints ?? 5), 0);
  const isLastLevel = room.level >= MAX_LEVEL;
  const currentLevel = levels.find((l) => l.id === room.level);
  const nextLevel = levels.find((l) => l.id === room.level + 1);

  const handleAdvanceLevel = async () => {
    if (!roomId) return;
    setAdvancing(true);
    await advanceLevel(roomId);
    // subscription handles setRoom + setCards with restored progress
    setAdvancing(false);
  };

  const handleFinishGame = async () => {
    if (!roomId) return;
    await completeRoom(roomId);
    navigate("/summary");
  };

  const handleGoToLevel = async (level: number) => {
    if (!roomId) return;
    setAdvancing(true);
    await goToLevel(roomId, level);
    // subscription handles setRoom + setCards with restored progress
    setAdvancing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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

      {/* Level quick-nav */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs text-amber-500 font-medium shrink-0">
            Jump to:
          </span>
          {levels.map((l) => {
            const isCurrentLevel = room.level === l.id;
            const isCompleted = l.id < room.level;
            const isLocked = l.id > room.level;
            return (
              <button
                key={l.id}
                onClick={() => !isLocked && handleGoToLevel(l.id)}
                disabled={isLocked || advancing}
                title={
                  isLocked ? "Complete the current level first" : undefined
                }
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                  isCurrentLevel
                    ? "bg-amber-600 text-white"
                    : isCompleted
                      ? "bg-green-200 text-green-800 hover:bg-green-300 cursor-pointer"
                      : "bg-amber-100 text-amber-300 cursor-not-allowed"
                }`}
              >
                {isCompleted ? "✓ " : ""}L{l.id}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-4 max-w-6xl mx-auto">
        {/* Level header */}
        <div className="text-center mb-3">
          <h2 className="text-sm font-semibold text-amber-700">
            {currentLevel?.title}
          </h2>
          <p className="text-xs text-amber-400 mt-0.5">
            {currentLevel?.description}
          </p>
        </div>

        {/* Level complete banner OR turn indicator */}
        {levelDone ? (
          <div className="mb-4 bg-white rounded-2xl shadow-md border border-green-200 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="font-bold text-amber-900 text-sm">
                {currentLevel?.title} Complete!
              </span>
            </div>
            {!isLastLevel && nextLevel ? (
              <>
                <p className="text-xs text-amber-600 mb-3">
                  Up next:{" "}
                  <span className="font-semibold">{nextLevel.title}</span> —{" "}
                  {nextLevel.description}
                </p>
                <button
                  onClick={handleAdvanceLevel}
                  disabled={advancing}
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors flex items-center gap-1 mx-auto disabled:opacity-50"
                >
                  Continue to {nextLevel.title}{" "}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-amber-600 mb-3">
                  You've completed all {MAX_LEVEL} levels — what a journey!
                </p>
                <button
                  onClick={handleFinishGame}
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors mx-auto"
                >
                  View Summary
                </button>
              </>
            )}
          </div>
        ) : (
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
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-amber-500 mb-1.5 px-1">
            <span>
              ⭐ {earnedPoints} / {totalPoints} pts
              <span className="text-amber-400 ml-1">
                ({discussedCount} discussed
                {skippedCount > 0 && (
                  <span className="text-orange-400">
                    , {skippedCount} skipped
                  </span>
                )}
                )
              </span>
            </span>
            <span>
              Level {room.level} of {MAX_LEVEL}
            </span>
          </div>
          <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{
                width: `${totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0}%`,
              }}
            />
            <div
              className="h-full bg-orange-400 transition-all duration-500"
              style={{
                width: `${cards.length > 0 ? (skippedCount / cards.length) * 100 : 0}%`,
              }}
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
