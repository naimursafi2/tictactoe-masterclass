import { History, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GameHistory = ({ history }) => {
  if (history.length === 0) return null;

  const recent = history.slice(-5).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-[420px] mx-auto glass-card rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 mb-3 text-muted-foreground">
        <History className="w-4 h-4" />
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em]">Recent Rounds</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {recent.map((r, i) => (
            <motion.div
              key={`${r.round}-${r.winner}`}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 20 }}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold glass ${
                r.winner === "X"
                  ? "text-player-x"
                  : r.winner === "O"
                  ? "text-player-o"
                  : "text-draw-color"
              }`}
              style={{
                boxShadow: r.winner === "X"
                  ? '0 0 12px hsl(265 90% 65% / 0.12)'
                  : r.winner === "O"
                  ? '0 0 12px hsl(340 90% 62% / 0.12)'
                  : '0 0 12px hsl(48 95% 55% / 0.08)',
              }}
            >
              <Zap className="w-3 h-3" />
              R{r.round}: {r.winner === "draw" ? "Draw" : `${r.winner} won`}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GameHistory;
