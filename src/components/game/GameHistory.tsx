import { GameResult } from "@/hooks/useGameState";
import { History } from "lucide-react";

interface GameHistoryProps {
  history: GameResult[];
}

const GameHistory = ({ history }: GameHistoryProps) => {
  if (history.length === 0) return null;

  const recent = history.slice(-5).reverse();

  return (
    <div className="w-full max-w-[360px] mx-auto">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <History className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Recent Rounds</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {recent.map((r, i) => (
          <span
            key={i}
            className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
              r.winner === "X"
                ? "text-player-x border-player-x/20 bg-player-x/5"
                : r.winner === "O"
                ? "text-player-o border-player-o/20 bg-player-o/5"
                : "text-draw-color border-draw-color/20 bg-draw-color/5"
            }`}
          >
            R{r.round}: {r.winner === "draw" ? "Draw" : `${r.winner} won`}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GameHistory;
