import { Player } from "@/hooks/useGameState";

interface GameStatusProps {
  winner: Player | null;
  isDraw: boolean;
  currentPlayer: Player;
  gameMode: string;
}

const GameStatus = ({ winner, isDraw, currentPlayer, gameMode }: GameStatusProps) => {
  let text: string;
  let colorClass: string;

  if (winner) {
    const name = gameMode === "pvc" ? (winner === "X" ? "You win" : "AI wins") : `Player ${winner} wins`;
    text = `🎉 ${name}!`;
    colorClass = winner === "X" ? "text-player-x" : "text-player-o";
  } else if (isDraw) {
    text = "🤝 It's a draw!";
    colorClass = "text-draw-color";
  } else {
    const name = gameMode === "pvc" ? (currentPlayer === "X" ? "Your" : "AI's") : `Player ${currentPlayer}'s`;
    text = `${name} turn`;
    colorClass = currentPlayer === "X" ? "text-player-x" : "text-player-o";
  }

  return (
    <div className={`text-center text-lg sm:text-xl font-semibold ${colorClass} transition-all duration-300 min-h-[2rem]`}>
      <span key={text} className="pop-in inline-block">{text}</span>
    </div>
  );
};

export default GameStatus;
