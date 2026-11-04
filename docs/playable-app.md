# Playing Pulse Grid locally

**Status:** Early, un-deployed playable browser prototype. Automated tests exist; manual browser and screen-reader checks are pending.

## Setup

Use a machine with Git, Node.js **22.12+** and npm; the application uses React, TypeScript, and Vite. The Node.js requirement matches `package.json`; application CI uses Node.js 22. No blockchain account, wallet, token, API key or private service is required.

Start from a fresh clone and check the tools available in your shell:

```bash
git clone https://github.com/fantarick/tet-arcade.git
cd tet-arcade
node --version
npm --version
```

On Happi, run `bash scripts/happi-preflight.sh` in the dedicated clone **before installing dependencies or starting the application**. Follow [the isolation guidelines](development.md) and [the preflight issue](https://github.com/fantarick/tet-arcade/issues/2); do not change host packages or services to resolve missing prerequisites.

Once the prerequisites are available, install the dependencies pinned in the lockfile:

```bash
npm ci --ignore-scripts
```

Run checks:

```bash
npm test
npm run test:ui
npm run typecheck
npm run build
```

For local gameplay, run `npm run dev` and visit `http://127.0.0.1:5173` **on the host running Vite**. The development and preview servers bind to loopback only; do not use `--host 0.0.0.0` or expose the process through a public tunnel.

The CI uses free GitHub-hosted runners; no self-hosted runner or Raspberry Pi service is required. See [browser smoke checks](browser-smoke.md) for the separate Chromium smoke-test tooling; it is not needed for the checks above.

## Missing prerequisites and reporting results

If `node --version` reports a version below 22.12, or `npm --version` fails, stop before dependency installation and application checks. Use an already provisioned compatible contributor machine, or ask the host owner to review a separate setup proposal. Do not use global package installs or change Happi configuration as an onboarding workaround.

Documentation checks need only Python 3 and Bash:

```bash
python3 scripts/validate-foundation.py
bash -n scripts/happi-preflight.sh
```

When reporting an onboarding run, include the source commit, OS/architecture, Node/npm versions, exact commands and observed outcomes. Mark blocked or unexecuted commands explicitly; documentation checks or GitHub-hosted CI results do not establish that a local application dry run succeeded. Do not include private paths, credentials or unrelated host details.

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

No wallet connection, token transfer, on-chain call, API key, visitor tracking, or third-party backend is present. The user's score remains in the browser. Live Ethereum wallet and TET balance integration ([#6](https://github.com/fantarick/tet-arcade/issues/6)) is **ON HOLD — NOT AUTHORIZED** for implementation or release in the upstream game under [the mandatory product-safety policy](legal-and-product-safety.md). The standalone balance reader is for isolated, offline mocked tests only; it is not connected to the playable app. Free play requires no wallet or TET holdings.
