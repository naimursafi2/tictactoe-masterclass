import { User, Bot, Minus } from "lucide-react";
import { motion } from "framer-motion";

const ScoreBoard = ({ scores, gameMode }) => {
  return (
    <div className="flex items-stretch gap-3 sm:gap-4 justify-center w-full">
      <ScoreCard
        label={gameMode === "pvc" ? "You" : "Player X"}
        score={scores.X}
        variant="x"
        icon={<User className="w-4 h-4" />}
        delay={0}
      />
      <ScoreCard
        label="Draw"
        score={scores.draw}
        variant="draw"
        icon={<Minus className="w-4 h-4" />}
        delay={0.05}
      />
      <ScoreCard
        label={gameMode === "pvc" ? "AI" : "Player O"}
        score={scores.O}
        variant="o"
        icon={gameMode === "pvc" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        delay={0.1}
      />
    </div>
  );
};

function ScoreCard({ label, score, variant, icon, delay }) {
  const glowStyle = {
    x: {
      boxShadow: '0 0 20px hsl(260 85% 65% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.05)',
      borderColor: 'hsl(260 85% 65% / 0.3)',
    },
    o: {
      boxShadow: '0 0 20px hsl(340 85% 60% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.05)',
      borderColor: 'hsl(340 85% 60% / 0.3)',
    },
    draw: {
      boxShadow: '0 0 20px hsl(45 90% 55% / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.05)',
      borderColor: 'hsl(45 90% 55% / 0.25)',
    },
  };

  const textColor = {
    x: "text-player-x",
    o: "text-player-o",
    draw: "text-draw-color",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`flex-1 flex flex-col items-center px-3 sm:px-5 py-3 sm:py-4 rounded-xl glass border ${textColor[variant]}`}
      style={glowStyle[variant]}
    >
      <div className="flex items-center gap-1.5 mb-1 opacity-70">
        {icon}
        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest">{label}</span>
      </div>
      <motion.span
        key={score}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="text-3xl sm:text-4xl font-display font-bold"
      >
        {score}
      </motion.span>
    </motion.div>
  );
}

export default ScoreBoard;
