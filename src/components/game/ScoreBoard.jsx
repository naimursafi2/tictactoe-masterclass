const ScoreBoard = ({ scores, gameMode }) => {
  return (
    <div className="flex items-center gap-3 sm:gap-6 justify-center">
      <ScoreCard label={gameMode === "pvc" ? "You (X)" : "Player X"} score={scores.X} variant="x" />
      <ScoreCard label="Draw" score={scores.draw} variant="draw" />
      <ScoreCard label={gameMode === "pvc" ? "AI (O)" : "Player O"} score={scores.O} variant="o" />
    </div>
  );
};

function ScoreCard({ label, score, variant }) {
  const colorClasses = {
    x: "text-player-x border-player-x/20",
    o: "text-player-o border-player-o/20",
    draw: "text-draw-color border-draw-color/20",
  };

  return (
    <div className={`flex flex-col items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg border bg-surface-elevated ${colorClasses[variant]}`}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-2xl sm:text-3xl font-display font-bold">{score}</span>
    </div>
  );
}

export default ScoreBoard;
