import { motion, AnimatePresence } from "framer-motion";

const GameStatus = ({ winner, isDraw, currentPlayer, gameMode }) => {
  let text;
  let colorClass;

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
    <div className={`text-center text-lg sm:text-xl font-semibold ${colorClass} min-h-[2.5rem] flex items-center justify-center`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="inline-block font-display tracking-wide"
          style={{
            textShadow: winner
              ? `0 0 30px currentColor`
              : 'none',
          }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default GameStatus;
