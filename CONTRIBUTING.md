# Contributing to TET Arcade

Thank you for your interest in this independent, experimental Web3 gaming project.

## Before contributing

- Read [the product requirements](docs/product-requirements.md), [architecture](docs/architecture.md), and [roadmap](docs/roadmap.md).
- Check [open issues](https://github.com/fantarick/tet-arcade/issues) before starting. For larger changes, open a proposal first.
- Communicate **in English** on issues, pull requests, commits, documentation, UI copy, and code comments.
- Be respectful; follow the [code of conduct](CODE_OF_CONDUCT.md).

## Working on changes

1. Create a short-lived branch such as `feat/pulse-grid-engine`, `docs/clarify-wallet-flow`, or `fix/game-reset`.
2. Keep commits scoped and use concise imperative English commit subjects.
3. Make changes with tests, accessibility, offline support, and small Raspberry Pi development environments in mind.
4. Run the checks available in the current project state. At M0, use `python3 scripts/validate-foundation.py` and `bash -n scripts/happi-preflight.sh`; later, follow application scripts documented after the scaffold lands.
5. Open a PR and fill in the template. Include actual test evidence and note anything not tested.
6. Wait for human review. Never bypass safety gates or merge your own AI-generated work automatically.

## Proposals

Good issues explain: user problem, proposed behavior, alternatives, acceptance criteria, testing approach, and any blockchain/security implications. Please do not introduce token prices, staking, payments, gambling, on-chain prizes, or external tracking without a separately approved proposal.

## Security and privacy

Never share seed phrases, private keys, tokens, credentials, unpublished vulnerabilities, or unrelated host logs. Consult [SECURITY.md](SECURITY.md) for reporting guidance.

## Licensing and attribution

Contributions are offered under the repository's [MIT license](LICENSE). Do not submit proprietary or unlicensed assets, third-party brand artwork, or copied code without proper rights and attribution.

TET Arcade is not officially affiliated with Tectum or CrispMind.
