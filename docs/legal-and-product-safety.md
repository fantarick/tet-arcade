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

## Independent forks and experimental extensions

The source code is released under the [MIT license](../LICENSE). Third parties may fork, modify and distribute it under the license's terms, including preservation of its copyright and permission notices. This upstream product-safety policy governs what the TET Arcade maintainers accept and publish **in this repository**; it does not amend the MIT license or purport to bind independently operated forks.

Developers interested in live wallet connections, real Ethereum RPC, optional 1 TET holder access or other Web3 experiments may explore these ideas in **independently maintained forks**. Such features remain prohibited in this upstream application. A fork is not an upstream-approved experiment, supported integration, official partnership, or legal clearance.

Fork operators are responsible for independently assessing their actual implementation, deployment and jurisdictions, including applicable consumer, gambling/prize promotion, financial/crypto-asset, privacy, security, intellectual-property and minors' requirements. Merely using a separate repository or including a disclaimer does not eliminate legal exposure. Qualified legal/privacy review may be necessary **before** implementing or offering regulated features.

For clarity and to avoid confusion, independent projects are encouraged to use distinct names, visual identities and descriptions; preserve the MIT license notices; avoid unauthorized third-party marks; and clearly state that they are not endorsed, maintained or operated by TET Arcade, Tectum or CrispMind. The MIT software license should not be presented as a trademark license.

Official TET Arcade documentation, releases, PRs and promotional channels must not advertise, endorse, curate or direct users to buy tokens for use in third-party financially integrated forks. Upstream contributors should propose only changes that comply with the free, walletless product baseline.

## Required review gate on every contribution

The PR author must disclose:
1. Whether the change affects payments, purchases, wallets, network access, balances, rewards, rankings, token access, economic incentives or communications about TET.
2. Whether the change introduces personal data processing, telemetry, cookies, external services, minors' data or any new licensing/trademark obligations.
3. Which checks actually ran and which tests, security properties, browsers and legal assumptions remain unverified.

The maintainer must **block the merge** when these disclosures are missing or when a PR contains prohibited/ambiguous functions. A clean CI run and AI review do **not** certify legal compliance. No automatic merging or deployment. Keep changes on review branches until a human owner has accepted the scope and tests.

### Single-maintainer review procedure (Option A)

The GitHub `main` ruleset **must require a pull request**, all relevant passing CI checks (including an up-to-date branch), resolution of review discussions, and protection against force pushes/deletion, with no authorized bypass actors. Set **required approving reviews to 0** while the repository has a single maintainer. This allows the owner to merge without relying on a second, eligible human reviewer.

**This is a deliberate procedural trade-off:** GitHub does not technically require or verify positive human approval when the required approval count is zero. The repository owner must therefore personally inspect every PR and add a dated, written final-review decision to its conversation **before** merging. Record (a) actual changed scope and prohibited-feature checks, (b) the four required CI results on the latest PR head and its alignment with `main`, (c) outstanding security, privacy, license, minors and financial risks, (d) resolution of relevant review threads, and (e) explicit **"Reviewed by maintainer — merge permitted"** or **"Merge blocked"**. A PR-template checkbox or AI-generated review cannot substitute for the owner's decision.

Never merge or deploy automatically. Do not give agents permission to complete the final review or merge. If a trusted second maintainer becomes available later, reconsider a technically enforced required approval of at least one eligible independent reviewer. Documentation alone cannot enforce a human sign-off, and passing CI does not certify legal compliance.

## Public release gate

Before any deployment, verify: free/no-wallet gameplay, independent/accurate branding, third-party license compliance, accessibility, privacy and cookie/storage disclosures where applicable, security/dependency review, terms appropriate to the actual service, any relevant minors' safeguards, and jurisdiction-specific legal advice. Avoid assuming an Italian analysis covers worldwide availability.

**If in doubt, do not ship the feature.** No policy can guarantee zero legal exposure.

## Official reference points

These are background references, **not** a definitive classification of this project:

- [ADM: online games and authorization](https://www.adm.gov.it/portale/faq-giochi)
- [MIMIT: promotional prize initiatives](https://www.mimit.gov.it/it/mercato-e-consumatori/concorrenza-e-commercio/manifestazioni-a-premio)
- [ESMA: MiCA Article 3 service definitions](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-3-definitions)
- [EDPB: Guidelines 02/2025 on blockchain and personal data](https://www.edpb.europa.eu/documents/guideline/guidelines-022025-on-processing-of-personal-data-through-blockchain_it)
