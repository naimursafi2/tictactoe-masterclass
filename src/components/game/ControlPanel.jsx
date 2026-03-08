import { RotateCcw, RefreshCw, Trash2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ControlPanel = ({ onRestart, onNewMatch, onResetScores, gameOver }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <GameButton
        onClick={onRestart}
        icon={<RotateCcw className="w-4 h-4" />}
        label="Restart"
        variant="primary"
        highlight={gameOver}
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
        label="Reset"
        variant="ghost"
      />
    </div>
  );
};

function GameButton({ onClick, icon, label, variant, highlight }) {
  const variants = {
    primary: "bg-primary text-primary-foreground btn-3d",
    secondary: "glass text-foreground btn-3d",
    ghost: "text-muted-foreground hover:text-foreground glass",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.93, y: 1 }}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm ${variants[variant]} ${
        highlight ? "ring-2 ring-primary/50 ring-offset-1 ring-offset-transparent" : ""
      }`}
      style={variant === 'primary' ? {
        background: 'linear-gradient(135deg, hsl(265 90% 60%), hsl(280 85% 55%))',
        boxShadow: highlight
          ? '0 0 25px hsl(265 90% 62% / 0.4), 0 6px 16px hsl(0 0% 0% / 0.3)'
          : '0 4px 12px hsl(0 0% 0% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.15)',
      } : {}}
    >
      {highlight && variant === 'primary' && (
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      )}
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(' ')[0]}</span>
    </motion.button>
  );
}

export default ControlPanel;
