import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useAuthStore } from "../../store/authStore";
import { updateRoomCards } from "../../services/roomService";
import { X, MessageCircle, Eye, SkipForward } from "lucide-react";

export function DiscussionModal() {
  const selectedCard = useGameStore((state) => state.selectedCard);
  const isViewingOnly = useGameStore((state) => state.isViewingOnly);
  const room = useGameStore((state) => state.room);
  const openCard = useGameStore((state) => state.openCard);
  const skipCard = useGameStore((state) => state.skipCard);
  const selectCard = useGameStore((state) => state.selectCard);
  const user = useAuthStore((state) => state.user);

  if (!selectedCard || !room || !user) return null;

  const nextTurn = () => {
    const other = room.players.find((p) => p.id !== room.currentTurn);
    return other?.id || room.currentTurn;
  };

  const handleDone = async () => {
    openCard(selectedCard.id, user.uid);
    // move from skipped → discussed if it was skipped before
    const updatedOpened = [
      ...room.openedCards.filter((id) => id !== selectedCard.id),
      selectedCard.id,
    ];
    const updatedSkipped = (room.skippedCards || []).filter(
      (id) => id !== selectedCard.id,
    );
    await updateRoomCards(room.id, updatedOpened, updatedSkipped, nextTurn());
  };

  const handleSkip = async () => {
    skipCard(selectedCard.id, user.uid);
    // move from discussed → skipped if it was discussed before (edge case)
    const updatedSkipped = [
      ...(room.skippedCards || []).filter((id) => id !== selectedCard.id),
      selectedCard.id,
    ];
    const updatedOpened = room.openedCards.filter(
      (id) => id !== selectedCard.id,
    );
    await updateRoomCards(room.id, updatedOpened, updatedSkipped, nextTurn());
  };

  const handleClose = () => {
    selectCard(null);
  };

  const isRevisiting = selectedCard.status === "skipped";
  const isMyTurn = room?.currentTurn === user?.uid;
  const readOnly = isViewingOnly || !isMyTurn;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-amber-100">
            <div className="flex items-center gap-2">
              {readOnly ? (
                <Eye className="w-5 h-5 text-amber-500" />
              ) : isRevisiting ? (
                <SkipForward className="w-5 h-5 text-orange-500" />
              ) : (
                <MessageCircle className="w-5 h-5 text-amber-600" />
              )}
              <div>
                <h3 className="text-base font-bold text-amber-900 leading-tight">
                  {selectedCard.topic}
                </h3>
                {readOnly && selectedCard.status === "skipped" && (
                  <p className="text-xs text-orange-500">
                    {isMyTurn
                      ? "Revisit on your turn"
                      : "Skipped — viewing only"}
                  </p>
                )}
                {readOnly && selectedCard.status === "discussed" && (
                  <p className="text-xs text-amber-500">Already discussed</p>
                )}
                {!readOnly && isRevisiting && (
                  <p className="text-xs text-orange-500">
                    Revisiting skipped card
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-amber-400 hover:text-amber-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prompts — scrollable */}
          <div className="overflow-y-auto flex-1 p-5 space-y-3">
            {selectedCard.prompts.map((prompt, index) => (
              <div
                key={index}
                className="bg-amber-50 rounded-lg p-4 text-amber-800 text-sm leading-relaxed"
              >
                <span className="font-semibold text-amber-500 mr-2">
                  {index + 1}.
                </span>
                {prompt}
              </div>
            ))}
          </div>

          {/* Footer buttons */}
          <div className="p-5 border-t border-amber-100">
            {readOnly ? (
              <button
                onClick={handleClose}
                className="w-full bg-amber-100 text-amber-800 py-3 rounded-lg font-semibold hover:bg-amber-200 transition-colors"
              >
                Close
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 border border-orange-300 text-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors min-h-[44px]"
                >
                  Skip ↩
                </button>
                <button
                  onClick={handleDone}
                  className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors min-h-[44px]"
                >
                  Discussed ✓
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
