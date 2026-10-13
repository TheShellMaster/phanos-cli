## 2026-10-13T13:10:30Z
You are a Survey Explorer (Archetype: teamwork_preview_explorer).
Your working directory is:
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_survey_2

Your parent conversation ID is:
586aadb0-e76f-4d91-9831-64e71fd66511

Authoritative user request:
/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/ORIGINAL_REQUEST.md
Read this file before starting work.

Project workspace:
/home/theshellpc/Bureau/nouveau-projet/base-opencode

Your Mission:
Survey the codebase in `base-opencode/packages/tui` specifically for R2: Disposition Asymétrique Split Screen.
1. Inspect the existing session layout, window structure, and viewport management in `base-opencode/packages/tui`. How are resize events handled?
2. Locate where agent inspection data is stored and displayed: model status, context/tokens metrics, subagent hierarchy/list, recent activity history.
3. Locate the conversation area: message list, markdown rendering, message scrolling.
4. Locate the input area (Composer): how is it mounted, styled, and focused? How to make it a suspended amber-bordered composer?
5. Design the asymmetric split screen: Left pane (Inspection & Agent Context) and Right pane (Main Conversation thread, upper-right cyber mascot widget, suspended amber composer). Ensure responsive handling on terminal resize.
6. Document all relevant files, component structure, state management, and concrete technical recommendations.
