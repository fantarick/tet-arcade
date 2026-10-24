# ADR 0003 — No transfers, custody, wagers, or rewards in MVP

- **Status:** Accepted for planning
- **Date:** 2026-10-24

## Context

An experimental game has no justification for exposing users to financial loss, contract allowances, or speculative incentives. A client-side check of a token balance is not meaningful security for valuable access rights.

## Decision

Keep the free game open to everyone. In the optional token mode, request read-only TET balance data on Ethereum Mainnet and make no transaction requests. The proposed initial threshold of 1 TET is configurable and not a charge. Do not handle stakes, payments, deposits, swaps, approval allowances, prizes, prediction-market betting, or real-money rewards.

## Consequences

- No required wallet or token spending to enjoy the core game.
- No direct token revenue and no reliable browser-only paywall.
- Any future financial feature needs a separate threat model, legal assessment, explicit owner approval, and code review.
