import { motion } from "framer-motion";

const XMark = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="drop-shadow-lg">
    <motion.line
      x1="8" y1="8" x2="32" y2="32"
      stroke="url(#xGrad)" strokeWidth="5" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    />
    <motion.line
      x1="32" y1="8" x2="8" y2="32"
      stroke="url(#xGrad)" strokeWidth="5" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
    />
    <defs>
      <linearGradient id="xGrad" x1="0" y1="0" x2="40" y2="40">
        <stop offset="0%" stopColor="hsl(265 90% 72%)" />
        <stop offset="100%" stopColor="hsl(280 85% 62%)" />
      </linearGradient>
    </defs>
  </svg>
);

const OMark = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="drop-shadow-lg">
    <motion.circle
      cx="20" cy="20" r="13"
      stroke="url(#oGrad)" strokeWidth="5" strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
    <defs>
      <linearGradient id="oGrad" x1="0" y1="0" x2="40" y2="40">
        <stop offset="0%" stopColor="hsl(340 90% 68%)" />
        <stop offset="100%" stopColor="hsl(355 85% 58%)" />
      </linearGradient>
    </defs>
  </svg>
);

const svgSizes = { 3: 44, 5: 28, 7: 20 };

const Cell = ({ value, index, isWinning, disabled, onClick, boardSize = 3 }) => {
  const svgSize = svgSizes[boardSize] || 44;

  const baseClasses =
    "relative flex items-center justify-center aspect-square rounded-xl font-display font-bold select-none cursor-pointer cell-3d";

  const emptyClasses = disabled
    ? "cursor-not-allowed opacity-50"
    : "";

  const winX = isWinning ? "glow-x win-cell" : "";
  const winO = isWinning ? "glow-o win-cell" : "";
  const filledClasses = value === "X" ? winX : winO;

  return (
    <motion.button
      className={`${baseClasses} ${value ? filledClasses : emptyClasses}`}
      onClick={() => onClick(index)}
      disabled={disabled || !!value}
      aria-label={`Cell ${index + 1}, ${value || "empty"}`}
      whileTap={!disabled && !value ? { scale: 0.9 } : {}}
      layout
    >
      {value && (
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          style={{
            filter: value === "X"
              ? 'drop-shadow(0 0 12px hsl(265 90% 65% / 0.6))'
              : 'drop-shadow(0 0 12px hsl(340 90% 62% / 0.6))',
          }}
        >
          {value === "X" ? <XMark size={svgSize} /> : <OMark size={svgSize} />}
        </motion.div>
      )}

      {/* Hover ripple for empty cells */}
      {!value && !disabled && (
        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at center, hsl(265 90% 62% / 0.08), transparent 70%)',
          }}
        />
      )}
    </motion.button>
  );
};

export default Cell;
