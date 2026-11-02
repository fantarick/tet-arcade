# TET Arcade

**An independent, open-source, free-to-play browser gaming experiment with optional offline, mocked Ethereum research. No token is needed to play.**

> **Project status:** Early browser prototype. The free game is implemented in source, but manual accessibility/browser validation and any public deployment are still pending.

TET Arcade is an experimental collection of browser games. The first game, **Pulse Grid**, is playable for free without any wallet; no blockchain service is required. **All token-holder-only access, live wallet and balance reading, and prize-based modes are on hold pending specialist legal/privacy review and explicit maintainer approval.** The existing TET balance reader is an offline mock-driven research component only.

**Independent project:** TET Arcade is a community experiment, **not** an official Tectum or CrispMind product, endorsement, or partnership. TET Arcade does not issue TET, handle custody, or provide investment advice.

## Why build this?

- Explore game design and isolated, offline blockchain concepts without asking users to purchase or hold any crypto-asset.
- Learn through working software, with public tests and reviewable architectural choices.
- Experiment with AI coding agents while keeping human review, clear documentation, and security boundaries.
- Make it straightforward for developers worldwide to contribute.

A functioning demo would not prove demand for TET, value for its token holders, or any claim about T12 performance.

## Planned experience

| Mode | Wallet | TET required | Status |
| --- | --- | --- | --- |
| Pulse Grid — Free | No | No | Implemented (M1 prototype); manual QA pending |
| Offline mocked TET balance-reader research | No live wallet | No | Isolated test-only component |
| Holder-only challenge | Not approved | Not approved | On hold pending specialist legal/privacy review |

The previously proposed 1 TET threshold is **not authorized for playable access**. There is no pay-to-play mechanism, gambling, prize pool, convertible reward, on-chain game engine or wallet requirement in the approved product. The browser game is independent of blockchain connectivity.

## Blockchain scope

Isolated, **offline mocked research** refers to **Ethereum Mainnet (chain ID 1)** and an existing ERC-20 contract; no live integration into the game is approved:

- Token: Tectum (TET)
- Contract: `0x68A47Fe1CF42eBa4a030a10CD4D6a1031Ca3CA0a`
- Sources: [Tectum's token page](https://tectum.io/tectum-token/) and [Etherscan](https://etherscan.io/token/0x68A47Fe1CF42eBa4a030a10CD4D6a1031Ca3CA0a)
- Reported token decimals: `8`; the implementation must still verify on-chain metadata and compare balances as integers.

**Ethereum is not T12.** This project does not yet integrate with Tectum T12, claim T12 compatibility, or assume T12 supports Ethereum-style contracts. A T12 adapter would require separate documentation, prototypes and verification.

## Technology direction

The prototype uses **React + Vite + TypeScript**, a pure TypeScript game engine, built-in Node.js tests, and GitHub-hosted CI. Viem/Wagmi are **future** options for read-only Ethereum integration, not installed in the current app. See [local playable setup](docs/playable-app.md) and [issue #3](https://github.com/fantarick/tet-arcade/issues/3).

Development is intended to run through **Codex CLI on Happi (Raspberry Pi 5, ARM64)** in an isolated workspace. The machine's existing services are out of scope. See [development setup](docs/development.md) and the [Happi preflight issue](https://github.com/fantarick/tet-arcade/issues/2).

## Roadmap and documentation

- [Mandatory legal and product-safety baseline](docs/legal-and-product-safety.md)
- [Product requirements](docs/product-requirements.md)
- [Architecture and trust boundaries](docs/architecture.md)
- [Mocked, provider-neutral TET balance-reader example](docs/mocked-tet-balance-reader.md)
- [Roadmap](docs/roadmap.md)
- [Development and Happi guidelines](docs/development.md)
- [Architectural decisions](docs/decisions/0001-ethereum-first.md)
- [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Code of conduct](CODE_OF_CONDUCT.md)
- [Agent development instructions](AGENTS.md)
- [GitHub issues](https://github.com/fantarick/tet-arcade/issues)

## Contributing

All published repository content, including discussion on issues and pull requests, is in **English**. Internal conversations with the project owner may be in Italian. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes.

## Mandatory review policy

All contributions, including AI-generated PRs, must comply with [the legal and product-safety baseline](docs/legal-and-product-safety.md): free, walletless gameplay; no financial prizes, token-gated access, real wallet services, asset transactions or claims about token investment performance. Any future financial or wallet feature is **research only** until separately approved following qualified legal/privacy advice. Tests do not establish regulatory compliance.

## Safety

Do not send TET, ETH, private keys, seed phrases, API secrets, or wallet permissions to this project. The MVP must not request token transfers, approvals, staking, or payments. A client-only token gate is a **demonstration**, not secure authorization for valuable services.

## License

[MIT](LICENSE) © 2026 Riccardo Carli.
