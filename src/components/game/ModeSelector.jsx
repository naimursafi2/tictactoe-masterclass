import { Users, Bot } from "lucide-react";

const ModeSelector = ({ gameMode, difficulty, onModeChange, onDifficultyChange }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex rounded-lg border border-border overflow-hidden">
        <ModeButton active={gameMode === "pvp"} onClick={() => onModeChange("pvp")} icon={<Users className="w-4 h-4" />} label="PvP" />
        <ModeButton active={gameMode === "pvc"} onClick={() => onModeChange("pvc")} icon={<Bot className="w-4 h-4" />} label="vs AI" />
      </div>
      {gameMode === "pvc" && (
        <div className="flex rounded-lg border border-border overflow-hidden slide-up">
          {["easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                difficulty === d
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function ModeButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {icon} {label}
    </button>
  );
}

export default ModeSelector;
