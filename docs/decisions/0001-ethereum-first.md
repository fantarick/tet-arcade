# ADR 0001 — Begin with read-only Ethereum ERC-20 integration

- **Status:** Partially superseded on 2026-11-03 by [the free-play product-safety baseline](../legal-and-product-safety.md). Historical context only for any live wallet/RPC proposal.
- **Date:** 2026-10-24

## Current decision (2026-11-03)

The independent, walletless browser game remains approved. Only offline, mock-driven, standalone ERC-20 research is currently allowed. The earlier plan to introduce a live read-only Ethereum adapter is **on hold and not authorized for implementation or release** in upstream TET Arcade. Future scope changes require qualified legal/privacy review and explicit maintainer approval. Independently operated MIT-compliant forks are separate projects, not endorsed upstream.

The original decision is preserved below for historical reference and does **not** override the current policy.

## Context

TET exists as an ERC-20 token on Ethereum. The proposed game only needs token ownership information, not token payments. Tectum T12 may offer different capabilities, but Ethereum and T12 must not be assumed interoperable or EVM-compatible without evidence.

## Decision

Implement the game independently of blockchain. Later, use a read-only Ethereum adapter to inspect the existing TET ERC-20 token on chain ID 1. Do not deploy contracts or claim T12 integration. A T12 experiment requires a separate ADR and validation of SDK, test environment, finality, security model, and development tooling.

## Consequences

- Lower initial implementation and financial risk.
- No proof of T12 speed or throughput from the Ethereum prototype.
- A token-holding requirement is an experiment, not evidence of token utility or investment returns.
