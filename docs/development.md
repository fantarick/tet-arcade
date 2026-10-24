# Development workflow and Happi setup

## Current project state

The repository currently contains project documentation and foundation validation tools. **The React application is not yet scaffolded** and there is no `npm install` step to perform at M0. See [issue #3](https://github.com/fantarick/tet-arcade/issues/3).

## Read-only Happi preflight

Happi is the intended primary coding host (Raspberry Pi 5, ARM64). The project owner already runs other workloads there. Do **not** provision or modify any service as part of a read-only assessment.

From a clone of this repository on Happi, after checking out the project foundation branch:

```bash
bash scripts/happi-preflight.sh
```

The script only reports tool availability, platform, available memory and disk capacity, and basic repository status. It is designed not to print secrets, hostnames, IP addresses, or home-directory paths. Review outputs before copying them into a public issue.

Run the foundation checks locally:

```bash
python3 scripts/validate-foundation.py
bash -n scripts/happi-preflight.sh
```

A successful script check is not proof that Happi has enough free resources for the later application build.

## Proposed isolated implementation process

1. Run the audit in [issue #2](https://github.com/fantarick/tet-arcade/issues/2). Never assume Node.js/npm/Codex versions.
2. Choose a dedicated workspace permitted by the existing Happi agent boundary. Do not reuse another project's worktree.
3. Configure Git author identity and remote authentication through already approved mechanisms. Never save secrets into the repository.
4. Work on an issue-specific branch; use Codex CLI to implement small tasks, tests and documentation.
5. Prefer GitHub-hosted CI for resource-intensive browser tests.
6. Open a PR with clear testing evidence and known limitations; wait for human review before merge.

No instruction here authorizes changing the agent's sandbox, running `sudo`, installing global dependencies, opening inbound ports, editing Cloudflare/Tailscale, or deploying services.

## Local preview later

When the application scaffold exists, Vite should bind to `127.0.0.1` by default. A private temporary SSH port-forward may be used for review after a separate check that the port is available. Do not expose a development server over a public tunnel, LAN-wide bind, or DNS record.

## Reporting and language

All GitHub issues, commits, PR descriptions, CI output and repository content are in English. Private operator notes to the owner may be in Italian. Never paste unredacted diagnostic logs containing system or account details into a public issue.
