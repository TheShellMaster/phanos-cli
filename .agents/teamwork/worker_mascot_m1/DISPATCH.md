## 2026-10-13T14:42:47Z
You are Worker M1, responsible for Milestone 1: Mascotte Cyber Pixel-Art (Splash & Widget).

Your working directory is:
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/worker_mascot_m1

Authoritative user request (MUST read first):
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/ORIGINAL_REQUEST.md

Project Blueprint:
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/PROJECT.md

Investigation & Audit Findings to follow:
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_1/handoff.md
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/CODE_MODULARITY_GUIDELINES.md
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/GROUND_TRUTH_SCOUT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE OWNERSHIP:
You exclusively own and may edit:
- /home/theshellpc/Bureau/nouveau-projet/base-opencode/packages/tui/src/component/mascot/*
- /home/theshellpc/Bureau/nouveau-projet/base-opencode/packages/tui/src/app.tsx
Do NOT modify files outside this scope!

TASK INSTRUCTIONS:
1. Fix SolidJS reactivity in `src/component/mascot/useMascotState.ts` and `src/component/mascot/MascotCanvas.tsx`:
   - Pass reactive getter or signal for mood so that changes to `props.mood` trigger animations reactively.
2. Fix lifecycle cleanup in `src/component/mascot/MascotSplash.tsx`:
   - Replace the unexecuted return inside `onMount` with `onCleanup` to safely clear timeouts (`t1`, `t2`, `t3`).
3. Fix matrix width mismatch in `src/component/mascot/matrix.ts`:
   - In `FRAME_THINKING_1`, ensure row 0 has the exact same character width (12 chars) as rows 1-3.
4. Wire `MascotSplash` into `src/app.tsx`:
   - Add a signal `const [splashDone, setSplashDone] = createSignal(false)`
   - Show `MascotSplash` at initial startup centered over the screen with `onComplete={() => setSplashDone(true)}`, smoothly transitioning to the main TUI.
5. Verify `MascotWidget.tsx` is ready with proper types and responsive mood handling.
6. Verify code compiles cleanly with `bun run typecheck` in `packages/tui`.
7. Write your completion report in `/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/worker_mascot_m1/handoff.md`.
8. Send a message to parent (`9c77ef94-66cd-458f-9e5c-c543f6706177`) with your status and report path.
