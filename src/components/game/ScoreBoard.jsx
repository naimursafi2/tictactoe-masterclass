import { User, Bot, Minus, Crown, Zap } from "lucide-react";
import { motion } from "framer-motion";

const ScoreBoard = ({ scores, gameMode }) => {
  return (
    <div className="flex items-stretch gap-2.5 sm:gap-3 justify-center w-full">
      <ScoreCard
        label={gameMode === "pvc" ? "You" : "Player X"}
        score={scores.X}
        variant="x"
        icon={<Zap className="w-3.5 h-3.5" />}
        delay={0}
      />
      <ScoreCard
        label="Draw"
        score={scores.draw}
        variant="draw"
        icon={<Minus className="w-3.5 h-3.5" />}
        delay={0.06}
      />
      <ScoreCard
        label={gameMode === "pvc" ? "AI" : "Player O"}
        score={scores.O}
        variant="o"
        icon={gameMode === "pvc" ? <Bot className="w-3.5 h-3.5" /> : <Crown className="w-3.5 h-3.5" />}
        delay={0.12}
      />
    </div>
  );
};

function ScoreCard({ label, score, variant, icon, delay }) {
  const configs = {
    x: {
      glow: 'hsl(265 90% 65%)',
      shadow: '0 0 25px hsl(265 90% 65% / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.06)',
      borderColor: 'hsl(265 90% 65% / 0.25)',
      textClass: 'gradient-text-x',
      iconColor: 'text-player-x',
    },
    o: {
      glow: 'hsl(340 90% 62%)',
      shadow: '0 0 25px hsl(340 90% 62% / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.06)',
      borderColor: 'hsl(340 90% 62% / 0.25)',
      textClass: 'gradient-text-o',
      iconColor: 'text-player-o',
    },
    draw: {
      glow: 'hsl(48 95% 55%)',
      shadow: '0 0 20px hsl(48 95% 55% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.06)',
      borderColor: 'hsl(48 95% 55% / 0.2)',
      textClass: 'text-draw-color',
      iconColor: 'text-draw-color',
    },
  };

  const c = configs[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col items-center px-2 sm:px-4 py-3 sm:py-4 rounded-xl glass score-glow"
      style={{
        boxShadow: c.shadow,
        borderColor: c.borderColor,
      }}
    >
      <div className={`flex items-center gap-1.5 mb-1.5 ${c.iconColor} opacity-70`}>
        {icon}
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em]">{label}</span>
      </div>
      <motion.span
        key={score}
        initial={{ scale: 1.6, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        className={`text-3xl sm:text-4xl font-display font-black ${c.textClass}`}
        style={{ filter: `drop-shadow(0 0 8px ${c.glow}40)` }}
      >
        {score}
      </motion.span>
    </motion.div>
  );
}

export default ScoreBoard;
