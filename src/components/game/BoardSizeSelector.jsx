import { Grid3X3 } from "lucide-react";
import { motion } from "framer-motion";

const sizes = [
  { value: 3, label: "3×3" },
  { value: 5, label: "5×5" },
  { value: 7, label: "7×7" },
];

const BoardSizeSelector = ({ boardSize, onChange }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Grid3X3 className="w-3.5 h-3.5" />
        <span className="text-[10px] font-medium uppercase tracking-widest">Board</span>
      </div>
      <div className="flex rounded-xl glass overflow-hidden p-1 gap-1">
        {sizes.map((s) => (
          <motion.button
            key={s.value}
            onClick={() => onChange(s.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-4 py-2 text-sm font-semibold font-display rounded-lg transition-all duration-300 ${
              boardSize === s.value
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={boardSize === s.value ? {
              boxShadow: '0 0 20px hsl(260 85% 65% / 0.3), 0 4px 10px hsl(0 0% 0% / 0.2)',
            } : {}}
          >
            {s.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BoardSizeSelector;
