import { User } from "lucide-react";
import type { Player } from "../../types";

interface PlayerPanelProps {
  players: Player[];
  currentTurn: string;
}

export function PlayerPanel({ players, currentTurn }: PlayerPanelProps) {
  return (
    <div className="flex items-center gap-2">
      {players.map((player) => (
        <div
          key={player.id}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs sm:text-sm transition-all ${
            player.id === currentTurn
              ? "bg-green-100 text-green-800 ring-2 ring-green-400"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="font-medium max-w-[80px] truncate">
            {player.name}
          </span>
          {player.id === currentTurn && (
            <span className="hidden sm:inline text-green-600 text-xs">●</span>
          )}
        </div>
      ))}
    </div>
  );
}
