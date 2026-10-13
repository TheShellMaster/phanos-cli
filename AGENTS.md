# PHANOS CLI — Agent Instructions

This repository contains two distinct components:

## Repository Structure

```
nouveau-projet/
├── phanos/                 # 🚀 CLI Launcher & Distribution (@cypher/phanos)
│   ├── bin/phanos.mjs      # Global `phanos` binary entrypoint
│   ├── theme/phanos.json   # Ambre/Or semantic theme for OpenCode
│   └── package.json        # npm link target for `phanos` command
│
├── base-phanos/            # ⚙️ OpenCode Fork — Main monorepo (packages/, services/, etc.)
│   ├── AGENTS.md           # ← Primary development guidance (READ THIS)
│   ├── packages/           # Core, Server, Protocol, CLI, TUI, plugins, etc.
│   ├── services/           # www, stats, console, etc.
│   └── package.json        # Bun workspaces root
│
└── .agents/                # Architecture docs & multi-agent system design
```

## Quick Start

### Run the CLI (phanos)
```bash
cd phanos && npm link      # One-time setup
phanos                     # Launch from anywhere
```
- `phanos` auto-installs the `phanos.json` theme to `~/.config/opencode/themes/`
- Sets `theme: "phanos"` in `~/.config/opencode/opencode.json`
- Delegates all commands to globally installed `opencode` binary
- Passes through: `run`, `serve`, `models`, `providers`, `auth`, `agent`, `session`, `mcp`, `stats`, `debug`, `attach`, `completion`, `upgrade`, `export`, `import`
- `phanos web` → not supported yet
- `phanos uninstall [--all|--full]` → removes theme/config; `--all` also uninstalls npm packages

### Develop on base-phanos (OpenCode engine)
```bash
cd base-phanos
bun run check              # Full lint + typecheck (canonical verification)
bun run dev                # Run CLI from source
bun run dev:live /path     # Test TUI against live opencode server
bun run typecheck          # From package dir (e.g. packages/core)
```

## Key Conventions (from base-phanos/AGENTS.md)

- **Default branch**: `dev` — base worktrees on `origin/dev`, target PRs at `dev`
- **Branch names**: ≤3 words, hyphenated, no slashes or `feat/` prefixes
- **Commits/PRs**: `type(scope): summary` — types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`
- **Style**: No `try/catch`, no `any`, prefer `const` + ternaries, early returns over `else`, inline single-use values, dot notation over destructuring, no aliased/star imports
- **Dependencies**: Schema → Core/Protocol → Server; Client may use Schema/Protocol only; `sdk` composes all
- **Tests**: Run from package dirs (e.g. `packages/core`), not repo root
- **Generated code**: After changing Protocol/Server `HttpApi`, run `bun run generate` in `packages/client`

## phanos/ Specifics

- Single-file CLI (`bin/phanos.mjs`) — minimal, no build step
- Theme: `theme/phanos.json` — semantic tokens (ambre/or palette)
- Version: `0.0.1` — bump in `phanos/package.json` when releasing
- Requires `opencode-ai` installed globally (`npm i -g opencode-ai`)

## When Working Here

| Task | Where |
|------|-------|
| Modify CLI launcher, theme, install flow | `phanos/` |
| Modify TUI, core, server, protocol, plugins | `base-phanos/packages/` |
| Modify web/desktop/console apps | `base-phanos/packages/app`, `desktop`, `console` |
| Modify services (www, stats) | `base-phanos/services/` |
| Run full verification | `base-phanos/` → `bun run check` |

**Always read `base-phanos/AGENTS.md` first** — it contains the complete style guide, testing rules, session architecture, and TUI development workflows.