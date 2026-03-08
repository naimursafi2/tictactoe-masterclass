import { Users, Bot, Zap, Brain, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ModeSelector = ({ gameMode, difficulty, onModeChange, onDifficultyChange }) => {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        Game Mode
      </span>
      <div className="flex rounded-2xl glass p-1 gap-1">
        <ModeButton
          active={gameMode === "pvp"}
          onClick={() => onModeChange("pvp")}
          icon={<Users className="w-4 h-4" />}
          label="PvP"
        />
        <ModeButton
          active={gameMode === "pvc"}
          onClick={() => onModeChange("pvc")}
          icon={<Bot className="w-4 h-4" />}
          label="vs AI"
        />
      </div>
      <AnimatePresence>
        {gameMode === "pvc" && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex rounded-2xl glass p-1 gap-1"
          >
            {[
              { key: "easy", label: "Easy", icon: <Zap className="w-3 h-3" /> },
              { key: "medium", label: "Med", icon: <Brain className="w-3 h-3" /> },
              { key: "hard", label: "Hard", icon: <Flame className="w-3 h-3" /> },
            ].map((d) => (
              <motion.button
                key={d.key}
                onClick={() => onDifficultyChange(d.key)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.93 }}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 ${
                  difficulty === d.key
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={difficulty === d.key ? {
                  background: 'linear-gradient(135deg, hsl(265 90% 60%), hsl(280 85% 55%))',
                  boxShadow: '0 0 15px hsl(265 90% 62% / 0.3), 0 3px 8px hsl(0 0% 0% / 0.2)',
                } : {}}
              >
                {d.icon} {d.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function ModeButton({ active, onClick, icon, label }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
        active
          ? "text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
      style={active ? {
        background: 'linear-gradient(135deg, hsl(265 90% 60%), hsl(280 85% 55%))',
        boxShadow: '0 0 25px hsl(265 90% 62% / 0.35), 0 4px 12px hsl(0 0% 0% / 0.25)',
      } : {}}
    >
      {icon} {label}
    </motion.button>
  );
}

export default ModeSelector;
