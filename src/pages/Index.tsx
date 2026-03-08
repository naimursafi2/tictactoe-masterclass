import { useGameState } from "@/hooks/useGameState";
import GameBoard from "@/components/game/GameBoard";
import ScoreBoard from "@/components/game/ScoreBoard";
import GameStatus from "@/components/game/GameStatus";
import ControlPanel from "@/components/game/ControlPanel";
import ModeSelector from "@/components/game/ModeSelector";
import WinModal from "@/components/game/WinModal";
import GameHistory from "@/components/game/GameHistory";
import DarkModeToggle from "@/components/game/DarkModeToggle";

const Index = () => {
  const game = useGameState();

  const handleModeChange = (mode: "pvp" | "pvc") => {
    game.setGameMode(mode);
    game.newMatch();
  };

  const handleDifficultyChange = (d: "easy" | "medium" | "hard") => {
    game.setDifficulty(d);
    game.restartRound();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-background relative">
      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4">
        <DarkModeToggle darkMode={game.darkMode} onChange={game.setDarkMode} />
      </div>

      {/* Main container */}
      <div className="w-full max-w-md flex flex-col items-center gap-5 sm:gap-6">
        {/* Header */}
        <div className="text-center slide-up">
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Tic-Tac-Toe
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Play the classic game with a modern twist
          </p>
        </div>

        {/* Mode selector */}
        <ModeSelector
          gameMode={game.gameMode}
          difficulty={game.difficulty}
          onModeChange={handleModeChange}
          onDifficultyChange={handleDifficultyChange}
        />

        {/* Scoreboard */}
        <ScoreBoard scores={game.scores} gameMode={game.gameMode} />

        {/* Game status */}
        <GameStatus
          winner={game.winner}
          isDraw={game.isDraw}
          currentPlayer={game.currentPlayer}
          gameMode={game.gameMode}
        />

        {/* Board */}
        <GameBoard
          board={game.board}
          winLine={game.winLine}
          gameOver={game.gameOver}
          onCellClick={game.handleCellClick}
        />

        {/* Controls */}
        <ControlPanel
          onRestart={game.restartRound}
          onNewMatch={game.newMatch}
          onResetScores={game.resetScores}
          gameOver={game.gameOver}
        />

        {/* History */}
        <GameHistory history={game.history} />

        {/* Round indicator */}
        <p className="text-xs text-muted-foreground">Round {game.roundNumber}</p>
      </div>

      {/* Win/Draw modal */}
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
