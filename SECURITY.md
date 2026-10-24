# Security policy

## Project maturity

TET Arcade is experimental and currently in foundation planning. **No production deployment, audited smart contract, or financial service exists.** Do not entrust funds, wallet secrets, or security-critical workflows to prototype code.

## Scope and controls

- The first blockchain phase is read-only Ethereum ERC-20 balance inspection.
- No wallet transactions, payments, token approvals, custody, staking, bets, or prizes are in scope for M0-M3.
- Never request private keys or seed phrases. Never store wallet secrets or commit credentials.
- Chain ID, token contract address, bigint balance math, and errors must be verified and tested.
- Browser-only token gating is not an authorization mechanism for paid or sensitive features.
- Development servers should be loopback-only. Happi infrastructure and unrelated services must not be modified.
- External RPC providers may see wallet addresses and IP-related metadata; document provider and privacy implications before deployment.

## Reporting a vulnerability

Please **do not** file a public issue with a working exploit, wallet secret, or sensitive disclosure.

Use GitHub private vulnerability reporting **if enabled** for this repository. If that feature is unavailable, contact the maintainer privately through their GitHub profile to agree on a secure disclosure channel. Do not assume an email address or send sensitive payloads to unverified contacts.

General non-sensitive defects may be filed as normal GitHub issues.

## Supported versions

There are no released or supported production versions yet. Security reports about the current experimental branch are still welcome.
