import { createSignal, createEffect, onMount, Show } from "solid-js"
import { MascotCanvas } from "./MascotCanvas"
import { MASCOT_PALETTE } from "./palette"

export interface MascotSplashProps {
  onComplete?: () => void
  durationMs?: number
}

/**
 * Splash screen d'éveil de la mascotte pixel au centre de l'écran.
 * S'exécute lors du démarrage avant de céder la place au TUI principal.
 */
export function MascotSplash(props: MascotSplashProps) {
  const [stage, setStage] = createSignal<"sleeping" | "waking" | "greeting">("sleeping")

  onMount(() => {
    // 1. Éveil après 400ms
    const t1 = setTimeout(() => setStage("waking"), 400)
    // 2. Salutation enthousiaste après 900ms
    const t2 = setTimeout(() => setStage("greeting"), 900)
    // 3. Clôture de l'animation
    const t3 = setTimeout(() => {
      props.onComplete?.()
    }, props.durationMs ?? 1600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  })

  return (
    <box
      flexGrow={1}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={1}
    >
      <MascotCanvas
        mood={stage() === "greeting" ? "greeting" : stage() === "waking" ? "thinking" : "sleeping"}
      />
      <text fg={MASCOT_PALETTE.goldGlow}>
        {stage() === "greeting" ? "✨ Phanos s'éveille..." : "· · ·"}
      </text>
    </box>
  )
}
