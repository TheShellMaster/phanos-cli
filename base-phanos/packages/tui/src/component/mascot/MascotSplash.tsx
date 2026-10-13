import { createSignal, onMount, onCleanup } from "solid-js"
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
  let t1: ReturnType<typeof setTimeout> | undefined
  let t2: ReturnType<typeof setTimeout> | undefined
  let t3: ReturnType<typeof setTimeout> | undefined

  onMount(() => {
    // 1. Éveil après 400ms
    t1 = setTimeout(() => setStage("waking"), 400)
    // 2. Salutation enthousiaste après 900ms
    t2 = setTimeout(() => setStage("greeting"), 900)
    // 3. Clôture de l'animation
    t3 = setTimeout(() => {
      props.onComplete?.()
    }, props.durationMs ?? 1600)
  })

  onCleanup(() => {
    if (t1) clearTimeout(t1)
    if (t2) clearTimeout(t2)
    if (t3) clearTimeout(t3)
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
