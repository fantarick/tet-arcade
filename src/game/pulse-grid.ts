/**
 * Pulse Grid's pure, deterministic game rules.
 *
 * No timers, browser APIs, wallet providers, network access, or blockchain calls
 * belong in this module. The UI owns the playback animation and input timing.
 */
export type GamePhase = "playback" | "input" | "lost";

export type GameConfig = Readonly<{
  boardSize?: number;
  initialSequenceLength?: number;
}>;

export type GameState = Readonly<{
  phase: GamePhase;
  boardSize: number;
  initialSequenceLength: number;
  initialSeed: number;
  randomState: number;
  round: number;
  score: number;
  bestScore: number;
  sequence: readonly number[];
  inputIndex: number;
}>;

const DEFAULT_BOARD_SIZE = 25;
const DEFAULT_INITIAL_LENGTH = 2;
// Xorshift32 gets stuck at zero; a fixed nonzero replacement makes seed 0 valid.
const ZERO_SEED_REPLACEMENT = 0x6d2b79f5;

function integerWithin(name: string, value: number, minimum: number, maximum: number): void {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be an integer between ${minimum} and ${maximum}`);
  }
}

function nextRandom(seed: number): number {
  let x = seed >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function drawCell(randomState: number, boardSize: number): {
  cell: number;
  nextState: number;
} {
  const nextState = nextRandom(randomState);
  return { cell: nextState % boardSize, nextState };
}

/**
 * Construct a game from an explicit seed. The RNG is deterministic for testing
 * and gameplay reproducibility, not cryptographically secure.
 */
export function createGame(
  seed: number,
  config: GameConfig = {},
  bestScore = 0,
): GameState {
  integerWithin("seed", seed, 0, 0xffffffff);

  const boardSize = config.boardSize ?? DEFAULT_BOARD_SIZE;
  const initialSequenceLength = config.initialSequenceLength ?? DEFAULT_INITIAL_LENGTH;
  integerWithin("boardSize", boardSize, 2, 100);
  integerWithin("initialSequenceLength", initialSequenceLength, 1, 100);
  integerWithin("bestScore", bestScore, 0, Number.MAX_SAFE_INTEGER);

  const initialSeed = seed === 0 ? ZERO_SEED_REPLACEMENT : seed >>> 0;
  let randomState = initialSeed;
  const sequence: number[] = [];

  for (let i = 0; i < initialSequenceLength; i += 1) {
    const result = drawCell(randomState, boardSize);
    randomState = result.nextState;
    sequence.push(result.cell);
  }

  return {
    phase: "playback",
    boardSize,
    initialSequenceLength,
    initialSeed,
    randomState,
    round: 1,
    score: 0,
    bestScore,
    sequence,
    inputIndex: 0,
  };
}

/** Called by the UI once the entire sequence has finished playing. */
export function beginInput(state: GameState): GameState {
  return state.phase === "playback" ? { ...state, phase: "input" } : state;
}

/**
 * Process a player's cell choice. Wrong choices end the attempt; completing a
 * sequence awards 10 * completedRound points, then appends one new cell.
 * Choices are ignored outside the input phase.
 */
export function selectCell(state: GameState, cell: number): GameState {
  integerWithin("cell", cell, 0, state.boardSize - 1);

  if (state.phase !== "input") {
    return state;
  }

  if (state.sequence[state.inputIndex] !== cell) {
    return { ...state, phase: "lost" };
  }

  const nextIndex = state.inputIndex + 1;
  if (nextIndex < state.sequence.length) {
    return { ...state, inputIndex: nextIndex };
  }

  const points = state.round * 10;
  const nextScore = state.score + points;
  if (!Number.isSafeInteger(nextScore)) {
    throw new RangeError("score exceeds the supported integer range");
  }

  const result = drawCell(state.randomState, state.boardSize);

  return {
    ...state,
    phase: "playback",
    round: state.round + 1,
    score: nextScore,
    bestScore: Math.max(state.bestScore, nextScore),
    sequence: [...state.sequence, result.cell],
    randomState: result.nextState,
    inputIndex: 0,
  };
}

/** Start over with the original seed, preserving the personal best score. */
export function restartGame(state: GameState): GameState {
  return createGame(
    state.initialSeed,
    { boardSize: state.boardSize, initialSequenceLength: state.initialSequenceLength },
    state.bestScore,
  );
}
