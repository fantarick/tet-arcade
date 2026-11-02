# TET Arcade

**An independent, open-source Web3 gaming playground exploring TET (ERC-20) token-gated games and agent-assisted development.**

> **Project status:** Foundation / planning (M0). There is no playable release or live deployment yet.

TET Arcade is an experimental collection of browser games. The first game, **Pulse Grid**, will be playable for free and offline. In a later phase, an optional **TET Challenge** mode may check an Ethereum wallet's TET balance without asking anyone to spend, deposit, or stake tokens.

**Independent project:** TET Arcade is a community experiment, **not** an official Tectum or CrispMind product, endorsement, or partnership. TET Arcade does not issue TET, handle custody, or provide investment advice.

## Why build this?

- Explore a concrete, limited use case for an existing ERC-20 token.
- Learn through working software, with public tests and reviewable architectural choices.
- Experiment with AI coding agents while keeping human review, clear documentation, and security boundaries.
- Make it straightforward for developers worldwide to contribute.

A functioning demo would not prove demand for TET, value for its token holders, or any claim about T12 performance.

## Planned experience

| Mode | Wallet | TET required | Status |
| --- | --- | --- | --- |
| Pulse Grid — Free | No | No | Planned (M1) |
| Connect wallet and inspect TET balance | Optional | No | Planned (M2) |
| Pulse Grid — TET Challenge | Yes | Experimental threshold: 1 TET held | Planned (M3) |

The proposed threshold is configurable and **not** a price. There is no pay-to-play mechanism, gambling, prize pool, or on-chain game engine in the MVP. The browser can run the game without blockchain connectivity.

## Blockchain scope

The first integration targets **Ethereum Mainnet (chain ID 1)** and an existing ERC-20 contract:

- Token: Tectum (TET)
- Contract: `0x68A47Fe1CF42eBa4a030a10CD4D6a1031Ca3CA0a`
- Sources: [Tectum's token page](https://tectum.io/tectum-token/) and [Etherscan](https://etherscan.io/token/0x68A47Fe1CF42eBa4a030a10CD4D6a1031Ca3CA0a)
- Reported token decimals: `8`; the implementation must still verify on-chain metadata and compare balances as integers.

**Ethereum is not T12.** This project does not yet integrate with Tectum T12, claim T12 compatibility, or assume T12 supports Ethereum-style contracts. A T12 adapter would require separate documentation, prototypes and verification.

## Technology direction

Planned: React + Vite + TypeScript for the application, a pure TypeScript game engine, Viem/Wagmi for future read-only Ethereum integration, Vitest for unit tests, and GitHub-hosted CI. The application scaffold has **not** been committed yet; see [issue #3](https://github.com/fantarick/tet-arcade/issues/3). No package installation is necessary to review the current foundation.

Development is intended to run through **Codex CLI on Happi (Raspberry Pi 5, ARM64)** in an isolated workspace. The machine's existing services are out of scope. See [development setup](docs/development.md) and the [Happi preflight issue](https://github.com/fantarick/tet-arcade/issues/2).

## Roadmap and documentation

- [Product requirements](docs/product-requirements.md)
- [Architecture and trust boundaries](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Development and Happi guidelines](docs/development.md)
- [Architectural decisions](docs/decisions/0001-ethereum-first.md)
- [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Code of conduct](CODE_OF_CONDUCT.md)
- [Agent development instructions](AGENTS.md)
- [GitHub issues](https://github.com/fantarick/tet-arcade/issues)

## Contributing

All published repository content, including discussion on issues and pull requests, is in **English**. Internal conversations with the project owner may be in Italian. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes.

## Safety

Do not send TET, ETH, private keys, seed phrases, API secrets, or wallet permissions to this project. The MVP must not request token transfers, approvals, staking, or payments. A client-only token gate is a **demonstration**, not secure authorization for valuable services.

## License

[MIT](LICENSE) © 2026 Riccardo Carli.
