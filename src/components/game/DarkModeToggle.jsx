import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DarkModeToggle = ({ darkMode, onChange }) => {
  return (
    <motion.button
      onClick={() => onChange(!darkMode)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      className="p-2.5 rounded-xl glass text-muted-foreground hover:text-foreground transition-colors btn-3d"
      aria-label="Toggle dark mode"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={darkMode ? "sun" : "moon"}
          initial={{ rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {darkMode ? (
            <Sun className="w-4.5 h-4.5" style={{ filter: 'drop-shadow(0 0 6px hsl(48 95% 55% / 0.5))' }} />
          ) : (
            <Moon className="w-4.5 h-4.5" style={{ filter: 'drop-shadow(0 0 6px hsl(265 90% 62% / 0.4))' }} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default DarkModeToggle;
