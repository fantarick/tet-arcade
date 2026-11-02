# Pulse Grid — pure game engine

**Status:** Engine implementation (M1), pending review and UI integration.

The core logic is implemented in `src/game/pulse-grid.ts`. It has no browser, wallet, Ethereum, timer, filesystem, dependency, or network imports. It can therefore run in isolation from Happi and from a Web3 provider.

## Rules

- Default board: 25 cells (the UI will arrange them in a 5 × 5 grid).
- An explicit non-cryptographic seed determines a reproducible ordered sequence of 2 cells in round 1.
- The UI displays the sequence and calls `beginInput` after playback finishes.
- The player repeats each cell in order. Duplicate cells in a sequence are allowed.
- A wrong selection immediately changes the attempt to `lost`; the UI can offer restart.
- Completing round `r` awards `10 × r` points and appends one deterministic cell.
- Restart resets round, score and sequence, retaining the personal best in the state provided.
- Tap events during playback or after a loss have no effect.
- The engine creates new state objects rather than modifying existing game state.

The UI must manage animations, input lockout during playback, and accessibility. Scores are local and not authoritative for prizes or competitive outcomes.

## API

```ts
createGame(seed, options?, bestScore?)
beginInput(state)
selectCell(state, cellIndex)
restartGame(state)
```

`GameState.phase` is `playback`, `input`, or `lost`. The UI is responsible for generating a seed where appropriate; tests always provide an explicit seed. No randomness is collected from a wallet. This is **not cryptographically secure randomness**.

## Tests

With Node.js 22 or later:

```bash
node --experimental-strip-types --test tests/game/pulse-grid.test.mjs
```

The tests need no npm dependency installation and run on GitHub-hosted CI. This initial module is designed to be imported into the later React/Vite scaffold; type checking for the complete app is tracked in [issue #3](https://github.com/fantarick/tet-arcade/issues/3).

No blockchain code, token gating, or host service changes are introduced by this engine.
