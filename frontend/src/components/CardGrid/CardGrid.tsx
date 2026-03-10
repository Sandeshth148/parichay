import { useGameStore } from "../../store/gameStore";
import { useAuthStore } from "../../store/authStore";
import { setCurrentCard } from "../../services/roomService";
import { Card } from "../Card/Card";
import type { Card as CardType } from "../../types";

export function CardGrid() {
  const cards = useGameStore((state) => state.cards);
  const room = useGameStore((state) => state.room);
  const selectCard = useGameStore((state) => state.selectCard);
  const viewCard = useGameStore((state) => state.viewCard);
  const user = useAuthStore((state) => state.user);

  const isMyTurn = room?.currentTurn === user?.uid;

  const handleFlip = (card: CardType) => {
    selectCard(card); // active mode — shows Discussed/Skip
    if (room?.id) void setCurrentCard(room.id, card.id);
  };

  const handleReview = (card: CardType) => {
    viewCard(card); // read-only mode — shows only Close
  };

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full mx-auto">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          isMyTurn={isMyTurn}
          onFlip={handleFlip}
          onReview={handleReview}
        />
      ))}
    </div>
  );
}
