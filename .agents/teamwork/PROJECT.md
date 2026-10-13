# Project: Phanos TUI Modernization (on OpenCode / OpenTUI)

## Architecture
- Root Workspace: `/home/theshellpc/Bureau/nouveau-projet/base-opencode/packages/tui`
- UI Engine: `@opentui/solid` + `@opentui/core` (terminal box/text flexbox layout)
- Client & Server Plumbing: `@opencode/client`, `@opencode/server`
- Mascot Component System: `packages/tui/src/component/mascot/`
- Layout & Sidebar System: `packages/tui/src/routes/session/layout/`
- Claude Code Tools System: `packages/tui/src/routes/session/tools/`

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Mascot Pixel-Art Canvas & Palette | Half-block UTF-8 terminal character art with amber palette (#FABE3C, #FFCD5A, #C47614) | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Mascot Startup Splash Sequence | Centered awakening, sparkles, greeting animation on TUI startup before transition to main view | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Mascot Persistent Corner Widget | Real-time widget in top-right corner with blinking idle and active thinking/executing expressions | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Asymmetric Split Screen Layout | Two-column asymmetric responsive layout (collapsible under 100 columns) | M2 | ORIGINAL_REQUEST §R2 |
| 5 | Left Inspection Sidebar | Model status, token usage gauge, subagent hierarchy list, and recent activity feed | M2 | ORIGINAL_REQUEST §R2 |
| 6 | Amber Suspended Composer | Floating composer input box with amber accent borders | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Claude Code Tool Badges & Header | High-contrast categorized badges ([Bash], [Read], [Edit], etc.) and clean arguments line | M3 | ORIGINAL_REQUEST §R3 |
| 8 | Amber Spinner & Execution Timer | Fluid amber spinner during execution and exact duration badge upon completion | M3 | ORIGINAL_REQUEST §R3 |
| 9 | Interactive Tool Accordions | Collapsible/expandable accordions for tool output details (diffs, logs) without clutter | M3 | ORIGINAL_REQUEST §R3 |
| 10| Full Typecheck & Build Cleanliness | Strict TypeScript verification passing with 0 errors (`bun run typecheck`) | M4 | ORIGINAL_REQUEST §R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Mascotte Cyber Pixel-Art Fixes & Wiring | Fix SolidJS reactivity & timers in `mascot/`, wire `MascotSplash` into `src/app.tsx`, wire `MascotWidget` into session header | none | IN_PROGRESS |
| M2 | Asymmetric Split Screen & Sidebar | Enhance `layout/` components, wire `AsymmetricLayout` and `AsymmetricSidebar` into `routes/session/index.tsx` | none | PLANNED |
| M3 | Claude Code Dynamic Tools Wiring | Wire `ClaudeToolPart` into `message-parts.tsx` / `session/index.tsx`, ensure clean category views | none | PLANNED |
| M4 | Integration & Clean Typecheck | Execute `bun run typecheck`, fix all type/import errors, verify zero regression | M1, M2, M3 | PLANNED |
| M5 | Quality Gates & Audit | Independent Review (2 Reviewers), Empirical Challenge (2 Challengers), Forensic Audit | M4 | PLANNED |

## Interface Contracts
### Mascot ↔ App & Session Header
- `MascotSplashProps`: `{ onComplete?: () => void, durationMs?: number }`
- `MascotWidgetProps`: `{ mood?: MascotMood }` where `MascotMood = "idle" | "thinking" | "executing" | "greeting"`

### Layout ↔ Session Index
- `AsymmetricLayoutProps`: `{ sidebar: JSX.Element, main: JSX.Element, mascotHeader?: JSX.Element, sidebarWidth?: number }`
- `AsymmetricSidebarProps`: `{ modelName?: string, tokensUsed?: string, activeToolsCount?: number, subagents?: any[], activities?: any[] }`

### Tools ↔ Session Message Parts
- `ClaudeToolPartProps`: `{ part: SessionMessageAssistantTool, isLast?: boolean }`
- Exported via `packages/tui/src/routes/session/tools/index.ts`

## Code Layout
- `packages/tui/src/component/mascot/` — R1 components (types, matrix, palette, canvas, splash, widget)
- `packages/tui/src/routes/session/layout/` — R2 layout components (AsymmetricLayout, AsymmetricSidebar, sub-widgets)
- `packages/tui/src/routes/session/tools/` — R3 Claude tools components (ClaudeToolPart, badges, views)
- `packages/tui/src/app.tsx` — App entry point with startup splash sequence
- `packages/tui/src/routes/session/index.tsx` — Main session view integrating layout, widget, and tools
- `packages/tui/src/routes/session/message-parts.tsx` — Message parts rendering delegating to ClaudeToolPart
