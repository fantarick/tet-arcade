import assert from "node:assert/strict";
import test from "node:test";
import { beginInput, createGame, restartGame, selectCell } from "../../src/game/pulse-grid.ts";

function completeRound(state) {
  let current = beginInput(state);
  for (const cell of current.sequence) {
    current = selectCell(current, cell);
  }
  return current;
}

test("starts with a deterministic sequence of valid cells and no external input", () => {
  const a = createGame(42);
  const b = createGame(42);
  assert.equal(a.phase, "playback");
  assert.equal(a.round, 1);
  assert.equal(a.score, 0);
  assert.equal(a.bestScore, 0);
  assert.equal(a.sequence.length, 2);
  assert.deepEqual(a.sequence, b.sequence);
  assert.ok(a.sequence.every((cell) => Number.isInteger(cell) && cell >= 0 && cell < 25));
});

test("seed zero is supported and produces deterministic non-degenerate progress", () => {
  const a = createGame(0);
  const b = createGame(0);
  assert.deepEqual(a.sequence, b.sequence);
  assert.notEqual(a.randomState, 0);
});

test("playback ignores input until the UI signals playback completion", () => {
  const state = createGame(123);
  const afterTap = selectCell(state, state.sequence[0]);
  assert.equal(afterTap, state);
  assert.equal(beginInput(state).phase, "input");
});

test("correct choices advance input and then add one cell for the next round", () => {
  const original = createGame(29);
  const input = beginInput(original);
  const partial = selectCell(input, input.sequence[0]);
  assert.equal(partial.phase, "input");
  assert.equal(partial.inputIndex, 1);
  assert.equal(original.inputIndex, 0, "game state must remain immutable");

  const second = selectCell(partial, input.sequence[1]);
  assert.equal(second.phase, "playback");
  assert.equal(second.round, 2);
  assert.equal(second.score, 10);
  assert.equal(second.bestScore, 10);
  assert.equal(second.sequence.length, 3);
  assert.deepEqual(second.sequence.slice(0, 2), original.sequence);
  assert.equal(second.inputIndex, 0);
});

test("a wrong cell ends the attempt and subsequent input cannot change it", () => {
  const ready = beginInput(createGame(1234));
  const incorrect = (ready.sequence[0] + 1) % ready.boardSize;
  const lost = selectCell(ready, incorrect);
  assert.equal(lost.phase, "lost");
  assert.equal(selectCell(lost, ready.sequence[0]), lost);
  assert.equal(beginInput(lost), lost);
});

test("score scales with completed rounds", () => {
  let state = createGame(57);
  state = completeRound(state);
  state = completeRound(state);
  state = completeRound(state);
  assert.equal(state.round, 4);
  assert.equal(state.score, 60);
  assert.equal(state.bestScore, 60);
  assert.equal(state.sequence.length, 5);
});

test("restart preserves the personal best and resets active progress", () => {
  const finished = completeRound(createGame(112));
  const firstSequence = createGame(112).sequence;
  const restarted = restartGame(finished);
  assert.equal(restarted.phase, "playback");
  assert.equal(restarted.round, 1);
  assert.equal(restarted.score, 0);
  assert.equal(restarted.bestScore, 10);
  assert.deepEqual(restarted.sequence, firstSequence);
});

test("custom board size and sequence length produce bounded cells", () => {
  const state = createGame(13, { boardSize: 4, initialSequenceLength: 7 });
  assert.equal(state.sequence.length, 7);
  assert.ok(state.sequence.every((cell) => cell >= 0 && cell < 4));
});

test("invalid seeds, settings and cells fail predictably", () => {
  assert.throws(() => createGame(-1), RangeError);
  assert.throws(() => createGame(Number.NaN), RangeError);
  assert.throws(() => createGame(0x100000000), RangeError);
  assert.throws(() => createGame(1, { boardSize: 0 }), RangeError);
  assert.throws(() => createGame(1, { initialSequenceLength: 0 }), RangeError);
  assert.throws(() => createGame(1, {}, -1), RangeError);
  assert.throws(() => selectCell(createGame(1), 25), RangeError);
});

test("longer deterministic runs remain within board bounds and preserve prefixes", () => {
  let state = createGame(9);
  for (let round = 1; round <= 15; round += 1) {
    const previous = state.sequence.slice();
    state = completeRound(state);
    assert.equal(state.sequence.length, previous.length + 1);
    assert.deepEqual(state.sequence.slice(0, previous.length), previous);
    assert.ok(state.sequence.every((cell) => cell < state.boardSize));
  }
});
