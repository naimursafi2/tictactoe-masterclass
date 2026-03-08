import Cell from "./Cell";
import { CellValue, BoardSize } from "@/hooks/useGameState";

interface GameBoardProps {
  board: CellValue[];
  boardSize: BoardSize;
  winLine: number[] | null;
  gameOver: boolean;
  onCellClick: (index: number) => void;
}

const sizeClasses: Record<BoardSize, string> = {
  3: "grid-cols-3 max-w-[320px] sm:max-w-[360px]",
  5: "grid-cols-5 max-w-[380px] sm:max-w-[420px]",
  7: "grid-cols-7 max-w-[420px] sm:max-w-[490px]",
};

const cellTextSize: Record<BoardSize, string> = {
  3: "text-4xl sm:text-5xl",
  5: "text-2xl sm:text-3xl",
  7: "text-lg sm:text-xl",
};

const GameBoard = ({ board, boardSize, winLine, gameOver, onCellClick }: GameBoardProps) => {
  return (
    <div className={`grid gap-1.5 sm:gap-2 w-full mx-auto slide-up ${sizeClasses[boardSize]}`}>
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
    </div>
  );
};

export default GameBoard;
