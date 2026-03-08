import { History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GameHistory = ({ history }) => {
  if (history.length === 0) return null;

  const recent = history.slice(-5).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[400px] mx-auto glass rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 mb-3 text-muted-foreground">
        <History className="w-4 h-4" />
        <span className="text-[10px] font-medium uppercase tracking-widest">Recent Rounds</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {recent.map((r, i) => (
            <motion.span
              key={`${r.round}-${r.winner}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium glass ${
                r.winner === "X"
                  ? "text-player-x"
                  : r.winner === "O"
                  ? "text-player-o"
                  : "text-draw-color"
              }`}
              style={{
                boxShadow: r.winner === "X"
                  ? '0 0 10px hsl(260 85% 65% / 0.15)'
                  : r.winner === "O"
                  ? '0 0 10px hsl(340 85% 60% / 0.15)'
                  : '0 0 10px hsl(45 90% 55% / 0.1)',
              }}
            >
              R{r.round}: {r.winner === "draw" ? "Draw" : `${r.winner} won`}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GameHistory;
