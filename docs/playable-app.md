# Playing Pulse Grid locally

**Status:** Early, un-deployed playable browser prototype. Automated tests exist; manual browser and screen-reader checks are pending.

## Setup

Use a machine with Node.js **22.12+** and npm; the application uses React, TypeScript, and Vite. This project runs without a blockchain account.

```bash
npm ci --ignore-scripts
npm run dev
```

Visit `http://127.0.0.1:5173` **on the host running Vite**. The development and preview servers bind to loopback only; do not use `--host 0.0.0.0` or expose the process through a public tunnel.

Run checks:

```bash
npm test
npm run test:ui
npm run typecheck
npm run build
```

For Happi, complete [the isolated, read-only preflight](https://github.com/fantarick/tet-arcade/issues/2) before any installation or running application services. The CI uses free GitHub-hosted runners; no self-hosted runner or Raspberry Pi service is required.

## User interaction

1. The first round plays two highlighted cells in order on a 5 × 5 grid.
2. When the cells unlock, click/tap or use Tab and Enter/Space to repeat the sequence.
3. Each correct round appends one cell. A wrong cell ends the attempt.
4. Select **New game** or **Try again** to play with a different seed.
5. Use **Show sequence guide** for an optional readable text alternative.

Scores are computed on the user's device. Personal best is stored with optional browser `localStorage` and gracefully falls back when storage is unavailable.

## Automated UI test coverage

`npm run test:ui` uses Vitest with a simulated browser and fake timers. It verifies React Strict Mode playback, input lockout, New game during playback, an accessible sequence guide, scoring, and timeout cleanup. These tests were added following community feedback on PR #11 and do not substitute for manual browser and screen-reader testing.

## Accessibility and limitations

- Semantic grid-cell buttons, visible focus state, clear screen reader status text.
- Optional ordered text guide for the playback sequence.
- Responsive layout and reduced-motion CSS support.
- A screen reader user can use the ordered text guide and select cells via keyboard.
- Playback timing is currently fixed; adjustable speed and broader assistive-technology testing should be considered before a community beta.

## Privacy and Web3

No wallet connection, token transfer, on-chain call, API key, visitor tracking, or third-party backend is present. The user's score remains in the browser. Ethereum TET balance integration is a **later** milestone [#6](https://github.com/fantarick/tet-arcade/issues/6), not a prerequisite for free play.
