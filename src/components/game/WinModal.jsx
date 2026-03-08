import { Trophy, Handshake, X, Sparkles, PartyPopper, RotateCcw } from "lucide-react";
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
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop with radial glow */}
          <div
            className="absolute inset-0 backdrop-blur-xl"
            style={{
              background: isDraw
                ? 'radial-gradient(circle at center, hsl(48 95% 55% / 0.05), hsl(225 30% 6% / 0.8))'
                : winner === 'X'
                ? 'radial-gradient(circle at center, hsl(265 90% 65% / 0.08), hsl(225 30% 6% / 0.8))'
                : 'radial-gradient(circle at center, hsl(340 90% 62% / 0.08), hsl(225 30% 6% / 0.8))',
            }}
          />

          {/* Animated rings behind modal */}
          {!isDraw && (
            <>
              <motion.div
                className="absolute w-[300px] h-[300px] rounded-full border-2 ring-pulse"
                style={{
                  borderColor: winner === 'X' ? 'hsl(265 90% 65% / 0.2)' : 'hsl(340 90% 62% / 0.2)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.div
                className="absolute w-[400px] h-[400px] rounded-full border ring-pulse"
                style={{
                  borderColor: winner === 'X' ? 'hsl(265 90% 65% / 0.1)' : 'hsl(340 90% 62% / 0.1)',
                  animationDelay: '0.5s',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              />
            </>
          )}

          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.7, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="glass-strong rounded-3xl p-7 sm:p-9 max-w-sm w-[90%] text-center relative z-10"
            style={{
              boxShadow: `
                0 35px 100px -20px hsl(0 0% 0% / 0.6),
                0 0 80px ${isDraw ? 'hsl(48 95% 55% / 0.12)' : winner === 'X' ? 'hsl(265 90% 65% / 0.2)' : 'hsl(340 90% 62% / 0.2)'},
                inset 0 1px 0 0 hsl(0 0% 100% / 0.08)
              `,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg glass"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {isDraw ? (
              <>
                <motion.div
                  initial={{ rotate: -30, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 350, damping: 15 }}
                >
                  <Handshake
                    className="w-20 h-20 mx-auto text-draw-color mb-4"
                    style={{ filter: 'drop-shadow(0 0 25px hsl(48 95% 55% / 0.5))' }}
                  />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-3xl font-display font-black text-draw-color mb-2"
                  style={{ textShadow: '0 0 30px hsl(48 95% 55% / 0.3)' }}
                >
                  It's a Draw!
                </motion.h2>
                <p className="text-muted-foreground text-sm">No winner this round. Go again?</p>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ rotate: -30, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 350, damping: 15 }}
                  className="relative inline-block"
                >
                  <Trophy
                    className="w-20 h-20 mx-auto mb-4"
                    style={{
                      color: winner === "X" ? 'hsl(265 90% 68%)' : 'hsl(340 90% 65%)',
                      filter: `drop-shadow(0 0 25px ${winner === "X" ? 'hsl(265 90% 65% / 0.6)' : 'hsl(340 90% 62% / 0.6)'})`,
                    }}
                  />
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-7 h-7 text-draw-color" style={{ filter: 'drop-shadow(0 0 8px hsl(48 95% 55% / 0.6))' }} />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-1 -left-2"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  >
                    <PartyPopper className="w-6 h-6 text-accent" style={{ filter: 'drop-shadow(0 0 6px hsl(180 80% 48% / 0.5))' }} />
                  </motion.div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`text-3xl font-display font-black mb-2 ${winner === "X" ? "gradient-text-x" : "gradient-text-o"}`}
                  style={{
                    filter: `drop-shadow(0 0 15px ${winner === "X" ? 'hsl(265 90% 65% / 0.4)' : 'hsl(340 90% 62% / 0.4)'})`,
                  }}
                >
                  {winnerName} Won!
                </motion.h2>
                <p className="text-muted-foreground text-sm">Incredible game! Ready for the next one?</p>
              </>
            )}

            <div className="flex gap-2 mt-6">
              <motion.button
                onClick={onRestart}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.93 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-primary-foreground font-display font-bold text-base btn-3d tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, hsl(265 90% 60%), hsl(280 85% 55%))',
                  boxShadow: '0 0 30px hsl(265 90% 62% / 0.35), 0 8px 24px hsl(0 0% 0% / 0.35)',
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinModal;
