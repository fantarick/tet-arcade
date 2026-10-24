# Architecture and trust boundaries

**Status:** Proposed; application code is not yet implemented.

## Separation of concerns

```text
Browser (React + TypeScript)
├── Game UI and accessibility
├── Pure, deterministic Pulse Grid engine
├── Optional wallet UI (M2)
│   └── Ethereum adapter (Wagmi / Viem, read-only)
│       └── External Ethereum JSON-RPC provider
│           └── Ethereum Mainnet ERC-20 TET balanceOf / decimals
└── Local-only, non-financial score and settings
```

The game engine never imports a wallet library or makes HTTP/RPC requests. A missing wallet, chain mismatch, or RPC outage cannot block free gameplay. A future T12 integration would be **another independently evaluated adapter**, not an assumed drop-in replacement.

## Planned repository shape

```text
src/
  game/        # deterministic state and rule modules
  components/  # accessible game presentation
  web3/        # optional chain-specific adapter
  app/         # application wiring
tests/         # pure game tests, mocked wallet tests
docs/          # requirements, decisions, setup
scripts/       # local audit / validation tooling
```

The scaffold in [issue #3](https://github.com/fantarick/tet-arcade/issues/3) may refine this layout before implementation.

## Contracts, chains, and data

- Target chain: Ethereum Mainnet (`1`), **not Tectum T12**.
- Existing token: TET ERC-20 at `0x68A47Fe1CF42eBa4a030a10CD4D6a1031Ca3CA0a`.
- Read-only calls: `balanceOf(address)` and `decimals()`, with minimal ABI.
- Token unit comparisons use bigint integers, e.g. threshold = `10 ** decimals` units for 1 TET. The exponentiation must be performed with bigint operands.
- Reject or explicitly handle a wallet connected to the wrong network. Do not quietly query a different asset with the same name or symbol.
- The selected RPC endpoint is external infrastructure: treat failures, incorrect responses, rate limits, and privacy trade-offs as normal operating conditions.
- Never assume that tokens held by an exchange, custodial account, or another chain are accessible from a connected Ethereum address.

## Trust boundaries

| Boundary | Trusted for | Not trusted for |
| --- | --- | --- |
| Browser UI | Display and local game state | Financial entitlement or protected access |
| Connected wallet | User-selected address/chain claims through provider | Owner identity off-chain or TET custody elsewhere |
| Ethereum RPC | Read-only chain state when independently verified | Uptime, privacy, or perfect availability |
| GitHub Actions | Reproducible CI checks | Proof of financial safety or smart-contract audit |
| Codex CLI | Implementation assistance | Unreviewed merges, live transactions, or host administration |

A future paid or server-protected feature would require a separately designed and reviewed backend with authenticated wallet ownership (e.g. SIWE) and server-side state checks. Nothing like that is approved in the MVP.

## Environment design

- Development target: Happi (Raspberry Pi 5, ARM64) running Codex CLI in a dedicated, permission-limited workspace.
- No change to existing system services, VPN/tunnels, ports, ingress, CI runners, or DNS.
- Start local Vite servers on loopback only; a temporary SSH tunnel may be considered independently for manual preview, without public exposure.
- Run heavyweight browser and build matrix tests primarily on GitHub-hosted CI.
- Never commit `.env`, wallet files, private keys, or credentials. Any browser `VITE_*` values are **public** at build time and must never contain secrets.

## Safety and evolution

1. M0: docs, lightweight checks, Happi read-only preflight.
2. M1: browser-only game; network independent.
3. M2: wallet connection and read-only chain queries.
4. M3: optional client-side gating clearly marked demonstrative.
5. Later: separate review of server authorization, deployment, T12 compatibility, or any financial feature.

See [ADR 0001](decisions/0001-ethereum-first.md), [ADR 0002](decisions/0002-happi-isolation.md), and [ADR 0003](decisions/0003-no-custody.md).
