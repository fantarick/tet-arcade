# Agent instructions

These instructions apply to all work on TET Arcade, including changes made by Codex CLI on Happi.

## Language policy

- **Every repository-facing artifact must be in English:** code identifiers, documentation, comments, UI text, issues, PRs, commit messages, workflows, and published status reports.
- Internal dialogue and private progress reporting to the project owner may be in Italian.
- Write accessible, accurate technical English. Explain trade-offs; do not invent results, test runs, deployments, or partnerships.

## Scope and workflow

1. Read `README.md`, `docs/product-requirements.md`, `docs/architecture.md`, `docs/roadmap.md` and applicable ADRs.
2. Associate the change with a GitHub issue. State scope, acceptance criteria, and any open questions in the PR.
3. Keep implementations small and modular; prefer pure, deterministic game logic and lightweight dependencies.
4. Run available checks locally and report exactly which commands ran and their results. If tests could not run, say so explicitly.
5. Work on a feature branch, push changes, and open a reviewable pull request. **Do not merge, deploy, or enable auto-merge.**
6. Never claim a code review or CI pass before the relevant check completes.

## Happi isolation policy

Happi is a Raspberry Pi 5 with existing, unrelated services. Only operate in a dedicated TET Arcade workspace and within permissions explicitly granted to the executing agent.

- First run a **read-only preflight** using `scripts/happi-preflight.sh`; do not assume that Node/npm, local ports, or free resources are available.
- Never modify systemd services, Tailscale, Cloudflare tunnels/routes/DNS, VPN, IPFS, Ollama, or other projects.
- No `sudo`, global package installs, privilege escalation, host firewall changes, or service startup on boot without a separately reviewed issue and approval.
- Bind development servers to loopback by default. Do not add public network exposure or CI runners on Happi.
- Keep heavy browser automation on GitHub-hosted CI when feasible.
- Do not read or echo private files, environment secrets, wallet files, local IP addresses, or unrelated service configuration into issues or logs.
- If prerequisites are missing, stop and propose minimal next steps. Do not silently reconfigure the machine.

## Blockchain and financial safety

- Target Ethereum ERC-20 **read-only integration first**; T12 is exploratory and not assumed EVM-compatible.
- Use the exact intended chain and independently verified token contract; validate chain ID and token metadata.
- Use integer/bigint token units. No floating point for balances or thresholds.
- No private keys, seed phrases, custody, real asset transfers, unlimited approvals, staking, wagers, paid entry, or rewards in M0-M3.
- Do not include live signing transactions in routine tests; use mocks or isolated development chains.
- A browser-only balance gate is not reliable server-side authorization. Do not present it as such.
- Document privacy, RPC reliability, accessibility, dependency and security implications for changes.

## Definition of done

- Implemented against issue acceptance criteria and documented in English.
- Tests and lint/build checks run where relevant, with evidence and failure disclosure.
- No unreviewed modifications to infrastructure or financial flows.
- PR opened for owner review; target branch unchanged.
