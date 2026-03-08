import { useState, useCallback, useEffect } from "react";

export type Player = "X" | "O";
export type CellValue = Player | null;
export type GameMode = "pvp" | "pvc";
export type Difficulty = "easy" | "medium" | "hard";
export type BoardSize = 3 | 5 | 7;
export type GameResult = { winner: Player | "draw"; round: number; boardSize: BoardSize };

function getWinLength(size: BoardSize): number {
  if (size === 3) return 3;
  if (size === 5) return 4;
  return 5; // 7x7
}

function generateWinningLines(size: BoardSize): number[][] {
  const winLen = getWinLength(size);
  const lines: number[][] = [];

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      const line: number[] = [];
      for (let k = 0; k < winLen; k++) line.push(r * size + c + k);
      lines.push(line);
    }
  }
  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLen; r++) {
      const line: number[] = [];
      for (let k = 0; k < winLen; k++) line.push((r + k) * size + c);
      lines.push(line);
    }
  }
  // Diag down-right
  for (let r = 0; r <= size - winLen; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      const line: number[] = [];
      for (let k = 0; k < winLen; k++) line.push((r + k) * size + c + k);
      lines.push(line);
    }
  }
  // Diag down-left
  for (let r = 0; r <= size - winLen; r++) {
    for (let c = winLen - 1; c < size; c++) {
      const line: number[] = [];
      for (let k = 0; k < winLen; k++) line.push((r + k) * size + c - k);
      lines.push(line);
    }
  }
  return lines;
}

function checkWinner(board: CellValue[], size: BoardSize): { winner: Player; line: number[] } | null {
  const lines = generateWinningLines(size);
  for (const line of lines) {
    const first = board[line[0]];
    if (first && line.every((i) => board[i] === first)) {
      return { winner: first as Player, line };
    }
  }
  return null;
}

function getAIMove(board: CellValue[], difficulty: Difficulty, aiPlayer: Player, size: BoardSize): number {
  const available = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
  if (available.length === 0) return -1;

  const humanPlayer = aiPlayer === "X" ? "O" : "X";

  if (difficulty === "easy") {
    return available[Math.floor(Math.random() * available.length)];
  }

  // For larger boards, use heuristic instead of minimax (too slow)
  if (size > 3) {
    // Try to win
    for (const i of available) {
      const copy = [...board];
      copy[i] = aiPlayer;
      if (checkWinner(copy, size)) return i;
    }
    // Block opponent
    for (const i of available) {
      const copy = [...board];
      copy[i] = humanPlayer;
      if (checkWinner(copy, size)) return i;
    }
    // Center or random
    const center = Math.floor(size * size / 2);
    if (board[center] === null) return center;
    return available[Math.floor(Math.random() * available.length)];
  }

  if (difficulty === "medium" && Math.random() < 0.4) {
    return available[Math.floor(Math.random() * available.length)];
  }

  // Minimax for 3x3
  function minimax(b: CellValue[], isMax: boolean, depth: number): number {
    const result = checkWinner(b, size);
    if (result) return result.winner === aiPlayer ? 10 - depth : depth - 10;
    if (b.every((c) => c !== null)) return 0;

    let best = isMax ? -Infinity : Infinity;
    for (let i = 0; i < b.length; i++) {
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
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState<{ X: number; O: number; draw: number }>({ X: 0, O: 0, draw: 0 });
  const [history, setHistory] = useState<GameResult[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("pvp");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

  // Load from localStorage on mount only
  useEffect(() => {
    const stored = loadStored();
    setScores(stored.scores);
    setHistory(stored.history);
    setDarkMode(stored.darkMode);
    setRoundNumber(stored.history.length + 1);
  }, []);

  const gameOver = winner !== null || isDraw;

  useEffect(() => {
    saveStored({ scores, history, darkMode });
  }, [scores, history, darkMode]);

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

      const result = checkWinner(newBoard, boardSize);
      if (result) {
        setWinner(result.winner);
        setWinLine(result.line);
        setScores((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
        setHistory((h) => [...h, { winner: result.winner, round: roundNumber, boardSize }]);
        setTimeout(() => setShowModal(true), 500);
      } else if (newBoard.every((c) => c !== null)) {
        setIsDraw(true);
        setScores((s) => ({ ...s, draw: s.draw + 1 }));
        setHistory((h) => [...h, { winner: "draw", round: roundNumber, boardSize }]);
        setTimeout(() => setShowModal(true), 500);
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    },
    [board, currentPlayer, gameOver, gameMode, roundNumber, boardSize]
  );

  // AI move
  useEffect(() => {
    if (gameMode !== "pvc" || currentPlayer !== "O" || gameOver) return;
    const timeout = setTimeout(() => {
      const move = getAIMove(board, difficulty, "O", boardSize);
      if (move === -1) return;
      const newBoard = [...board];
      newBoard[move] = "O";
      setBoard(newBoard);

      const result = checkWinner(newBoard, boardSize);
      if (result) {
        setWinner(result.winner);
        setWinLine(result.line);
        setScores((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
        setHistory((h) => [...h, { winner: result.winner, round: roundNumber, boardSize }]);
        setTimeout(() => setShowModal(true), 500);
      } else if (newBoard.every((c) => c !== null)) {
        setIsDraw(true);
        setScores((s) => ({ ...s, draw: s.draw + 1 }));
        setHistory((h) => [...h, { winner: "draw", round: roundNumber, boardSize }]);
        setTimeout(() => setShowModal(true), 500);
      } else {
        setCurrentPlayer("X");
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [currentPlayer, gameMode, gameOver, board, difficulty, roundNumber, boardSize]);

  const resetBoard = useCallback(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setWinLine(null);
    setIsDraw(false);
    setShowModal(false);
  }, [boardSize]);

  const restartRound = useCallback(() => {
    resetBoard();
    setRoundNumber((r) => r + 1);
  }, [resetBoard]);

  const newMatch = useCallback(() => {
    resetBoard();
    setScores({ X: 0, O: 0, draw: 0 });
    setHistory([]);
    setRoundNumber(1);
  }, [resetBoard]);

  const resetScores = useCallback(() => {
    setScores({ X: 0, O: 0, draw: 0 });
    setHistory([]);
  }, []);

  const changeBoardSize = useCallback((size: BoardSize) => {
    setBoardSize(size);
    setBoard(Array(size * size).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setWinLine(null);
    setIsDraw(false);
    setShowModal(false);
  }, []);

  return {
    board, boardSize, currentPlayer, winner, winLine, isDraw, gameOver,
    scores, history, gameMode, difficulty, darkMode, showModal, roundNumber,
    handleCellClick, restartRound, newMatch, resetScores, changeBoardSize,
    setGameMode, setDifficulty, setDarkMode, setShowModal,
  };
}
