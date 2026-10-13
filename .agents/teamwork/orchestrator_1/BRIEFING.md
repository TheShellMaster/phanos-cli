# BRIEFING — 2026-10-13T13:17:00Z

## Mission
Refondre l'interface TUI de Phanos sur le socle OpenCode (`base-opencode/packages/tui`) : mascotte pixel-art Mistral-vibe animée ambrée (splash + widget permanent haut-droit), split-screen asymétrique (gauche inspection/contexte, droite discussion + composer ambré), affichage dynamique d'outils façon Claude Code (badges, durées, accordéons), tout en conservant 100% de la tuyauterie native et en assurant `bun run typecheck` propre.

## 🔒 My Identity
- Archetype: orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1
- Original parent: Sentinel
- Original parent conversation ID: c0f8fb76-b01b-4420-b644-4653e6028bd7

## 🔒 My Workflow
- **Pattern**: Project Pattern (Dual Track: Implementation Track + E2E Testing Track)
- **Scope document**: /home/theshellpc/Bureau/nouveau-projet/PROJECT.md
1. **Decompose**: Survey codebase with 3 Explorers, extract feature inventory, structure milestones (R1 Mascot, R2 Split-screen layout, R3 Claude-Code style tool display, R4 Native plumbing & verification).
2. **Dispatch & Execute**:
   - Implementation Track: Sequential milestones with sub-orchestrators / iteration loop (Explorer -> Worker -> Reviewer -> Challenger -> Auditor).
   - E2E Testing Track: Parallel opaque-box test infra & suites, producing TEST_READY.md.
3. **On failure**: Retry -> Replace -> Skip -> Redistribute -> Redesign -> Escalate (Project Orchestrator redesigns).
4. **Succession**: At spawn count >= 16 and all subagents complete, write handoff.md, spawn successor.
- **Work items**:
  1. Survey & Architecture Mapping [in-progress]
  2. E2E Test Suite & Test Infra [pending]
  3. Milestone 1: Compagnon Pixel-Art (Splash & Widget Haut-Droit) [pending]
  4. Milestone 2: Layout Asymétrique Split Screen [pending]
  5. Milestone 3: Affichage Dynamique des Outils Claude Code [pending]
  6. Milestone 4: Intégration Finale & Validation Globale (100% E2E tests + typecheck) [pending]
- **Current phase**: 0 (Survey)
- **Current focus**: Survey phase with 3 parallel Explorers (Gen 2 active after transient network timeout of Gen 1)

## 🔒 Key Constraints
- DISPATCH-ONLY: NEVER write, modify, or create source code files directly.
- NEVER run build/test commands yourself — require workers/reviewers to do so.
- NEVER investigate or explore the problem at the code level — dispatch Explorers.
- Only edit .md metadata in .agents/teamwork/.
- Auditor is NON-SKIPPABLE. Integrity violation is an immediate binary veto.
- Pass 100% tests and clean `bun run typecheck`.

## Current Parent
- Conversation ID: c0f8fb76-b01b-4420-b644-4653e6028bd7
- Updated: 2026-10-13T13:10:00Z

## Key Decisions Made
- Selected Project Pattern with Dual Track (Implementation Track + E2E Testing Track).
- Gen 1 survey subagents encountered transient stream network timeouts. Spawned Gen 2 replacement survey subagents.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_survey_1 | teamwork_preview_explorer | Survey R1 | failed (network timeout) | 8191e7c8-cb2d-4425-8f5c-29696ec2f238 |
| explorer_survey_2 | teamwork_preview_explorer | Survey R2 | failed (network timeout) | 99e836ab-fba0-4135-9c7d-bd5c0decd613 |
| explorer_survey_3 | teamwork_preview_explorer | Survey R3/R4 | failed (network timeout) | 71207b05-d929-41d1-9cd0-ff1c87681b70 |
| explorer_survey_1_gen2 | teamwork_preview_explorer | Survey R1 (Mascot) | in-progress | b13e5e2a-76ba-4c67-bbf6-fed310ce4444 |
| explorer_survey_2_gen2 | teamwork_preview_explorer | Survey R2 (Split-Screen Layout) | in-progress | ab61c7e5-e6cb-4507-bb80-8c35aad14601 |
| explorer_survey_3_gen2 | teamwork_preview_explorer | Survey R3/R4 (Tools & Plumbing) | in-progress | 315e1881-b1ff-4b8d-844d-e6996fa181bd |

## Succession Status
- Succession required: no
- Spawn count: 6 / 16
- Pending subagents: b13e5e2a-76ba-4c67-bbf6-fed310ce4444, ab61c7e5-e6cb-4507-bb80-8c35aad14601, 315e1881-b1ff-4b8d-844d-e6996fa181bd
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: 586aadb0-e76f-4d91-9831-64e71fd66511/task-10
- Safety timer: none
- On succession: kill all timers before spawning successor
- On context truncation: run manage_task(Action="list") — re-create if missing

## Artifact Index
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/ORIGINAL_REQUEST.md — Original User Request
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/DISPATCH.md — Orchestrator Dispatch log
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/BRIEFING.md — Persistent working memory
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/progress.md — Liveness & status tracking
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_survey_1_gen2/analysis.md — Explorer 1 Gen 2 findings (pending)
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_survey_2_gen2/analysis.md — Explorer 2 Gen 2 findings (pending)
- /home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_survey_3_gen2/analysis.md — Explorer 3 Gen 2 findings (pending)
