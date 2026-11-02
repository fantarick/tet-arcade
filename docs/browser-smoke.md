# Real-browser smoke testing

The baseline Pulse Grid game is designed to run with no wallet, tokens, analytics,
backends or public network endpoint. The smoke test in
[\`scripts/browser-smoke.mjs\`](../scripts/browser-smoke.mjs) launches the local
Vite server on **127.0.0.1 only** and exercises it in headless Chromium.

## Automated coverage

The GitHub-hosted [browser-smoke workflow](../.github/workflows/browser-smoke.yml)
runs independently of the existing unit tests, TypeScript build and React
component tests. It validates:

- All 25 cells are present and locked until the sequence finishes.
- Correct replay advances the round and score.
- Restart during the next playback resets progress and preserves personal best.
- A wrong answer ends the attempt and allows retry.
- No horizontal page overflow at 320, 390, 768 or 1280 CSS pixels.
- The first cell gains focus when input unlocks, Tab advances focus, and
  Enter/Space activate cells.
- \`prefers-reduced-motion: reduce\` suppresses cell transition animations.
- No uncaught browser JavaScript errors or requests to external endpoints.

Tests run with browser-generated synthetic game sequences and no real accounts,
token holdings or RPC services. The sequence guide provides a deterministic way
for the tests to select cells without knowing the random seed.

## Local reproduction (optional)

The required CI browser tooling is installed **ephemerally**, not added to the
application's production dependencies or lockfile:

\`\`\`bash
npm ci --ignore-scripts --no-audit --no-fund
npm install --no-save --no-package-lock --ignore-scripts --no-audit --no-fund playwright@1.56.0
npx --no-install playwright install chromium
node scripts/browser-smoke.mjs
\`\`\`

The GitHub-hosted job also installs missing Chromium OS packages through
Playwright's \`--with-deps\` option. Do **not** install browser packages globally
or run the GitHub-hosted system-setup command on Happi; the Pi is outside the
scope of this test. The script itself never changes services or binds a public
port.

## Outstanding human acceptance

Browser smoke checks are **not** a real accessibility audit. Before closing
[UI issue #5](https://github.com/fantarick/tet-arcade/issues/5), manually
verify the game using Firefox and Safari/WebKit, a keyboard-only session,
screen readers and real mobile devices. Record observed behavior and browser
versions. Production deployment is a separate decision.
