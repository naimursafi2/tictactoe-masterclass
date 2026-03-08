import { motion, AnimatePresence } from "framer-motion";
import { Swords, Trophy, Handshake } from "lucide-react";

const GameStatus = ({ winner, isDraw, currentPlayer, gameMode }) => {
  let text;
  let colorClass;
  let icon;

  if (winner) {
    const name = gameMode === "pvc" ? (winner === "X" ? "You win" : "AI wins") : `Player ${winner} wins`;
    text = name + "!";
    colorClass = winner === "X" ? "text-player-x" : "text-player-o";
    icon = <Trophy className="w-5 h-5" />;
  } else if (isDraw) {
    text = "It's a draw!";
    colorClass = "text-draw-color";
    icon = <Handshake className="w-5 h-5" />;
  } else {
    const name = gameMode === "pvc" ? (currentPlayer === "X" ? "Your" : "AI's") : `Player ${currentPlayer}'s`;
    text = `${name} turn`;
    colorClass = currentPlayer === "X" ? "text-player-x" : "text-player-o";
    icon = <Swords className="w-5 h-5" />;
  }

  return (
    <div className={`text-center text-lg sm:text-xl font-bold ${colorClass} min-h-[2.5rem] flex items-center justify-center`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 12, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.85 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 font-display tracking-wide"
          style={{
            textShadow: winner || isDraw
              ? `0 0 25px currentColor`
              : '0 0 10px currentColor',
            filter: winner ? 'brightness(1.1)' : 'none',
          }}
        >
          <motion.span
            animate={winner ? { rotate: [0, -15, 15, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {icon}
          </motion.span>
          {text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GameStatus;
