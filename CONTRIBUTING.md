# Contributing to TET Arcade

Thank you for your interest in this independent, experimental Web3 gaming project.

## Before contributing

- Read [the product requirements](docs/product-requirements.md), [architecture](docs/architecture.md), and [roadmap](docs/roadmap.md).
- Check [open issues](https://github.com/fantarick/tet-arcade/issues) before starting. For larger changes, open a proposal first.
- Communicate **in English** on issues, pull requests, commits, documentation, UI copy, and code comments.
- Be respectful; follow the [code of conduct](CODE_OF_CONDUCT.md).

## Mandatory non-financial contribution policy

All contributions must follow [the legal/product safety baseline](docs/legal-and-product-safety.md). Public gameplay is **free and walletless**. Do not contribute token-holder access, paid entry, deposits, token transfers, burning, staking, betting, monetary/convertible prizes, prize pools, live-wallet or real-RPC integration, financial promotion, or misleading Tectum affiliation. The existing mock balance reader is for offline tests only.

Disclose any external service, personal-data collection, tracking, wallet capability, financial mechanic, game reward, third-party asset/license, or code path that could activate one. Missing or ambiguous disclosures block review. Passing CI is not legal clearance. A future change of scope requires a separate proposal and qualified legal/privacy review **before coding or release**; maintainer acceptance of an issue alone is not authorization.

## Independent forks and alternative Web3 experiments

The [MIT license](LICENSE) allows independent forks and modified distributions, provided its notice conditions are met. Developers who want to experiment with real wallets, live RPC or a 1 TET holder-only mode may do so in their **own separately maintained projects**, not by submitting such features to the official TET Arcade codebase. This contribution policy does not modify the MIT license or control independently operated forks.

Such work is not approved, hosted, reviewed, maintained or legally cleared by this project. Fork maintainers must evaluate applicable law, privacy, security, third-party rights and potential financial/prize implications themselves. Separate repositories and disclaimers do not automatically eliminate legal risk. We recommend distinct project branding and explicit non-affiliation statements, without suggesting any official Tectum/CrispMind endorsement. No upstream promotion or directory of token-gated forks will be provided.

See [Independent forks and experimental extensions](docs/legal-and-product-safety.md#independent-forks-and-experimental-extensions).

## Working on changes

1. Create a short-lived branch such as `feat/pulse-grid-engine`, `docs/clarify-wallet-flow`, or `fix/game-reset`.
2. Keep commits scoped and use concise imperative English commit subjects.
3. Make changes with tests, accessibility, offline support, and small Raspberry Pi development environments in mind.
4. Run the checks available in the current project state. At M0, use `python3 scripts/validate-foundation.py` and `bash -n scripts/happi-preflight.sh`; later, follow application scripts documented after the scaffold lands.
5. Open a PR and fill in the template. Include actual test evidence and note anything not tested.
6. Wait for human review. Never bypass safety gates or merge your own AI-generated work automatically.

## Proposals

Good issues explain: user problem, proposed behavior, alternatives, acceptance criteria, testing approach, and any blockchain/security implications. Do not introduce token prices, staking, payments, gambling, on-chain prizes, wallet gating, live RPC or external tracking into the application. Discuss speculative changes only in issues; they remain blocked until explicit maintainer authorization after qualified legal/privacy review.

## Security and privacy

Never share seed phrases, private keys, tokens, credentials, unpublished vulnerabilities, or unrelated host logs. Consult [SECURITY.md](SECURITY.md) for reporting guidance.

## Licensing and attribution

Contributions are offered under the repository's [MIT license](LICENSE). Do not submit proprietary or unlicensed assets, third-party brand artwork, or copied code without proper rights and attribution.

TET Arcade is not officially affiliated with Tectum or CrispMind.
