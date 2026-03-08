import { motion } from "framer-motion";
import type { Card as CardType } from "../../types";

interface CardProps {
  card: CardType;
  isMyTurn: boolean;
  onFlip: (card: CardType) => void;
  onReview: (card: CardType) => void;
}

export function Card({ card, isMyTurn, onFlip, onReview }: CardProps) {
  const handleClick = () => {
    if (card.opened) {
      onReview(card); // re-open in read-only mode
    } else if (isMyTurn) {
      onFlip(card);
    }
  };

  const isClickable = card.opened || isMyTurn;

  return (
    <motion.div
      className={`perspective-[1000px] ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
      whileHover={isClickable ? { scale: 1.05 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
    >
      <motion.div
        className="relative w-full aspect-square"
        onClick={handleClick}
        animate={{ rotateY: card.opened ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front (face-down) */}
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

        {/* Back (face-up) */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300 flex flex-col items-center justify-center p-2 text-center shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-xs sm:text-sm font-semibold text-amber-900 leading-tight">
            {card.topic}
          </span>
          <span className="text-[10px] text-amber-500 mt-1">tap to review</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
