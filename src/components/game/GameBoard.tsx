import Cell from "./Cell";
import { CellValue } from "@/hooks/useGameState";

interface GameBoardProps {
  board: CellValue[];
  winLine: number[] | null;
  gameOver: boolean;
  onCellClick: (index: number) => void;
}

const GameBoard = ({ board, winLine, gameOver, onCellClick }: GameBoardProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-[320px] sm:max-w-[360px] mx-auto slide-up">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          index={index}
          isWinning={winLine?.includes(index) ?? false}
          disabled={gameOver}
          onClick={onCellClick}
        />
      ))}
    </div>
  );
};

export default GameBoard;
