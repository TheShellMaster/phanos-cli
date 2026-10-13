## 2026-10-13T15:00:13Z
You are Worker M2 (Gen 2), responsible for Milestone 2: Asymmetric Split Screen Layout & Sidebar.

Your working directory is:
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/worker_layout_m2_gen2

Authoritative user request (MUST read first):
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/ORIGINAL_REQUEST.md

Project Blueprint:
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/PROJECT.md

Investigation & Audit Findings to follow:
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_2/handoff.md
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/CODE_MODULARITY_GUIDELINES.md
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/GROUND_TRUTH_SCOUT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE OWNERSHIP:
You exclusively own and may edit:
- /home/theshellpc/Bureau/nouveau-projet/base-opencode/packages/tui/src/routes/session/layout/*
Do NOT modify files outside this scope!

TASK INSTRUCTIONS:
1. Create the 5 modular components in `packages/tui/src/routes/session/layout/` adhering to the 250-line limit per file:
   - `ModelStatusBadge.tsx`: Displays active model name, provider, status dot (green/amber).
   - `TokenContextMeter.tsx`: Displays token usage and UTF-8 progress bar (`[████░░░░] %`).
   - `SubagentTreeList.tsx`: Displays active subagents list / tree with status icons.
   - `ActivityHistoryFeed.tsx`: Displays recent agent activity / executed tool actions.
   - `AmberFloatingComposer.tsx`: Suspended/floating composer container with amber accent border (`#FABE3C`).
2. Update `AsymmetricLayout.tsx`:
   - Set collapse threshold to >= 100 columns (`dimensions().width >= 100`).
   - Use `flexGrow={1} minWidth={0} minHeight={0}` for fluid container responsiveness without hardcoded overflow.
3. Update `AsymmetricSidebar.tsx`:
   - Integrate `ModelStatusBadge`, `TokenContextMeter`, `SubagentTreeList`, `ActivityHistoryFeed`.
   - Ensure props accept model, token metrics, subagents list, and recent activities.
4. Update `types.ts` and `index.ts` in `packages/tui/src/routes/session/layout/` to export all new components and contracts cleanly.
5. Verify code compiles cleanly with `bun run typecheck` in `packages/tui`.
6. Write your completion report in `/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/worker_layout_m2_gen2/handoff.md`.
7. Send a message to parent (`9c77ef94-66cd-458f-9e5c-c543f6706177`) with your status and report path.
