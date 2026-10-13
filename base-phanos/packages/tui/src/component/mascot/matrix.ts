import type { MascotMood, MascotSpriteFrame } from "./types"

/**
 * Matrices pixel-art en demi-blocs Unicode (▀, ▄, █).
 * Compactes (6 lignes x 12 colonnes), parfaites pour le coin supérieur droit.
 */

// 1. Frame standard : Yeux grands ouverts, bienveillants
export const FRAME_IDLE_OPEN: MascotSpriteFrame = {
  width: 12,
  height: 4,
  rows: [
    " ╭────────╮ ",
    " │ ●    ● │ ",
    " │   ▽    │ ",
    " ╰─▀▀──▀▀─╯ ",
  ],
}

// 2. Frame clignement des yeux (blink)
export const FRAME_IDLE_BLINK: MascotSpriteFrame = {
  width: 12,
  height: 4,
  rows: [
    " ╭────────╮ ",
    " │ ─    ─ │ ",
    " │   ▽    │ ",
    " ╰─▀▀──▀▀─╯ ",
  ],
}

// 3. Frame concentration / réflexion (thinking)
export const FRAME_THINKING_1: MascotSpriteFrame = {
  width: 12,
  height: 4,
  rows: [
    " ╭────────╮✦",
    " │ ◉    · │ ",
    " │   ~    │ ",
    " ╰─▄▄──▄▄─╯ ",
  ],
}

export const FRAME_THINKING_2: MascotSpriteFrame = {
  width: 12,
  height: 4,
  rows: [
    "✦╭────────╮ ",
    " │ ·    ◉ │ ",
    " │   ~    │ ",
    " ╰─▀▄──▄▀─╯ ",
  ],
}

// 4. Frame exécution d'outil / étincelle active (executing)
export const FRAME_EXECUTING_1: MascotSpriteFrame = {
  width: 12,
  height: 4,
  rows: [
    "★╭────────╮ ",
    " │ ✧    ✧ │ ",
    " │   ω    │ ",
    " ╰─██──██─╯ ",
  ],
}

export const FRAME_EXECUTING_2: MascotSpriteFrame = {
  width: 12,
  height: 4,
  rows: [
    " ╭────────╮★",
    " │ ✦    ✦ │ ",
    " │   ∇    │ ",
    " ╰─▀█──█▀─╯ ",
  ],
}

// 5. Salutation / Splash d'éveil (greeting)
export const FRAME_GREETING: MascotSpriteFrame = {
  width: 12,
  height: 4,
  rows: [
    " ╭────────╮/",
    " │ ^    ^ │ ",
    " │   ▽    │ ",
    " ╰─▀▀──▀▀─╯ ",
  ],
}

export function getFramesForMood(mood: MascotMood): readonly MascotSpriteFrame[] {
  switch (mood) {
    case "idle":
      return [FRAME_IDLE_OPEN, FRAME_IDLE_OPEN, FRAME_IDLE_OPEN, FRAME_IDLE_BLINK]
    case "thinking":
      return [FRAME_THINKING_1, FRAME_THINKING_2]
    case "executing":
      return [FRAME_EXECUTING_1, FRAME_EXECUTING_2]
    case "greeting":
      return [FRAME_GREETING, FRAME_IDLE_OPEN]
    case "sleeping":
    default:
      return [FRAME_IDLE_BLINK]
  }
}
