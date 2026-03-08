import { useState, useCallback, useEffect } from "react";

function getWinLength(size) {
  if (size === 3) return 3;
  if (size === 5) return 4;
  return 5;
}

function generateWinningLines(size) {
  const winLen = getWinLength(size);
  const lines = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      const line = [];
      for (let k = 0; k < winLen; k++) line.push(r * size + c + k);
      lines.push(line);
    }
  }
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLen; r++) {
      const line = [];
      for (let k = 0; k < winLen; k++) line.push((r + k) * size + c);
      lines.push(line);
    }
  }
  for (let r = 0; r <= size - winLen; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      const line = [];
      for (let k = 0; k < winLen; k++) line.push((r + k) * size + c + k);
      lines.push(line);
    }
  }
  for (let r = 0; r <= size - winLen; r++) {
    for (let c = winLen - 1; c < size; c++) {
      const line = [];
      for (let k = 0; k < winLen; k++) line.push((r + k) * size + c - k);
      lines.push(line);
    }
  }
  return lines;
}

function checkWinner(board, size) {
  const lines = generateWinningLines(size);
  for (const line of lines) {
    const first = board[line[0]];
    if (first && line.every((i) => board[i] === first)) {
      return { winner: first, line };
    }
  }
  return null;
}

function getAIMove(board, difficulty, aiPlayer, size) {
  const available = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
  if (available.length === 0) return -1;

  const humanPlayer = aiPlayer === "X" ? "O" : "X";

  if (difficulty === "easy") {
    return available[Math.floor(Math.random() * available.length)];
  }

  if (size > 3) {
    for (const i of available) {
      const copy = [...board];
      copy[i] = aiPlayer;
      if (checkWinner(copy, size)) return i;
    }
    for (const i of available) {
      const copy = [...board];
      copy[i] = humanPlayer;
      if (checkWinner(copy, size)) return i;
    }
    const center = Math.floor(size * size / 2);
    if (board[center] === null) return center;
    return available[Math.floor(Math.random() * available.length)];
  }

  if (difficulty === "medium" && Math.random() < 0.4) {
    return available[Math.floor(Math.random() * available.length)];
  }

  function minimax(b, isMax, depth) {
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

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { scores: { X: 0, O: 0, draw: 0 }, history: [], darkMode: false };
}

function saveStored(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGameState() {
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [history, setHistory] = useState([]);
  const [gameMode, setGameMode] = useState("pvp");
  const [difficulty, setDifficulty] = useState("medium");
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

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
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleCellClick = useCallback(
    (index) => {
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

  const changeBoardSize = useCallback((size) => {
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
