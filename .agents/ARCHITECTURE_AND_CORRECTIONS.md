# 🏛️ PHANOS CLI — Technical Stack & Architectural Rationale

This document serves as the canonical reference for AI agents and human developers working on **Phanos CLI**. It explains the repository architecture, why previous agent implementations failed, and the corrections implemented to achieve a fully functional, animated TUI agent.

---

## 📐 1. System Architecture Overview

Phanos CLI is structured into two complementary layers:

```
phanos-cli/
├── phanos/                 # 🚀 LAUNCHER & DISTRIBUTION (@cypher/phanos)
│   ├── bin/phanos.mjs      # Binary entrypoint (`phanos` command)
│   └── theme/phanos.json   # Amber/Gold palette theme file
│
└── base-phanos/            # ⚙️ CORE ENGINE & TUI FORK (OpenCode Engine)
    └── packages/
        ├── cli/            # CLI commands & runner entrypoint
        ├── tui/            # Terminal User Interface (SolidJS + OpenTUI)
        │   └── src/
        │       ├── component/mascot/  # Pixel-art animated mascot (Mistral vibe)
        │       └── routes/session/    # Discussion stream & Claude-style tool views
        └── server/         # Agentic server, PTY shell runner & providers
```

---

## 🔍 2. Root Cause Analysis: Why Previous Agents Failed

Previous AI agents created mockups and UI components inside `base-phanos/packages/tui/` (such as `MascotCanvas.tsx`, `ClaudeToolPart.tsx`, etc.), but **failed to connect the launcher to the codebase**.

### Key Root Causes Identified:
1. **Launcher Detachment**: `phanos/bin/phanos.mjs` was using `which("opencode")` to invoke a globally installed `opencode` binary from npm. Running `phanos` was simply launching unpatched upstream OpenCode with a custom color theme, ignoring all custom TUI components in `base-phanos`.
2. **Path Resolution Error**: Initial launcher adjustments pointed to `join(root, "base-phanos")` instead of `join(root, "..", "base-phanos")`, preventing the launcher from resolving the local monorepo source.
3. **Mascot Position Discrepancy**: The mascot widget was previously placed in the top-right header or sidebar, whereas the user explicitly requested the mascot to be positioned **above at the top-left of the discussion stream**.
4. **Missing Reactive Binding**: The mascot mood (`idle`, `thinking`, `executing`) was hardcoded in several components rather than dynamically reacting to agent streaming states and tool execution status.

---

## 🛠️ 3. Corrections Implemented

### Correction A — Dynamic Launcher Engine Resolution (`phanos/bin/phanos.mjs`)
The launcher script now dynamically detects if the local `base-phanos` codebase and `bun` runtime are available:
```javascript
const bunBin = which("bun");
const basePhanosRoot = join(root, "..", "base-phanos");
const basePhanosEntry = join(basePhanosRoot, "packages", "cli", "src", "index.ts");
const isBasePhanosAvailable = bunBin && existsSync(basePhanosEntry);

const spawnCmd = isBasePhanosAvailable ? bunBin : engine;
const spawnArgs = isBasePhanosAvailable
  ? ["run", "--cwd", basePhanosRoot, basePhanosEntry, ...args]
  : args;
```
*Effect*: Executing `phanos` runs the true `base-phanos` TUI with all custom mascot and tool components.

### Correction B — Mascot Placement at Top-Left of Discussion (`base-phanos/packages/tui/src/routes/session/index.tsx`)
The mascot is rendered directly above the chat viewport at the top-left:
```tsx
{/* Animated Mascot placed at top-left above discussion stream */}
<box flexDirection="row" alignItems="center" gap={1} marginBottom={1} flexShrink={0}>
  <MascotWidget mood={mascotMood()} />
  <text fg={theme.text.feedback.warning.base} attributes={TextAttributes.BOLD}>
    PHANOS
  </text>
</box>
```

### Correction C — Reactive Mascot Mood Signals
`mascotMood` dynamically evaluates assistant turn state and running tool parts:
```typescript
const mascotMood = createMemo<MascotMood>(() => {
  const list = messages()
  const last = list.at(-1)
  if (!last) return "idle"

  if (last.type === "assistant" && !last.time.completed) {
    const runningTool = last.content.some(
      (part) => part.type === "tool" && (part.state.status === "running" || part.state.status === "streaming"),
    )
    return runningTool ? "executing" : "thinking"
  }
  return "idle"
})
```

---

## 📌 4. Guidelines for Future Agents

1. **Do not create detached mockups**: Always verify that changes made in `base-phanos/packages/tui` are executed when running `phanos`.
2. **Maintain Bun compatibility**: Run `bun run --cwd base-phanos packages/cli/src/index.ts` to test TUI modifications directly.
3. **Preserve Mascot positioning**: The mascot widget MUST remain positioned top-left above the main discussion stream.
