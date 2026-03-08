import { Player } from "@/hooks/useGameState";
import { Trophy, Handshake, X } from "lucide-react";

interface WinModalProps {
  show: boolean;
  winner: Player | null;
  isDraw: boolean;
  gameMode: string;
  onClose: () => void;
  onRestart: () => void;
}

const WinModal = ({ show, winner, isDraw, gameMode, onClose, onRestart }: WinModalProps) => {
  if (!show) return null;

  const winnerName = gameMode === "pvc"
    ? (winner === "X" ? "You" : "AI")
    : `Player ${winner}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="modal-in bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl max-w-sm w-[90%] text-center relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-5 h-5" />
        </button>

        {isDraw ? (
          <>
            <Handshake className="w-16 h-16 mx-auto text-draw-color mb-3" />
            <h2 className="text-2xl font-display font-bold text-draw-color mb-1">It's a Draw!</h2>
            <p className="text-muted-foreground text-sm">Nobody wins this round.</p>
          </>
        ) : (
          <>
            <Trophy className="w-16 h-16 mx-auto text-player-x mb-3" style={{ color: winner === "O" ? "hsl(var(--player-o))" : undefined }} />
            <h2 className={`text-2xl font-display font-bold mb-1 ${winner === "X" ? "text-player-x" : "text-player-o"}`}>
              {winnerName} Won!
            </h2>
            <p className="text-muted-foreground text-sm">Great game! Ready for another?</p>
          </>
        )}

        <button
          onClick={onRestart}
          className="mt-5 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all hover:scale-105 active:scale-95"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinModal;
