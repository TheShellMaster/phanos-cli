import { RGBA } from "@opentui/core"

/**
 * Tokens de palette ambre / or / bronze pour la mascotte Phanos.
 * Utilise RGBA.fromInts (0-255) conformément à GROUND_TRUTH_SCOUT.md.
 */
export const MASCOT_PALETTE = {
  // Ambre lumineux / yeux et reflets
  goldGlow: RGBA.fromInts(255, 205, 90, 255), // #FFCD5A
  amberPrimary: RGBA.fromInts(250, 190, 60, 255), // #FABE3C
  bronzeDeep: RGBA.fromInts(196, 118, 20, 255), // #C47614
  darkBase: RGBA.fromInts(42, 30, 15, 255), // #2A1E0F
  sparklePale: RGBA.fromInts(255, 234, 170, 255), // #FFEAAA
} as const
