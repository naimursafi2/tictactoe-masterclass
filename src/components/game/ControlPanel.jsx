import { RotateCcw, RefreshCw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const ControlPanel = ({ onRestart, onNewMatch, onResetScores, gameOver }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
      <GameButton
        onClick={onRestart}
        icon={<RotateCcw className="w-4 h-4" />}
        label="Restart"
        variant="primary"
        pulse={gameOver}
      />
      <GameButton
        onClick={onNewMatch}
        icon={<RefreshCw className="w-4 h-4" />}
        label="New Match"
        variant="secondary"
      />
      <GameButton
        onClick={onResetScores}
        icon={<Trash2 className="w-4 h-4" />}
        label="Reset Scores"
        variant="ghost"
      />
    </div>
  );
};

function GameButton({ onClick, icon, label, variant, pulse }) {
  const variants = {
    primary: "bg-primary text-primary-foreground btn-3d",
    secondary: "glass border text-foreground btn-3d",
    ghost: "text-muted-foreground hover:text-foreground glass",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 1 }}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${variants[variant]} ${pulse ? "animate-pulse" : ""}`}
    >
      {icon} {label}
    </motion.button>
  );
}

export default ControlPanel;
