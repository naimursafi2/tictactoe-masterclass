import { RotateCcw, RefreshCw, Trash2 } from "lucide-react";

const ControlPanel = ({ onRestart, onNewMatch, onResetScores, gameOver }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <GameButton onClick={onRestart} icon={<RotateCcw className="w-4 h-4" />} label="Restart" variant="primary" pulse={gameOver} />
      <GameButton onClick={onNewMatch} icon={<RefreshCw className="w-4 h-4" />} label="New Match" variant="secondary" />
      <GameButton onClick={onResetScores} icon={<Trash2 className="w-4 h-4" />} label="Reset Scores" variant="ghost" />
    </div>
  );
};

function GameButton({ onClick, icon, label, variant, pulse }) {
  const base = "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-md",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${pulse ? "animate-pulse" : ""}`}>
      {icon} {label}
    </button>
  );
}

export default ControlPanel;
