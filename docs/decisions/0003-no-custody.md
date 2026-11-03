# ADR 0003 — No transfers, custody, wagers, or rewards in MVP

- **Status:** Partially superseded on 2026-11-03 by [the free-play product-safety baseline](../legal-and-product-safety.md). Historical context only for optional holder mode.
- **Date:** 2026-10-24

## Current decision (2026-11-03)

No custody, payments, wagering or convertible rewards remain allowed in the upstream application. The earlier optional token mode and proposed **1 TET threshold are not approved**. Live wallet, RPC and holder-only features are on hold pending qualified legal/privacy review and an explicit upstream scope decision. Upstream remains free and walletless; MIT-compliant independent forks are not upstream features or endorsements.

The original decision is preserved below as historical context, not an actionable requirement.

## Context

An experimental game has no justification for exposing users to financial loss, contract allowances, or speculative incentives. A client-side check of a token balance is not meaningful security for valuable access rights.

## Decision

Keep the free game open to everyone. In the optional token mode, request read-only TET balance data on Ethereum Mainnet and make no transaction requests. The proposed initial threshold of 1 TET is configurable and not a charge. Do not handle stakes, payments, deposits, swaps, approval allowances, prizes, prediction-market betting, or real-money rewards.

## Consequences

- No required wallet or token spending to enjoy the core game.
- No direct token revenue and no reliable browser-only paywall.
- Any future financial feature needs a separate threat model, legal assessment, explicit owner approval, and code review.
