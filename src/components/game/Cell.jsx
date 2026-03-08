import { motion } from "framer-motion";

const Cell = ({ value, index, isWinning, disabled, onClick, textSize = "text-4xl sm:text-5xl" }) => {
  const baseClasses =
    `relative flex items-center justify-center aspect-square rounded-xl font-display ${textSize} font-bold select-none cursor-pointer cell-3d`;

  const emptyClasses = disabled
    ? "cursor-not-allowed opacity-60"
    : "";

  const filledX = `text-player-x ${isWinning ? "glow-x win-cell border-player-x" : ""}`;
  const filledO = `text-player-o ${isWinning ? "glow-o win-cell border-player-o" : ""}`;
  const filledClasses = value === "X" ? filledX : filledO;

  return (
    <button
      className={`${baseClasses} ${value ? filledClasses : emptyClasses}`}
      onClick={() => onClick(index)}
      disabled={disabled || !!value}
      aria-label={`Cell ${index + 1}, ${value || "empty"}`}
    >
      {value && (
        <motion.span
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="drop-shadow-lg"
          style={{
            textShadow: value === "X"
              ? '0 0 20px hsl(260 85% 65% / 0.5)'
              : '0 0 20px hsl(340 85% 60% / 0.5)',
          }}
        >
          {value}
        </motion.span>
      )}
    </button>
  );
};

export default Cell;
