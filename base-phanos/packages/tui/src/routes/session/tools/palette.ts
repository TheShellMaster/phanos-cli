import { RGBA } from "@opentui/core"
import type { ToolCategory, ToolCategoryStyle } from "./types"

// Phanos Amber Palette
export const AMBER_SPINNER = RGBA.fromInts(250, 190, 60, 255) // #FABE3C
export const AMBER_GLOW = RGBA.fromInts(255, 205, 90, 255)    // #FFCD5A
export const AMBER_DEEP = RGBA.fromInts(196, 118, 20, 255)    // #C47614

// Semantic status colors
export const COLOR_SUCCESS = RGBA.fromInts(52, 211, 153, 255) // #34D399 (Emerald)
export const COLOR_ERROR = RGBA.fromInts(248, 113, 113, 255)   // #F87171 (Red)
export const COLOR_MUTED = RGBA.fromInts(148, 163, 184, 255)   // #94A3B8 (Slate)

// Category Badge styles (Claude Code style pills)
export const CATEGORY_STYLES: Record<ToolCategory, ToolCategoryStyle> = {
  bash: {
    label: "Bash",
    icon: "$",
    bg: RGBA.fromInts(14, 58, 64, 255),    // Dark cyan #0E3A40
    fg: RGBA.fromInts(56, 189, 248, 255),  // Sky cyan #38BDF8
  },
  read: {
    label: "Read",
    icon: "→",
    bg: RGBA.fromInts(30, 41, 59, 255),    // Dark slate blue #1E293B
    fg: RGBA.fromInts(96, 165, 250, 255),  // Sky blue #60A5FA
  },
  edit: {
    label: "Edit",
    icon: "✎",
    bg: RGBA.fromInts(66, 32, 6, 255),     // Dark amber #422006
    fg: RGBA.fromInts(245, 158, 11, 255),  // Amber orange #F59E0B
  },
  grep: {
    label: "Grep",
    icon: "✱",
    bg: RGBA.fromInts(6, 78, 59, 255),     // Dark emerald #064E3B
    fg: RGBA.fromInts(52, 211, 153, 255),  // Bright green #34D399
  },
  search: {
    label: "Search",
    icon: "⌕",
    bg: RGBA.fromInts(59, 7, 100, 255),    // Dark purple #3B0764
    fg: RGBA.fromInts(192, 132, 252, 255), // Light purple #C084FC
  },
  web: {
    label: "Web",
    icon: "🌐",
    bg: RGBA.fromInts(80, 7, 36, 255),     // Dark fuchsia #500724
    fg: RGBA.fromInts(244, 114, 182, 255), // Bright pink #F472B6
  },
  subagent: {
    label: "Agent",
    icon: "↳",
    bg: RGBA.fromInts(30, 27, 75, 255),    // Dark indigo #1E1B4B
    fg: RGBA.fromInts(129, 140, 248, 255), // Light indigo #818CF8
  },
  generic: {
    label: "Tool",
    icon: "⚙",
    bg: RGBA.fromInts(30, 41, 59, 255),    // Dark slate #1E293B
    fg: RGBA.fromInts(148, 163, 184, 255), // Muted slate #94A3B8
  },
}
