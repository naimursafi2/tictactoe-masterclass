import { Trophy, Handshake, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WinModal = ({ show, winner, isDraw, gameMode, onClose, onRestart }) => {
  const winnerName = gameMode === "pvc"
    ? (winner === "X" ? "You" : "AI")
    : `Player ${winner}`;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.6, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-strong rounded-3xl p-7 sm:p-9 max-w-sm w-[90%] text-center relative z-10"
            style={{
              boxShadow: `
                0 30px 80px -15px hsl(0 0% 0% / 0.5),
                0 0 60px ${isDraw ? 'hsl(45 90% 55% / 0.15)' : winner === 'X' ? 'hsl(260 85% 65% / 0.2)' : 'hsl(340 85% 60% / 0.2)'},
                inset 0 1px 0 0 hsl(0 0% 100% / 0.08)
              `,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50"
            >
              <X className="w-5 h-5" />
            </button>

            {isDraw ? (
              <>
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                >
                  <Handshake className="w-20 h-20 mx-auto text-draw-color mb-4" style={{ filter: 'drop-shadow(0 0 20px hsl(45 90% 55% / 0.4))' }} />
                </motion.div>
                <h2 className="text-3xl font-display font-bold text-draw-color mb-2">It's a Draw!</h2>
                <p className="text-muted-foreground text-sm">Nobody wins this round. Try again!</p>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  className="relative inline-block"
                >
                  <Trophy
                    className="w-20 h-20 mx-auto mb-4"
                    style={{
                      color: winner === "X" ? 'hsl(260 85% 65%)' : 'hsl(340 85% 60%)',
                      filter: `drop-shadow(0 0 20px ${winner === "X" ? 'hsl(260 85% 65% / 0.5)' : 'hsl(340 85% 60% / 0.5)'})`,
                    }}
                  />
                  <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-draw-color animate-pulse" />
                </motion.div>
                <h2 className={`text-3xl font-display font-bold mb-2 ${winner === "X" ? "text-player-x" : "text-player-o"}`}>
                  {winnerName} Won!
                </h2>
                <p className="text-muted-foreground text-sm">Great game! Ready for another round?</p>
              </>
            )}

            <motion.button
              onClick={onRestart}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-base btn-3d tracking-wide"
              style={{
                boxShadow: '0 0 25px hsl(260 85% 65% / 0.3), 0 8px 20px hsl(0 0% 0% / 0.3)',
              }}
            >
              Play Again
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinModal;
