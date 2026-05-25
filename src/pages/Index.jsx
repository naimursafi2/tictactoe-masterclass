import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Link2, Plus, RotateCcw, Sparkles, Users, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const emptyBoard = () => Array(9).fill(null);

const safeName = (value, fallback) => {
  const name = String(value || "").trim().slice(0, 24);
  return name || fallback;
};

const otherPlayer = (player) => (player === "X" ? "O" : "X");

const createGame = (hostName = "Player X") => ({
  board: emptyBoard(),
  turn: "X",
  starter: "X",
  winner: null,
  draw: false,
  winningLine: [],
  round: 1,
  scores: {
    X: 0,
    O: 0,
    draws: 0,
  },
  players: {
    X: safeName(hostName, "Player X"),
    O: null,
  },
});

const findOutcome = (board) => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: line, draw: false };
    }
  }

  if (board.every(Boolean)) {
    return { winner: null, winningLine: [], draw: true };
  }

  return { winner: null, winningLine: [], draw: false };
};

const applyMove = (game, index, player) => {
  if (
    game.winner ||
    game.draw ||
    game.turn !== player ||
    index < 0 ||
    index > 8 ||
    game.board[index]
  ) {
    return game;
  }

  const board = [...game.board];
  board[index] = player;
  const outcome = findOutcome(board);
  const scores = { ...game.scores };

  if (outcome.winner) {
    scores[outcome.winner] += 1;
  }

  if (outcome.draw) {
    scores.draws += 1;
  }

  return {
    ...game,
    board,
    scores,
    winner: outcome.winner,
    draw: outcome.draw,
    winningLine: outcome.winningLine,
    turn: outcome.winner || outcome.draw ? game.turn : otherPlayer(game.turn),
  };
};

const nextRound = (game) => {
  const starter = otherPlayer(game.starter);

  return {
    ...game,
    board: emptyBoard(),
    turn: starter,
    starter,
    winner: null,
    draw: false,
    winningLine: [],
    round: game.round + 1,
  };
};

const newMatch = (game) => ({
  ...createGame(game.players.X || "Player X"),
  players: game.players,
});

const getPeerClass = () => {
  if (!window.Peer) {
    throw new Error("Peer network is still loading. Try again in a moment.");
  }

  return window.Peer;
};

const extractRoomId = (value) => {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  try {
    const url = new URL(raw);
    return url.searchParams.get("room") || raw;
  } catch {
    return raw;
  }
};

const getInviteFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("room") || "";
};

const statusCopy = (game, role, connectionState) => {
  if (connectionState === "idle") {
    return {
      title: "Create a room or join one",
      hint: "Share one link and play live from two browsers.",
    };
  }

  if (connectionState === "invited") {
    return {
      title: "Invite link detected",
      hint: "Enter your name and join the room.",
    };
  }

  if (connectionState === "starting" || connectionState === "joining") {
    return {
      title: "Connecting room",
      hint: "Setting up a private peer connection.",
    };
  }

  if (connectionState === "waiting") {
    return {
      title: "Waiting for player O",
      hint: "Copy the invite link and send it to a friend.",
    };
  }

  if (connectionState === "offline") {
    return {
      title: "Connection closed",
      hint: "Create a fresh room if the other player left.",
    };
  }

  if (game.winner) {
    return {
      title: `${game.players[game.winner] || `Player ${game.winner}`} wins`,
      hint: "Start the next round when both players are ready.",
    };
  }

  if (game.draw) {
    return {
      title: "Draw round",
      hint: "No squares left. Start the next round.",
    };
  }

  if (!role) {
    return {
      title: `${game.players[game.turn] || `Player ${game.turn}`} to move`,
      hint: "You are watching this room.",
    };
  }

  if (game.turn === role) {
    return {
      title: "Your move",
      hint: "Pick any open square.",
    };
  }

  return {
    title: `${game.players[game.turn] || `Player ${game.turn}`} is thinking`,
    hint: "The board updates automatically after their move.",
  };
};

const Index = () => {
  const [name, setName] = useState(() => localStorage.getItem("ttt-live-name") || "");
  const [roomInput, setRoomInput] = useState("");
  const [roomId, setRoomId] = useState("");
  const [role, setRole] = useState(null);
  const [connectionState, setConnectionState] = useState("idle");
  const [game, setGame] = useState(() => createGame());

  const peerRef = useRef(null);
  const connRef = useRef(null);
  const roleRef = useRef(null);
  const gameRef = useRef(game);
  const nameRef = useRef(name);

  useEffect(() => {
    const invite = getInviteFromUrl();

    if (invite) {
      setRoomInput(invite);
      setRoomId(invite);
      setConnectionState("invited");
    }
  }, []);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    nameRef.current = name;
    localStorage.setItem("ttt-live-name", name);
  }, [name]);

  useEffect(() => {
    return () => cleanupConnection();
  }, []);

  const shareUrl = useMemo(() => {
    if (!roomId) {
      return "";
    }

    return `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(roomId)}`;
  }, [roomId]);

  const connectionReady = connectionState === "connected" || connectionState === "waiting";
  const status = statusCopy(game, role, connectionState);
  const winningSquares = new Set(game.winningLine);

  const sendToPeer = (message) => {
    const connection = connRef.current;

    if (connection?.open) {
      connection.send(message);
    }
  };

  const publishGame = (nextGame) => {
    queueMicrotask(() => sendToPeer({ type: "state", game: nextGame }));
    return nextGame;
  };

  const updateHostGame = (updater) => {
    if (roleRef.current !== "X") {
      return;
    }

    setGame((current) => publishGame(updater(current)));
  };

  function cleanupConnection() {
    try {
      connRef.current?.close?.();
    } catch {
      // Connection may already be closed.
    }

    try {
      peerRef.current?.destroy?.();
    } catch {
      // Peer may already be destroyed.
    }

    connRef.current = null;
    peerRef.current = null;
  }

  const handleGuestMessage = (message) => {
    if (!message || typeof message !== "object") {
      return;
    }

    if (message.type === "state" && message.game) {
      setGame(message.game);
      setConnectionState("connected");
    }

    if (message.type === "room-full") {
      setConnectionState("offline");
      toast.error("That room already has two players.");
    }
  };

  const handleHostMessage = (message) => {
    if (!message || typeof message !== "object") {
      return;
    }

    if (message.type === "join") {
      const playerName = safeName(message.name, "Player O");
      updateHostGame((current) => ({
        ...current,
        players: {
          ...current.players,
          O: playerName,
        },
      }));
      toast.success(`${playerName} joined the room.`);
    }

    if (message.type === "name") {
      updateHostGame((current) => ({
        ...current,
        players: {
          ...current.players,
          O: safeName(message.name, "Player O"),
        },
      }));
    }

    if (message.type === "move") {
      updateHostGame((current) => applyMove(current, Number(message.index), "O"));
    }

    if (message.type === "next-round") {
      updateHostGame(nextRound);
    }

    if (message.type === "new-match") {
      updateHostGame(newMatch);
    }
  };

  const registerConnection = (connection) => {
    connRef.current = connection;

    connection.on("data", (message) => {
      if (roleRef.current === "X") {
        handleHostMessage(message);
      } else {
        handleGuestMessage(message);
      }
    });

    connection.on("close", () => {
      setConnectionState(roleRef.current === "X" ? "waiting" : "offline");
    });

    connection.on("error", () => {
      setConnectionState("offline");
      toast.error("Connection failed. Try a fresh room link.");
    });
  };

  const createRoom = () => {
    try {
      cleanupConnection();
      const Peer = getPeerClass();
      const peer = new Peer();
      const hostName = safeName(nameRef.current, "Player X");

      peerRef.current = peer;
      setRole("X");
      setConnectionState("starting");
      setGame(createGame(hostName));

      peer.on("open", (id) => {
        setRoomId(id);
        setRoomInput(id);
        setConnectionState("waiting");
        window.history.replaceState({}, "", `?room=${encodeURIComponent(id)}`);
        toast.success("Room created. Copy the invite link.");
      });

      peer.on("connection", (connection) => {
        if (connRef.current?.open) {
          connection.on("open", () => connection.send({ type: "room-full" }));
          return;
        }

        registerConnection(connection);
        setConnectionState("connected");
        connection.on("open", () => {
          connection.send({ type: "state", game: gameRef.current });
        });
      });

      peer.on("error", () => {
        setConnectionState("offline");
        toast.error("Could not create the room. Please try again.");
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const joinRoom = () => {
    const targetRoom = extractRoomId(roomInput || roomId);

    if (!targetRoom) {
      toast.error("Paste an invite link or room code first.");
      return;
    }

    try {
      cleanupConnection();
      const Peer = getPeerClass();
      const peer = new Peer();

      peerRef.current = peer;
      setRole("O");
      setRoomId(targetRoom);
      setConnectionState("joining");
      window.history.replaceState({}, "", `?room=${encodeURIComponent(targetRoom)}`);

      peer.on("open", () => {
        const connection = peer.connect(targetRoom, { reliable: true });
        registerConnection(connection);

        connection.on("open", () => {
          setConnectionState("connected");
          connection.send({ type: "join", name: safeName(nameRef.current, "Player O") });
          toast.success("Joined the room.");
        });
      });

      peer.on("error", () => {
        setConnectionState("offline");
        toast.error("Could not join this room. Check the link and try again.");
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNameChange = (value) => {
    setName(value);

    if (roleRef.current === "X") {
      updateHostGame((current) => ({
        ...current,
        players: {
          ...current.players,
          X: safeName(value, "Player X"),
        },
      }));
    }

    if (roleRef.current === "O") {
      sendToPeer({ type: "name", name: safeName(value, "Player O") });
    }
  };

  const canPlayCell = (index) => {
    return Boolean(
      role &&
        connectionState === "connected" &&
        game.turn === role &&
        !game.winner &&
        !game.draw &&
        !game.board[index],
    );
  };

  const playCell = (index) => {
    if (!canPlayCell(index)) {
      return;
    }

    if (role === "X") {
      updateHostGame((current) => applyMove(current, index, "X"));
    } else {
      sendToPeer({ type: "move", index });
    }
  };

  const startNextRound = () => {
    if (!role) {
      return;
    }

    if (role === "X") {
      updateHostGame(nextRound);
    } else {
      sendToPeer({ type: "next-round" });
    }
  };

  const resetMatch = () => {
    if (!role) {
      return;
    }

    if (role === "X") {
      updateHostGame(newMatch);
    } else {
      sendToPeer({ type: "new-match" });
    }
  };

  const copyInviteLink = async () => {
    if (!shareUrl) {
      toast.error("Create or join a room first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Invite link copied.");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      toast.success("Invite link copied.");
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_34%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.14),transparent_30%),hsl(var(--background))] px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary shadow-[0_0_28px_hsl(var(--primary)/0.22)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Share-link multiplayer</p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Tic Tac Toe Live</h1>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-muted-foreground shadow-lg backdrop-blur sm:self-auto">
            {connectionReady ? <Wifi className="h-4 w-4 text-accent" /> : <WifiOff className="h-4 w-4" />}
            <span>{role ? `You are ${role}` : connectionState === "invited" ? "Invite ready" : "Ready"}</span>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-xl">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Player setup</p>
                <h2 className="mt-1 text-xl font-black">Create or join a room</h2>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-muted-foreground">Your name</span>
                <input
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  maxLength={24}
                  className="h-12 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                  placeholder="Player name"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <button
                  type="button"
                  onClick={createRoom}
                  className="btn-3d inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-black text-primary-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Create room
                </button>

                <button
                  type="button"
                  onClick={joinRoom}
                  className="btn-3d inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 text-sm font-black text-secondary-foreground"
                >
                  <Link2 className="h-4 w-4" />
                  Join room
                </button>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-muted-foreground">Invite link or code</span>
                <input
                  value={roomInput}
                  onChange={(event) => setRoomInput(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-background/70 px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                  placeholder="Paste invite link"
                />
              </label>

              <div className="rounded-2xl border border-border bg-background/50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Room</p>
                    <p className="max-w-[230px] truncate text-lg font-black">{roomId || "No room yet"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={copyInviteLink}
                    disabled={!shareUrl}
                    className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Copy invite link"
                    title="Copy invite link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="break-all text-xs leading-5 text-muted-foreground">
                  {shareUrl || "Create a room to generate a shareable link."}
                </p>
              </div>

              <div className="grid gap-3">
                <PlayerCard mark="X" name={game.players.X} active={game.turn === "X" && !game.winner && !game.draw} />
                <PlayerCard mark="O" name={game.players.O} active={game.turn === "O" && !game.winner && !game.draw} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <ScoreCard label="X" value={game.scores.X} />
                <ScoreCard label="Draw" value={game.scores.draws} />
                <ScoreCard label="O" value={game.scores.O} />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <button
                  type="button"
                  onClick={startNextRound}
                  disabled={!role}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 text-sm font-bold transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Next round
                </button>
                <button
                  type="button"
                  onClick={resetMatch}
                  disabled={!role}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 text-sm font-bold transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  New match
                </button>
              </div>
            </div>
          </aside>

          <section className="rounded-3xl border border-border bg-card/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Round {game.round}</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{status.title}</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground sm:text-right">{status.hint}</p>
            </div>

            <div className="mx-auto mt-6 grid aspect-square w-full max-w-[520px] grid-cols-3 gap-3 sm:gap-4">
              {game.board.map((mark, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => playCell(index)}
                  disabled={!canPlayCell(index)}
                  className={`cell-3d grid min-h-0 min-w-0 place-items-center rounded-3xl text-5xl font-black sm:text-6xl ${
                    mark === "X" ? "gradient-text-x" : mark === "O" ? "gradient-text-o" : "text-muted-foreground/40"
                  } ${winningSquares.has(index) ? (mark === "X" ? "glow-x win-cell" : "glow-o win-cell") : ""}`}
                  aria-label={mark ? `Square ${index + 1}, ${mark}` : `Square ${index + 1}, empty`}
                >
                  {mark}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-background/50 p-4">
              <div className="flex items-start gap-3">
                <Users className="mt-1 h-5 w-5 text-accent" />
                <div>
                  <p className="font-bold">How sharing works</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    The creator keeps the room open as X. The invited player joins as O. Moves are sent live over a browser peer-to-peer connection.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

const PlayerCard = ({ mark, name, active }) => (
  <div className={`flex items-center gap-3 rounded-2xl border p-3 ${active ? "border-primary bg-primary/10" : "border-border bg-background/50"}`}>
    <span
      className={`grid h-11 w-11 place-items-center rounded-2xl text-lg font-black text-white ${
        mark === "X" ? "bg-[hsl(var(--player-x))]" : "bg-[hsl(var(--player-o))]"
      }`}
    >
      {mark}
    </span>
    <div className="min-w-0">
      <p className="truncate font-black">{name || "Waiting"}</p>
      <p className="text-xs text-muted-foreground">{name ? (active ? "Turn now" : "In room") : "Open seat"}</p>
    </div>
  </div>
);

const ScoreCard = ({ label, value }) => (
  <div className="rounded-2xl border border-border bg-background/50 p-3 text-center">
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
    <p className="mt-1 text-2xl font-black">{value}</p>
  </div>
);

export default Index;
