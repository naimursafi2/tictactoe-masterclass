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
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-background -z-10" />

      {/* Gradient overlay */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, hsl(260 85% 65% / 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 50%, hsl(340 85% 60% / 0.08), transparent),
            radial-gradient(ellipse 60% 40% at 20% 80%, hsl(175 80% 50% / 0.08), transparent)
          `,
        }}
      />

      {/* Floating orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="orb-1 absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-30"
          style={{ background: 'hsl(260 85% 65% / 0.4)', top: '10%', left: '15%' }}
        />
        <div
          className="orb-2 absolute w-[250px] h-[250px] rounded-full blur-[100px] opacity-25"
          style={{ background: 'hsl(340 85% 60% / 0.35)', top: '60%', right: '10%' }}
        />
        <div
          className="orb-3 absolute w-[200px] h-[200px] rounded-full blur-[80px] opacity-20"
          style={{ background: 'hsl(175 80% 50% / 0.35)', bottom: '10%', left: '40%' }}
        />
      </div>

      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle darkMode={game.darkMode} onChange={game.setDarkMode} />
      </div>

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg flex flex-col items-center gap-5 sm:gap-6"
      >
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1
            className="text-4xl sm:text-5xl font-display font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, hsl(260 85% 70%), hsl(340 85% 65%), hsl(260 85% 70%))',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Tic-Tac-Toe
          </h1>
          <p className="text-sm text-muted-foreground mt-2 tracking-wide">
            Play the classic game with a modern twist
          </p>
        </motion.div>

        {/* Glass container for game */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full glass rounded-3xl p-5 sm:p-7 flex flex-col items-center gap-5 float"
          style={{
            boxShadow: `
              0 20px 60px -15px hsl(0 0% 0% / 0.4),
              0 0 40px hsl(260 85% 65% / 0.05),
              inset 0 1px 0 0 hsl(0 0% 100% / 0.05)
            `,
          }}
        >
          {/* Selectors row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
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
        </motion.div>

        <GameHistory history={game.history} />

        <motion.p
          className="text-xs text-muted-foreground glass px-4 py-2 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Round {game.roundNumber} · {game.boardSize}×{game.boardSize} board · {game.boardSize === 3 ? 3 : game.boardSize === 5 ? 4 : 5} in a row to win
        </motion.p>
      </motion.div>

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
