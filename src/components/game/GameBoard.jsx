import Cell from "./Cell";
import { motion } from "framer-motion";

const sizeClasses = {
  3: "grid-cols-3 max-w-[320px] sm:max-w-[360px]",
  5: "grid-cols-5 max-w-[380px] sm:max-w-[420px]",
  7: "grid-cols-7 max-w-[420px] sm:max-w-[490px]",
};

const cellTextSize = {
  3: "text-4xl sm:text-5xl",
  5: "text-2xl sm:text-3xl",
  7: "text-lg sm:text-xl",
};

const GameBoard = ({ board, boardSize, winLine, gameOver, onCellClick }) => {
  return (
    <motion.div
      key={boardSize}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`grid gap-2 sm:gap-2.5 w-full mx-auto p-3 sm:p-4 rounded-2xl ${sizeClasses[boardSize]}`}
      style={{
        background: 'hsl(0 0% 0% / 0.15)',
        boxShadow: 'inset 0 2px 10px hsl(0 0% 0% / 0.2), 0 0 0 1px hsl(0 0% 100% / 0.03)',
      }}
    >
      {board.map((value, index) => (
        <Cell
          key={`${boardSize}-${index}`}
          value={value}
          index={index}
          isWinning={winLine?.includes(index) ?? false}
          disabled={gameOver}
          onClick={onCellClick}
          textSize={cellTextSize[boardSize]}
        />
      ))}
    </motion.div>
  );
};

export default GameBoard;
