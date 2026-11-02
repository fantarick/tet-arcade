import { useEffect, useRef, useState } from "react";
import {
  beginInput,
  createGame,
  selectCell,
  type GameState,
} from "./game/pulse-grid";

const COLUMNS = 5;
const PERSONAL_BEST_KEY = "tet-arcade.pulse-grid.personal-best";
const START_DELAY_MS = 450;
const CELL_ON_MS = 560;
const CELL_GAP_MS = 240;

function randomSeed(): number {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] ?? 1;
}

function readPersonalBest(): number {
  try {
    const raw = window.localStorage.getItem(PERSONAL_BEST_KEY);
    if (raw === null) return 0;
    const score = Number(raw);
    return Number.isSafeInteger(score) && score >= 0 ? score : 0;
  } catch {
    // Private browsing / storage policy restrictions must not block gameplay.
    return 0;
  }
}

function newGame(bestScore: number): GameState {
  return createGame(randomSeed(), undefined, bestScore);
}

function cellCoordinates(index: number): string {
  return "row " + (Math.floor(index / COLUMNS) + 1) +
    ", column " + ((index % COLUMNS) + 1);
}

function phaseDescription(game: GameState, highlighted: number | null): string {
  if (game.phase === "lost") {
    return "Game over. You scored " + game.score + " points. Try another round!";
  }

  if (game.phase === "input") {
    return "Your turn! Repeat the sequence. Cell " +
      (game.inputIndex + 1) + " of " + game.sequence.length + ".";
  }

  return highlighted === null
    ? "Watch the sequence. Input will unlock after playback."
    : "Watch " + cellCoordinates(highlighted) + ".";
}

export default function App() {
  const [game, setGame] = useState<GameState>(() => newGame(readPersonalBest()));
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const firstCellRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (game.phase !== "playback") return;

    // Clean up every scheduled timeout on a round transition, restart,
    // component unmount, or React Strict Mode effect replay.
    const timeouts: number[] = [];
    const playbackRound = game.round;
    const sequence = game.sequence;

    setHighlighted(null);
    sequence.forEach((cell, index) => {
      const start = START_DELAY_MS + index * (CELL_ON_MS + CELL_GAP_MS);

      timeouts.push(window.setTimeout(() => setHighlighted(cell), start));
      timeouts.push(window.setTimeout(() => setHighlighted(null), start + CELL_ON_MS));
    });

    const finish = START_DELAY_MS +
      sequence.length * (CELL_ON_MS + CELL_GAP_MS);

    timeouts.push(
      window.setTimeout(() => {
        setHighlighted(null);
        setGame((current) =>
          current.phase === "playback" && current.round === playbackRound
            ? beginInput(current)
            : current,
        );
      }, finish),
    );

    return () => {
      for (const timeout of timeouts) {
        window.clearTimeout(timeout);
      }
    };
  }, [game.phase, game.round, game.sequence]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PERSONAL_BEST_KEY, String(game.bestScore));
    } catch {
      // Best-score persistence is optional.
    }
  }, [game.bestScore]);

  useEffect(() => {
    if (game.phase === "input") {
      firstCellRef.current?.focus();
    }
  }, [game.phase, game.round]);

  function handleCell(index: number) {
    setGame((current) => selectCell(current, index));
  }

  function handleNewGame() {
    setHighlighted(null);
    setGame((current) => newGame(current.bestScore));
  }

  const description = phaseDescription(game, highlighted);

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="wordmark" aria-label="TET Arcade">
          <span className="wordmark-symbol" aria-hidden="true">✳</span>
          <span>TET<span className="wordmark-accent">ARCADE</span></span>
        </div>
        <span className="version-label">EXPERIMENTAL · FREE TO PLAY</span>
      </header>

      <main className="content">
        <section className="intro" aria-labelledby="game-heading">
          <p className="eyebrow">WELCOME TO THE PLAYGROUND</p>
          <h1 id="game-heading">Pulse <span>Grid.</span></h1>
          <p className="intro-copy">
            Watch the pattern. Repeat the sequence. Keep your streak alive.
            No wallet, no tokens, no strings attached.
          </p>
        </section>

        <section className="arcade-panel" aria-label="Pulse Grid game">
          <div className="scoreboard">
            <div>
              <span className="stat-label">ROUND</span>
              <strong className="stat-value">{game.round.toString().padStart(2, "0")}</strong>
            </div>
            <div>
              <span className="stat-label">SCORE</span>
              <strong className="stat-value">{game.score}</strong>
            </div>
            <div>
              <span className="stat-label">PERSONAL BEST</span>
              <strong className="stat-value">{game.bestScore}</strong>
            </div>
          </div>

          <div className="game-area">
            <div className="phase-heading">
              <span
                className={"phase-indicator phase-" + game.phase}
                aria-hidden="true"
              />
              <span>
                {game.phase === "playback"
                  ? "MEMORIZE THE PATTERN"
                  : game.phase === "input"
                    ? "YOUR TURN"
                    : "SEQUENCE BROKEN"}
              </span>
            </div>

            <div className="pulse-grid" role="group" aria-label="5 by 5 memory grid">
              {Array.from({ length: 25 }, (_, index) => {
                const isLit = highlighted === index && game.phase === "playback";
                const isEnabled = game.phase === "input";

                return (
                  <button
                    key={index}
                    ref={index === 0 ? firstCellRef : undefined}
                    className={"pulse-cell" + (isLit ? " pulse-cell-lit" : "")}
                    type="button"
                    disabled={!isEnabled}
                    aria-label={"Cell " + (index + 1) + ", " + cellCoordinates(index)}
                    onClick={() => handleCell(index)}
                  >
                    <span aria-hidden="true" className="cell-dot" />
                  </button>
                );
              })}
            </div>

            <div className="game-status" role="status" aria-live="polite" aria-atomic="true">
              {description}
            </div>

            <div className="game-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={handleNewGame}
              >
                {game.phase === "lost" ? "Try again" : "New game"}
              </button>
              <button
                className="button button-secondary"
                type="button"
                aria-pressed={showGuide}
                onClick={() => setShowGuide((visible) => !visible)}
              >
                {showGuide ? "Hide sequence guide" : "Show sequence guide"}
              </button>
            </div>

            {showGuide && (
              <div className="sequence-guide">
                <p className="guide-heading">Accessible sequence guide</p>
                <p>
                  Cells in order: {game.sequence.map((cell) =>
                    cellCoordinates(cell),
                  ).join(" → ")}
                </p>
                <p className="guide-note">
                  This optional text guide supports non-visual and low-motion play.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="instructions" aria-labelledby="instructions-heading">
          <h2 id="instructions-heading">How to play</h2>
          <ol>
            <li>Watch the cells light up one by one.</li>
            <li>When it is your turn, select those cells in the same order.</li>
            <li>Each successful round adds a cell to the sequence.</li>
          </ol>
          <p>
            Use a mouse, touch screen, or Tab and Enter/Space on your keyboard.
            A readable sequence guide is available for accessibility.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <span>Independent open-source experiment. Not affiliated with Tectum or CrispMind.</span>
        <a href="https://github.com/fantarick/tet-arcade" target="_blank" rel="noreferrer">
          View source on GitHub ↗
        </a>
      </footer>
    </div>
  );
}
