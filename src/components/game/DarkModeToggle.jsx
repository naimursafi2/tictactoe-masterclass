import { Moon, Sun } from "lucide-react";

const DarkModeToggle = ({ darkMode, onChange }) => {
  return (
    <button
      onClick={() => onChange(!darkMode)}
      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all hover:scale-110 active:scale-95"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export default DarkModeToggle;
