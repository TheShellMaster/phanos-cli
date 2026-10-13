import { createSignal, createEffect, onCleanup } from "solid-js"
import type { MascotMood } from "./types"

export interface UseMascotStateProps {
  mood?: MascotMood | (() => MascotMood)
  blinkIntervalMs?: number
  activeIntervalMs?: number
}

/**
 * Hook réactif SolidJS pour gérer la boucle de frames de la mascotte.
 * Conforme à GROUND_TRUTH_SCOUT.md : createEffect + setInterval + onCleanup.
 */
export function useMascotState(props?: UseMascotStateProps) {
  const [frameIndex, setFrameIndex] = createSignal(0)
  const currentMood = () => {
    const m = props?.mood
    return (typeof m === "function" ? m() : m) ?? "idle"
  }

  createEffect(() => {
    const mood = currentMood()
    // Intervalle rapide lors de l'activité/réflexion, lent en veille (clignements périodiques)
    const interval =
      mood === "thinking" || mood === "executing"
        ? (props?.activeIntervalMs ?? 350)
        : (props?.blinkIntervalMs ?? 1200)

    const timer = setInterval(() => {
      setFrameIndex((prev) => prev + 1)
    }, interval)

    onCleanup(() => clearInterval(timer))
  })

  return {
    frameIndex,
    mood: currentMood,
  }
}
