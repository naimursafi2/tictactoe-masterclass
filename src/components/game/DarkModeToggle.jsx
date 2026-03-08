import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const DarkModeToggle = ({ darkMode, onChange }) => {
  return (
    <motion.button
      onClick={() => onChange(!darkMode)}
      whileHover={{ scale: 1.15, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      className="p-2.5 rounded-xl glass text-muted-foreground hover:text-foreground transition-colors btn-3d"
      aria-label="Toggle dark mode"
    >
      <motion.div
        key={darkMode ? "sun" : "moon"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;
