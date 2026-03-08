import { useGameState } from "@/hooks/useGameState";
import GameBoard from "@/components/game/GameBoard";
import ScoreBoard from "@/components/game/ScoreBoard";
import GameStatus from "@/components/game/GameStatus";
import ControlPanel from "@/components/game/ControlPanel";
import ModeSelector from "@/components/game/ModeSelector";
import BoardSizeSelector from "@/components/game/BoardSizeSelector";
import WinModal from "@/components/game/WinModal";
import GameHistory from "@/components/game/GameHistory";
import DarkModeToggle from "@/components/game/DarkModeToggle";

const Index = () => {
  const game = useGameState();

  const handleModeChange = (mode) => {
    game.setGameMode(mode);
    game.newMatch();
  };

  const handleDifficultyChange = (d) => {
    game.setDifficulty(d);
    game.restartRound();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-background relative">
      <div className="absolute top-4 right-4">
        <DarkModeToggle darkMode={game.darkMode} onChange={game.setDarkMode} />
      </div>

      <div className="w-full max-w-lg flex flex-col items-center gap-5 sm:gap-6">
        <div className="text-center slide-up">
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Tic-Tac-Toe
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Play the classic game with a modern twist
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <ModeSelector
            gameMode={game.gameMode}
            difficulty={game.difficulty}
            onModeChange={handleModeChange}
            onDifficultyChange={handleDifficultyChange}
          />
          <BoardSizeSelector boardSize={game.boardSize} onChange={game.changeBoardSize} />
        </div>

        <ScoreBoard scores={game.scores} gameMode={game.gameMode} />

        <GameStatus
          winner={game.winner}
          isDraw={game.isDraw}
          currentPlayer={game.currentPlayer}
          gameMode={game.gameMode}
        />

        <GameBoard
          board={game.board}
          boardSize={game.boardSize}
          winLine={game.winLine}
          gameOver={game.gameOver}
          onCellClick={game.handleCellClick}
        />

        <ControlPanel
          onRestart={game.restartRound}
          onNewMatch={game.newMatch}
          onResetScores={game.resetScores}
          gameOver={game.gameOver}
        />

        <GameHistory history={game.history} />

        <p className="text-xs text-muted-foreground">
          Round {game.roundNumber} · {game.boardSize}×{game.boardSize} board · {game.boardSize === 3 ? 3 : game.boardSize === 5 ? 4 : 5} in a row to win
        </p>
      </div>

      <WinModal
        show={game.showModal}
        winner={game.winner}
        isDraw={game.isDraw}
        gameMode={game.gameMode}
        onClose={() => game.setShowModal(false)}
        onRestart={game.restartRound}
      />
    </div>
  );
};

export default Index;
