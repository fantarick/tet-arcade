# Product requirements: TET Arcade

**Status:** Free-game MVP approved; financial/token-gated features paused as of November 2026. See [mandatory legal/product safety policy](legal-and-product-safety.md). These are product requirements, not legal authorizations.

## Problem and hypothesis

Developers and TET holders currently lack a small, independent, documented game experiment that demonstrates read-only ERC-20 ownership gating. The hypothesis is that a fun, free, walletless game plus isolated, offline blockchain research can attract meaningful technical feedback without requiring token purchase, ownership, spending or relying on T12 capabilities that have not been validated.

This experiment must not be presented as evidence of token investment value or sustainable token demand.

## Users

1. **Casual player:** plays without a wallet and without network connectivity once the app has loaded.
2. **Offline technical researcher:** can test mock ERC-20 balance-reader behavior without real wallet connection, network calls or user holdings.
3. **Community developer:** can run, test, modify, and extend the project using English-language documentation.
4. **Project maintainer:** can review contributions, tests, risks, and deployment proposals.

## First game: Pulse Grid

- A 5×5 grid displays an **ordered sequence** of highlighted cells.
- After playback, the player repeats the same ordered sequence by selecting cells.
- A correctly repeated sequence advances the round; difficulty grows gradually with sequence length and/or timing.
- An incorrect selection clearly ends the attempt or triggers a documented retry policy.
- A score and local personal best are displayed; restart resets the active attempt.
- The pure game engine can be tested with a deterministic random seed; timing and rendering live outside it.
- The default mode is playable without a wallet and without any blockchain calls.
- Input must support keyboard, pointer, and touch; color must not be the only indicator.
- Respect reduced-motion settings, clear focus indicators, contrast and screen-reader labels.

The exact score formula, presentation timings, and failure/retry rule must be documented and covered by tests before M1 is accepted.

## Previously proposed TET Challenge (M3) — ON HOLD, NOT APPROVED

**Do not implement, enable or deploy any of the earlier experimental ideas in this section.** Holder-only game access, live wallet integration and real balance lookups require a separate professional legal/privacy review and explicit written maintainer approval; even holding a token without spending it is not automatically a free entry. The allowed standalone balance reader is **mock-only and isolated**.

- Wallet connection is **optional**; free play remains permanently available.
- Ethereum Mainnet only (chain ID `1`) for real TET balance inspection.
- Token contract: `0x68A47Fe1CF42eBa4a030a10CD4D6a1031Ca3CA0a` ([issuer source](https://tectum.io/tectum-token/), [chain explorer](https://etherscan.io/token/0x68A47Fe1CF42eBa4a030a10CD4D6a1031Ca3CA0a)).
- Proposed initial threshold: `1 TET` held, controlled by configuration, not a purchase price.
- Use `balanceOf` and `decimals` with bigint/integer units (the explorer reports 8 decimals); do not use floating-point balance comparisons.
- Show clear states for no wallet, rejected connection, wrong network, RPC unavailable, no TET, below threshold, and eligible.
- The browser-side gate is **demonstrative only**; users can bypass frontend controls. Never attach valuable assets or privileged operations to it.
- No token buying prompts, transfer requests, approvals, fees, staking, gambling, or monetary rewards.

## Success and measurement

The experiment is worth continuing if:
- New contributors can reproduce the application from the published instructions.
- Players can finish a free game and understand the rules without wallet setup.
- Feedback identifies at least one convincing reason to replay the free game.
- Automated tests cover the game engine and, separately, mocked balance-reader failure paths.

Do not fabricate adoption numbers or confuse GitHub stars, token holdings, or code generation speed with product-market fit.

## Non-goals

- T12 integration or performance benchmarks.
- Writing/deploying a token or payment smart contract.
- A prediction market, wagering, NFT issuance, staking, a token sale, investment promotion, or custody.
- A production-grade paywall or competitive prize leaderboard.
- Authentication or server-side persistence during the initial MVP.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Token-gated feature might create legal or privacy exposure | Keep token gating on hold; prioritize fully free, walletless play |
| Browser gate can be bypassed | Treat only as demo; introduce server validation only if real authorization is needed |
| Wallet/phishing concerns | No signing transactions, no secret requests, visible chain/contract source |
| RPC outages or wrong network | Graceful failure and no impact on free play |
| AI-generated defects | Deterministic tests, human PR review, small changes |
| Resource contention on Happi | Read-only preflight and GitHub-hosted heavy CI |
| Misleading T12 claims | Explicitly separate Ethereum and future T12 research |

## Milestone acceptance

See [roadmap](roadmap.md), [architecture](architecture.md), and linked [issues](https://github.com/fantarick/tet-arcade/issues).
