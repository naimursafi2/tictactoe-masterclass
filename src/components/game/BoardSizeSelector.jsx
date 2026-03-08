import { Grid3X3, LayoutGrid, Grid2x2Plus } from "lucide-react";
import { motion } from "framer-motion";

const sizes = [
  { value: 3, label: "3×3", icon: Grid3X3 },
  { value: 5, label: "5×5", icon: LayoutGrid },
  { value: 7, label: "7×7", icon: Grid2x2Plus },
];

const BoardSizeSelector = ({ boardSize, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        Board Size
      </span>
      <div className="flex rounded-2xl glass p-1 gap-1">
        {sizes.map((s) => {
          const Icon = s.icon;
          const active = boardSize === s.value;
          return (
            <motion.button
              key={s.value}
              onClick={() => onChange(s.value)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
              className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-bold font-display rounded-xl transition-all duration-300 ${
                active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={active ? {
                background: 'linear-gradient(135deg, hsl(265 90% 60%), hsl(280 85% 55%))',
                boxShadow: '0 0 25px hsl(265 90% 62% / 0.35), 0 4px 12px hsl(0 0% 0% / 0.25)',
              } : {}}
            >
              <Icon className="w-3.5 h-3.5" />
              {s.label}
              {active && (
                <motion.div
                  layoutId="boardSizeActive"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, hsl(265 90% 60%), hsl(280 85% 55%))',
                    zIndex: -1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BoardSizeSelector;
