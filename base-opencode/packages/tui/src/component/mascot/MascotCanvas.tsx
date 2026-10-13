import { createMemo, For } from "solid-js"
import { TextAttributes } from "@opentui/core"
import type { MascotMood } from "./types"
import { getFramesForMood } from "./matrix"
import { MASCOT_PALETTE } from "./palette"
import { useMascotState } from "./useMascotState"

export interface MascotCanvasProps {
  mood?: MascotMood
}

/**
 * Moteur de rendu matriciel terminal pour la mascotte Phanos.
 * Utilise les balises intrinsèques <box> et <text> vérifiées dans GROUND_TRUTH_SCOUT.md.
 */
export function MascotCanvas(props: MascotCanvasProps) {
  const state = useMascotState({ mood: props.mood })
  const frames = createMemo(() => getFramesForMood(props.mood ?? "idle"))

  const currentFrame = createMemo(() => {
    const list = frames()
    return list[state.frameIndex() % list.length]
  })

  // Couleur dynamique selon l'humeur
  const fgColor = createMemo(() => {
    switch (props.mood) {
      case "executing":
        return MASCOT_PALETTE.goldGlow
      case "thinking":
        return MASCOT_PALETTE.sparklePale
      case "idle":
      default:
        return MASCOT_PALETTE.amberPrimary
    }
  })

  return (
    <box flexDirection="column" alignItems="center">
      <For each={currentFrame().rows}>
        {(row) => (
          <text
            fg={fgColor()}
            attributes={props.mood === "executing" ? TextAttributes.BOLD : undefined}
          >
            {row}
          </text>
        )}
      </For>
    </box>
  )
}
