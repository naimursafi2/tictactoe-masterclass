import Cell from "./Cell";
import { motion } from "framer-motion";

const sizeClasses = {
  3: "grid-cols-3 max-w-[300px] sm:max-w-[340px]",
  5: "grid-cols-5 max-w-[360px] sm:max-w-[400px]",
  7: "grid-cols-7 max-w-[400px] sm:max-w-[470px]",
};

const GameBoard = ({ board, boardSize, winLine, gameOver, onCellClick }) => {
  return (
    <motion.div
      key={boardSize}
      initial={{ opacity: 0, scale: 0.85, rotateX: 10 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`grid gap-2 sm:gap-2.5 w-full mx-auto p-3 sm:p-4 rounded-2xl ${sizeClasses[boardSize]}`}
      style={{
        background: 'linear-gradient(145deg, hsl(0 0% 0% / 0.12), hsl(0 0% 0% / 0.2))',
        boxShadow: `
          inset 0 2px 12px hsl(0 0% 0% / 0.25),
          inset 0 -1px 0 hsl(0 0% 100% / 0.03),
          0 0 0 1px hsl(0 0% 100% / 0.03)
        `,
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
          boardSize={boardSize}
        />
      ))}
    </motion.div>
  );
};

export default GameBoard;
