import { createMemo } from "solid-js"
import { MascotCanvas } from "./MascotCanvas"
import type { MascotMood } from "./types"
import { MASCOT_PALETTE } from "./palette"

export interface MascotWidgetProps {
  mood?: MascotMood
  label?: string
}

/**
 * Widget permanent de la mascotte, conçu pour le coin supérieur droit du TUI.
 * Réagit en temps réel à l'état de l'agent (veille / réflexion / exécution d'outil).
 */
export function MascotWidget(props: MascotWidgetProps) {
  const statusLabel = createMemo(() => {
    if (props.label) return props.label
    switch (props.mood) {
      case "executing":
        return "Actif ⚡"
      case "thinking":
        return "Réflexion..."
      case "greeting":
        return "Bonjour ! ✨"
      case "sleeping":
        return "Veille..."
      case "idle":
      default:
        return "Prêt"
    }
  })

  return (
    <box
      flexDirection="row"
      alignItems="center"
      gap={1}
      paddingRight={1}
    >
      <text fg={MASCOT_PALETTE.bronzeDeep}>[{statusLabel()}]</text>
      <MascotCanvas mood={props.mood} />
    </box>
  )
}
