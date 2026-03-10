import { motion } from "framer-motion";
import type { Card as CardType } from "../../types";

interface CardProps {
  card: CardType;
  isMyTurn: boolean;
  onFlip: (card: CardType) => void;
  onReview: (card: CardType) => void;
}

export function Card({ card, isMyTurn, onFlip, onReview }: CardProps) {
  const status = card.status ?? "unvisited";

  const handleClick = () => {
    if (status === "discussed") {
      onReview(card); // always view-only for discussed cards
    } else if (status === "skipped") {
      if (isMyTurn) {
        onFlip(card); // active mode — can choose to discuss or re-skip
      } else {
        onReview(card); // view-only for non-current player
      }
    } else if (isMyTurn) {
      onFlip(card); // active mode for unvisited cards
    }
  };

  const isClickable = status !== "unvisited" || isMyTurn;

  const backStyle =
    status === "skipped"
      ? "bg-orange-50 border-2 border-dashed border-orange-400"
      : "bg-gradient-to-br from-green-50 to-amber-50 border-2 border-green-400";

  const subLabel =
    status === "skipped" ? (
      <span className="text-[8px] sm:text-[10px] text-orange-500 mt-0.5 font-medium">
        ↩ revisit
      </span>
    ) : (
      <span className="text-[8px] sm:text-[10px] text-green-600 mt-0.5 font-medium">
        ✓ reviewed
      </span>
    );

  return (
    <motion.div
      className={`perspective-[1000px] ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
      whileHover={isClickable ? { scale: 1.05 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full aspect-square"
        animate={{ rotateY: card.opened ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front (face-down / unvisited) */}
        <div
          className={`absolute inset-0 rounded-xl flex items-center justify-center text-3xl font-bold ${
            isMyTurn && !card.opened
              ? "bg-amber-800 text-amber-200 hover:bg-amber-700 shadow-lg"
              : "bg-amber-900/70 text-amber-400"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          ?
        </div>

        {/* Back (face-up / discussed or skipped) */}
        <div
          className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-1.5 text-center shadow-lg overflow-hidden ${backStyle}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-[9px] sm:text-[11px] font-semibold text-amber-900 leading-snug line-clamp-3 break-words w-full">
            {card.topic}
          </span>
          {subLabel}
        </div>
      </motion.div>
    </motion.div>
  );
}
