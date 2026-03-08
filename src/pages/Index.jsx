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
import Confetti from "@/components/game/Confetti";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 animated-bg -z-20" />

      {/* Gradient overlays */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% -30%, hsl(265 90% 62% / 0.2), transparent),
            radial-gradient(ellipse 70% 50% at 85% 50%, hsl(340 90% 60% / 0.1), transparent),
            radial-gradient(ellipse 70% 50% at 15% 80%, hsl(180 80% 48% / 0.08), transparent),
            radial-gradient(ellipse 50% 40% at 50% 100%, hsl(265 90% 62% / 0.1), transparent)
          `,
        }}
      />

      {/* Floating orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="orb-1 absolute w-[350px] h-[350px] rounded-full blur-[120px] opacity-25"
          style={{ background: 'hsl(265 90% 62% / 0.5)', top: '5%', left: '10%' }}
        />
        <div
          className="orb-2 absolute w-[280px] h-[280px] rounded-full blur-[110px] opacity-20"
          style={{ background: 'hsl(340 90% 60% / 0.45)', top: '55%', right: '5%' }}
        />
        <div
          className="orb-3 absolute w-[220px] h-[220px] rounded-full blur-[90px] opacity-18"
          style={{ background: 'hsl(180 80% 48% / 0.4)', bottom: '5%', left: '35%' }}
        />
        <div
          className="orb-4 absolute w-[180px] h-[180px] rounded-full blur-[80px] opacity-15"
          style={{ background: 'hsl(48 95% 55% / 0.3)', top: '30%', right: '30%' }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(0 0% 100% / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(0 0% 100% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Confetti */}
      <Confetti show={game.showModal && game.winner} />

      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle darkMode={game.darkMode} onChange={game.setDarkMode} />
      </div>

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg flex flex-col items-center gap-4 sm:gap-5"
      >
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Gamepad2 className="w-8 h-8 text-primary" style={{ filter: 'drop-shadow(0 0 8px hsl(265 90% 62% / 0.5))' }} />
            </motion.div>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-display font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, hsl(265 90% 72%), hsl(340 90% 68%), hsl(48 95% 60%), hsl(265 90% 72%))',
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 5s linear infinite',
              filter: 'drop-shadow(0 2px 10px hsl(265 90% 62% / 0.3))',
            }}
          >
            Tic-Tac-Toe
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 tracking-wide font-medium">
            The classic game — reimagined
          </p>
        </motion.div>

        {/* Main glass card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="w-full glass-card rounded-3xl p-4 sm:p-6 flex flex-col items-center gap-4 sm:gap-5 float"
          style={{
            boxShadow: `
              0 25px 80px -15px hsl(0 0% 0% / 0.5),
              0 0 50px hsl(265 90% 62% / 0.06),
              0 0 100px hsl(340 90% 60% / 0.03),
              inset 0 1px 0 0 hsl(0 0% 100% / 0.06)
            `,
          }}
        >
          {/* Selectors */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
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

        <motion.div
          className="glass rounded-full px-5 py-2 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-xs text-muted-foreground font-medium">
            Round {game.roundNumber} · {game.boardSize}×{game.boardSize} · {game.boardSize === 3 ? 3 : game.boardSize === 5 ? 4 : 5} in a row
          </p>
        </motion.div>
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
