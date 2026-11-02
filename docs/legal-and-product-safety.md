# Legal and product safety baseline

**Status: mandatory project policy; not a legal opinion or authorization.**
**Scope: every issue, pull request, AI-agent change, release and contributor.**
Tracking: [#15](https://github.com/fantarick/tet-arcade/issues/15).

## Approved product: free, non-financial gameplay

- All playable modes are free: no account, wallet, token purchase, token holdings, entry fee, deposit or transaction is required to play.
- No financial or convertible prizes, pools, raffles, paid tournaments, wagering, loot boxes with economic value, paid leaderboards, token distribution, burning, staking, custody, approvals, signing or transfers.
- Local scores, purely in-game progress, and non-transferable recognition with **no cash value, tradeability or entitlement** are permitted. Do not launch prize competitions or promotional campaigns without review.
- No calls to buy/hold/sell TET, price-support strategies, investment-return claims, token-performance predictions or suggestions of an official Tectum/CrispMind affiliation.
- Prefer local-only, privacy-minimizing play. Do not add accounts, behavioral analytics, cookies, wallet/address collection, RPC tracking, advertising, children's data processing, or remote scoreboards without a documented necessity, privacy review and maintainer approval.
- Do not add unlicensed assets, logos, music or third-party content; preserve the project's independent branding.

## Blockchain research is isolated, never an access prerequisite

- The provider-neutral mocked balance reader from PR #13 is permitted **only as a non-production, standalone, offline, no-live-transport educational test component**.
- A real wallet connection, real balance lookup, holder-only gameplay, Ethereum RPC, live chain interaction, smart contracts and wallet-based identity are **not approved for the shipped application**.
- Previously discussed M2/M3 features and the proposed 1 TET gate are on hold; an issue, passing CI, a mock or a contributor proposal does not authorize their release.
- Do not add a feature flag, hidden pathway or dependency that activates prohibited financial functionality in a production bundle.
- Any exceptional proposal requires a separate issue, a written risk assessment, specialist Italian/EU legal and privacy review as appropriate, and explicit maintainer approval **before implementation or deployment**.

## Required review gate on every contribution

The PR author must disclose:
1. Whether the change affects payments, purchases, wallets, network access, balances, rewards, rankings, token access, economic incentives or communications about TET.
2. Whether the change introduces personal data processing, telemetry, cookies, external services, minors' data or any new licensing/trademark obligations.
3. Which checks actually ran and which tests, security properties, browsers and legal assumptions remain unverified.

The maintainer must **block the merge** when these disclosures are missing or when a PR contains prohibited/ambiguous functions. A clean CI run and AI review do **not** certify legal compliance. No automatic merging or deployment. Keep changes on review branches until a human owner has accepted the scope and tests.

Configure GitHub `main` ruleset/branch protection to require a pull request, non-bypassable human approval and relevant passing checks; restrict direct pushes and force pushes where available. Repository documents alone cannot enforce this gate.

## Public release gate

Before any deployment, verify: free/no-wallet gameplay, independent/accurate branding, third-party license compliance, accessibility, privacy and cookie/storage disclosures where applicable, security/dependency review, terms appropriate to the actual service, any relevant minors' safeguards, and jurisdiction-specific legal advice. Avoid assuming an Italian analysis covers worldwide availability.

**If in doubt, do not ship the feature.** No policy can guarantee zero legal exposure.

## Official reference points

These are background references, **not** a definitive classification of this project:

- [ADM: online games and authorization](https://www.adm.gov.it/portale/faq-giochi)
- [MIMIT: promotional prize initiatives](https://www.mimit.gov.it/it/mercato-e-consumatori/concorrenza-e-commercio/manifestazioni-a-premio)
- [ESMA: MiCA Article 3 service definitions](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-3-definitions)
- [EDPB: Guidelines 02/2025 on blockchain and personal data](https://www.edpb.europa.eu/documents/guideline/guidelines-022025-on-processing-of-personal-data-through-blockchain_it)
