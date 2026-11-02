# ADR 0002 — Use Happi as the coding host without changing existing services

- **Status:** Accepted for planning
- **Date:** 2026-10-24

## Context

Happi is a Raspberry Pi 5 (8 GB RAM, ARM64) that already hosts other services and a Codex CLI environment. Avoid consuming the owner's laptop resources and avoid coupling this experimental game to production-like services.

## Decision

Use Codex CLI on Happi as the primary implementation agent **after a read-only preflight**, with a dedicated limited-permission workspace. Restrict change scope to the repository. Keep browser-heavy automation in GitHub-hosted CI when possible. Do not change host services, networking, DNS, tunnels, or system packages without separate reviewed authorization.

## Consequences

- Low laptop use and reproducible remote development workflow.
- Resource checks and dependency compatibility verification required before implementing the app.
- Repository setup alone does not grant ChatGPT or GitHub remote execution on Happi.
