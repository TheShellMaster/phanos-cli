# Explorer Survey 1 Dispatch
Target: TUI Component Architecture, Splash Screen, Mascot & Amber Theme

## 2026-10-13T13:10:30Z
From: 586aadb0-e76f-4d91-9831-64e71fd66511
Mission: Survey the codebase in `base-opencode/packages/tui` specifically for R1: Compagnon Cyber Pixel-Art Animé (Vibe Mistral).
1. Inspect the terminal rendering engine and UI primitives used in `base-opencode/packages/tui` (SolidJS, OpenCode terminal components, box/text primitives, ANSI color capabilities).
2. Locate the existing splash screen / startup sequence. How is it initialized and how does it transition into the session view?
3. Locate the header / top-bar area where a permanent widget in the upper-right corner can be placed.
4. Design the half-block (▀, ▄, █, ░, ▒) / pixel-art creature with amber/gold styling (#FABE3C, #FFCD5A, #C47614), an animated splash wake-up sequence, periodic eye-blinking idle state, and active states (sparks, focused eyes during agent thought or tool execution).
5. Document all relevant files, existing components, signals/effects, and concrete technical recommendations.
