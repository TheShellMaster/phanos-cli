# BRIEFING — 2026-10-13T14:05:00Z

## Mission
Refondre l'interface TUI de Phanos sur le socle OpenCode (`base-opencode/packages/tui`) : mascotte pixel-art Mistral-vibe animée ambrée (splash + widget permanent haut-droit), split-screen asymétrique (gauche inspection/contexte, droite discussion + composer suspendu ambré), affichage dynamique d'outils façon Claude Code (badges, durées, accordéons), tout en conservant 100% de la tuyauterie native et en assurant un `bun run typecheck` impeccable.

## 🔒 My Identity
- Archetype: orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1_gen2
- Original parent: Sentinel
- Original parent conversation ID: c0f8fb76-b01b-4420-b644-4653e6028bd7

## 🔒 My Workflow
- **Pattern**: Project Pattern (Dual Track: Implementation Track + E2E Testing Track)
- **Scope document**: /home/theshellpc/Bureau/nouveau-projet/PROJECT.md
1. **Decompose**: Survey & verify state of current modules against R1, R2, R3, R4, generate PROJECT.md, structure milestones.
2. **Dispatch & Execute**:
   - Direct iteration loop: Explorer -> Worker -> Reviewer -> Challenger -> Auditor
3. **On failure**:
   - Retry -> Replace -> Skip -> Redistribute -> Redesign -> Escalate
4. **Succession**: At 16 spawns, write handoff.md, spawn successor.
- **Work items**:
  1. Survey & State Assessment of existing components (R1 Mascot, R2 Layout, R3 Tools, R4 Plumbing) [in-progress: 2/3 complete]
  2. PROJECT.md & Feature Inventory generation [pending Explorer 3 report]
  3. Milestone 1: Mascot Integration & Animation (Splash & Permanent Widget) [pending]
  4. Milestone 2: Asymmetric Split Screen Integration & Wiring [pending]
  5. Milestone 3: Claude Code Dynamic Tools Display Integration [pending]
  6. Milestone 4: Native Plumbing Verification & Full Verification (`bun run typecheck`) [pending]
  7. Final Review, Challenge, and Forensic Integrity Audit [pending]
- **Current phase**: 0 (Survey & Assessment)
- **Current focus**: Awaiting Explorer 3 (Tools & Plumbing) report

## 🔒 Key Constraints
- DISPATCH-ONLY: NEVER write, modify, or create source code files directly.
- NEVER run build/test commands yourself — require workers to do so.
- NEVER investigate or explore the problem at the code level — dispatch Explorers.
- Only edit .md metadata in .agents/teamwork/.
- Auditor is NON-SKIPPABLE. Integrity violation is an immediate binary veto.
- Pass 100% tests and clean `bun run typecheck`.

## Current Parent
- Conversation ID: c0f8fb76-b01b-4420-b644-4653e6028bd7
- Updated: 2026-10-13T13:51:28Z

## Key Decisions Made
- Succeeded orchestrator_1 after network disconnection.
- Heartbeat cron active (task-46).
- Explorer 1 (Mascot R1) completed: identified that mascot components exist and are modular (<105 lines) but 0% wired into `app.tsx` or `session/index.tsx`, with SolidJS reactivity/lifecycle bugs in `useMascotState.ts` and `MascotSplash.tsx`.
- Explorer 2 (Layout R2) completed: identified that `AsymmetricLayout` and `AsymmetricSidebar` exist but 0% wired into `SessionRoute`. 5 modular components needed (`ModelStatusBadge`, `TokenContextMeter`, `SubagentTreeList`, `ActivityHistoryFeed`, `AmberFloatingComposer`).

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_1 | teamwork_preview_explorer | Survey R1 (Mascot) | completed | 7da000ff-8010-4c1a-9b9c-eb65ea3ff186 |
| explorer_2 | teamwork_preview_explorer | Survey R2 (Layout) | completed | c589173e-f53f-44a6-a037-1ed66ae9aa63 |
| explorer_3 | teamwork_preview_explorer | Survey R3/R4 (Tools & Plumbing) | in-progress | 0617c753-364a-4bd5-9f0c-0d4a3ed2c4fa |

## Succession Status
- Succession required: no
- Spawn count: 3 / 16
- Pending subagents: 0617c753-364a-4bd5-9f0c-0d4a3ed2c4fa
- Predecessor: orchestrator_1
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: 93042aa0-9fc5-4ff1-afe6-cebb08094553/task-46
- Safety timer: none
- On succession: kill all timers before spawning successor
- On context truncation: run manage_task(Action="list") — re-create if missing

## Artifact Index
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/ORIGINAL_REQUEST.md — Original User Request
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/CODE_MODULARITY_GUIDELINES.md — Modularity Guidelines
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/CLAUDE_TOOLS_IMPLEMENTATION.md — Claude Tools Implementation
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/SERVER_CONNECTION_REPORT.md — Native Plumbing & Server Connection Report
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/GROUND_TRUTH_SCOUT.md — Ground Truth Scout
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1_gen2/DISPATCH.md — Gen 2 Dispatch log
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1_gen2/BRIEFING.md — Gen 2 Briefing
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1_gen2/progress.md — Gen 2 Progress
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_1/analysis.md — Explorer 1 findings (ready)
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_1/handoff.md — Explorer 1 handoff (ready)
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_2/analysis.md — Explorer 2 findings (ready)
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_2/handoff.md — Explorer 2 handoff (ready)
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_3/analysis.md — Explorer 3 findings (pending)
