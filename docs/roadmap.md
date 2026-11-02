# Roadmap

**Status as of November 2026:** M0 foundation and M1 game engine have been merged. The playable browser prototype passes automated CI; manual cross-browser and accessibility QA is still pending. No deployment has occurred.

| Milestone | Outcome | Tracking | Current state |
| --- | --- | --- | --- |
| M0 / Foundation | Specs, agent rules, contribution policies, documentation checks | [#1](https://github.com/fantarick/tet-arcade/issues/1) | Merged via PR #9 |
| M0 / Happi audit | Read-only host audit and isolation plan | [#2](https://github.com/fantarick/tet-arcade/issues/2) | Not started |
| M0 / App scaffold | React/TypeScript baseline, lockfile, hosted CI | [#3](https://github.com/fantarick/tet-arcade/issues/3) | Implemented in PR #11; QA pending |
| M1 / Engine | Deterministic Pulse Grid rules and tests | [#4](https://github.com/fantarick/tet-arcade/issues/4) | Merged via PR #10 |
| M1 / UI | Responsive browser game with Chromium smoke CI | [#5](https://github.com/fantarick/tet-arcade/issues/5) | Merged PRs #11 / #14; manual browser and accessibility checks pending |
| M2 / Web3 | Isolated mocked TET reader; live wallet/RPC on hold | [#6](https://github.com/fantarick/tet-arcade/issues/6) | Mock-only PR #13 merged; no live integration authorized |
| M3 / Token gating | Previously discussed holder challenge | [#7](https://github.com/fantarick/tet-arcade/issues/7) | **On hold, not approved for implementation or release** |
| M4 / Community beta | Contributor onboarding and reviewed release proposal | [#8](https://github.com/fantarick/tet-arcade/issues/8) | Not started |
| M5 / Exploration | Additional games and independently verified T12 research | Future proposal | Not committed |

## Current product scope

The approved release is a **free, non-financial, walletless game**. No purchase, holding or spending of TET is needed. No economic prizes, token promotion or real blockchain service is approved. Follow [the mandatory product safety policy](legal-and-product-safety.md) for every contribution and deployment. Previously proposed M2/M3 functionality is research-only unless a specialist legal/privacy review and explicit maintainer approval authorize a different scope.

## Release gates

Each milestone requires: clearly documented acceptance criteria, relevant automated checks, an English-language PR, and human review. No automated merge, public deployment, financial transactions, or host-configuration change is implied by completing a milestone.

**Stop / reconsider** if the game is not engaging, privacy/security costs outweigh learning value, host resources prove insufficient, or published chain documentation cannot be verified.

## Future research (not commitments)

- Compare independent wallet authentication approaches if true server-side entitlement is ever necessary.
- Explore T12 SDK, node capabilities, and public testnet only after obtaining verifiable developer documentation.
- Add more purely skill-based games if actual players request them.
