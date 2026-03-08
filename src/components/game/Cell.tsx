import { CellValue } from "@/hooks/useGameState";

interface CellProps {
  value: CellValue;
  index: number;
  isWinning: boolean;
  disabled: boolean;
  onClick: (index: number) => void;
  textSize?: string;
}

const Cell = ({ value, index, isWinning, disabled, onClick, textSize = "text-4xl sm:text-5xl" }: CellProps) => {
  const baseClasses =
    `relative flex items-center justify-center aspect-square rounded-lg font-display ${textSize} font-bold transition-all duration-200 select-none cursor-pointer border-2`;

  const emptyClasses = disabled
    ? "border-border bg-surface cursor-not-allowed"
    : "border-border bg-surface cell-hover hover:border-primary/40";

  const filledClasses = value === "X"
    ? `border-player-x/30 bg-surface text-player-x ${isWinning ? "glow-x win-cell border-player-x" : ""}`
    : `border-player-o/30 bg-surface text-player-o ${isWinning ? "glow-o win-cell border-player-o" : ""}`;

  return (
    <button
      className={`${baseClasses} ${value ? filledClasses : emptyClasses}`}
      onClick={() => onClick(index)}
      disabled={disabled || !!value}
      aria-label={`Cell ${index + 1}, ${value || "empty"}`}
    >
      {value && <span className="pop-in">{value}</span>}
    </button>
  );
};

export default Cell;
