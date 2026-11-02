# ADR 0001 — Begin with read-only Ethereum ERC-20 integration

- **Status:** Accepted for planning
- **Date:** 2026-10-24

## Context

TET exists as an ERC-20 token on Ethereum. The proposed game only needs token ownership information, not token payments. Tectum T12 may offer different capabilities, but Ethereum and T12 must not be assumed interoperable or EVM-compatible without evidence.

## Decision

Implement the game independently of blockchain. Later, use a read-only Ethereum adapter to inspect the existing TET ERC-20 token on chain ID 1. Do not deploy contracts or claim T12 integration. A T12 experiment requires a separate ADR and validation of SDK, test environment, finality, security model, and development tooling.

## Consequences

- Lower initial implementation and financial risk.
- No proof of T12 speed or throughput from the Ethereum prototype.
- A token-holding requirement is an experiment, not evidence of token utility or investment returns.
