import { useState, useCallback, useEffect } from "react";

export type Player = "X" | "O";
export type CellValue = Player | null;
export type GameMode = "pvp" | "pvc";
export type Difficulty = "easy" | "medium" | "hard";
export type GameResult = { winner: Player | "draw"; round: number };

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: CellValue[]): { winner: Player; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return null;
}

function getAIMove(board: CellValue[], difficulty: Difficulty, aiPlayer: Player): number {
  const available = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
  if (available.length === 0) return -1;

  const humanPlayer = aiPlayer === "X" ? "O" : "X";

  if (difficulty === "easy") {
    return available[Math.floor(Math.random() * available.length)];
  }

  if (difficulty === "medium") {
    if (Math.random() < 0.4) {
      return available[Math.floor(Math.random() * available.length)];
    }
  }

  // Minimax for hard (and sometimes medium)
  function minimax(b: CellValue[], isMax: boolean, depth: number): number {
    const result = checkWinner(b);
    if (result) return result.winner === aiPlayer ? 10 - depth : depth - 10;
    if (b.every((c) => c !== null)) return 0;

    let best = isMax ? -Infinity : Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] !== null) continue;
      b[i] = isMax ? aiPlayer : humanPlayer;
      const score = minimax(b, !isMax, depth + 1);
      b[i] = null;
      best = isMax ? Math.max(best, score) : Math.min(best, score);
    }
    return best;
  }

  let bestScore = -Infinity;
  let bestMove = available[0];
  for (const i of available) {
    const copy = [...board];
    copy[i] = aiPlayer;
    const score = minimax(copy, false, 1);
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

const STORAGE_KEY = "ttt-state";

interface StoredState {
  scores: { X: number; O: number; draw: number };
  history: GameResult[];
  darkMode: boolean;
}

function loadStored(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { scores: { X: 0, O: 0, draw: 0 }, history: [], darkMode: false };
}

function saveStored(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGameState() {
  const stored = loadStored();

  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState(stored.scores);
  const [history, setHistory] = useState<GameResult[]>(stored.history);
  const [gameMode, setGameMode] = useState<GameMode>("pvp");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [darkMode, setDarkMode] = useState(stored.darkMode);
  const [showModal, setShowModal] = useState(false);
  const [roundNumber, setRoundNumber] = useState(stored.history.length + 1);

  const gameOver = winner !== null || isDraw;

  // Persist scores/history/dark mode
  useEffect(() => {
    saveStored({ scores, history, darkMode });
  }, [scores, history, darkMode]);

  // Dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] || gameOver) return;
      if (gameMode === "pvc" && currentPlayer === "O") return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result) {
        setWinner(result.winner);
        setWinLine(result.line);
        setScores((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
        setHistory((h) => [...h, { winner: result.winner, round: roundNumber }]);
        setTimeout(() => setShowModal(true), 500);
      } else if (newBoard.every((c) => c !== null)) {
        setIsDraw(true);
        setScores((s) => ({ ...s, draw: s.draw + 1 }));
        setHistory((h) => [...h, { winner: "draw", round: roundNumber }]);
        setTimeout(() => setShowModal(true), 500);
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    },
    [board, currentPlayer, gameOver, gameMode, roundNumber]
  );

  // AI move
  useEffect(() => {
    if (gameMode !== "pvc" || currentPlayer !== "O" || gameOver) return;
    const timeout = setTimeout(() => {
      const move = getAIMove(board, difficulty, "O");
      if (move === -1) return;
      const newBoard = [...board];
      newBoard[move] = "O";
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result) {
        setWinner(result.winner);
        setWinLine(result.line);
        setScores((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
        setHistory((h) => [...h, { winner: result.winner, round: roundNumber }]);
        setTimeout(() => setShowModal(true), 500);
      } else if (newBoard.every((c) => c !== null)) {
        setIsDraw(true);
        setScores((s) => ({ ...s, draw: s.draw + 1 }));
        setHistory((h) => [...h, { winner: "draw", round: roundNumber }]);
        setTimeout(() => setShowModal(true), 500);
      } else {
        setCurrentPlayer("X");
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [currentPlayer, gameMode, gameOver, board, difficulty, roundNumber]);

  const restartRound = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setWinLine(null);
    setIsDraw(false);
    setShowModal(false);
    setRoundNumber((r) => r + 1);
  }, []);

  const newMatch = useCallback(() => {
    restartRound();
    setScores({ X: 0, O: 0, draw: 0 });
    setHistory([]);
    setRoundNumber(1);
  }, [restartRound]);

  const resetScores = useCallback(() => {
    setScores({ X: 0, O: 0, draw: 0 });
    setHistory([]);
  }, []);

  return {
    board, currentPlayer, winner, winLine, isDraw, gameOver,
    scores, history, gameMode, difficulty, darkMode, showModal, roundNumber,
    handleCellClick, restartRound, newMatch, resetScores,
    setGameMode, setDifficulty, setDarkMode, setShowModal,
  };
}
