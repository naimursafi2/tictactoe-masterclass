import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Confetti piece
function ConfettiPiece({ index, total }) {
  const colors = [
    'hsl(265 90% 65%)',
    'hsl(340 90% 62%)',
    'hsl(48 95% 55%)',
    'hsl(180 80% 48%)',
    'hsl(265 90% 75%)',
    'hsl(340 90% 72%)',
    'hsl(120 70% 55%)',
  ];

  const style = useMemo(() => {
    const left = Math.random() * 100;
    const size = Math.random() * 8 + 4;
    const delay = Math.random() * 0.8;
    const duration = Math.random() * 2 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = Math.random() > 0.5 ? '50%' : '2px';

    return {
      position: 'absolute',
      left: `${left}%`,
      top: '-10px',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: shape,
      animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
      zIndex: 100,
    };
  }, [index]);

  return <div style={style} />;
}

const Confetti = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <ConfettiPiece key={i} index={i} total={60} />
      ))}
    </div>
  );
};

export default Confetti;
