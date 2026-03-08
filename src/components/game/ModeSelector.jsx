import { Users, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ModeSelector = ({ gameMode, difficulty, onModeChange, onDifficultyChange }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex rounded-xl glass overflow-hidden p-1 gap-1">
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
            className="flex rounded-xl glass overflow-hidden p-1 gap-1"
          >
            {["easy", "medium", "hard"].map((d) => (
              <motion.button
                key={d}
                onClick={() => onDifficultyChange(d)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 text-xs font-medium capitalize rounded-lg transition-all duration-300 ${
                  difficulty === d
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
        active
          ? "bg-primary text-primary-foreground shadow-lg"
          : "text-muted-foreground hover:text-foreground"
      }`}
      style={active ? {
        boxShadow: '0 0 20px hsl(260 85% 65% / 0.3), 0 4px 10px hsl(0 0% 0% / 0.2)',
      } : {}}
    >
      {icon} {label}
    </motion.button>
  );
}

export default ModeSelector;
