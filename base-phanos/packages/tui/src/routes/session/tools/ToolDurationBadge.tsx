import { createEffect, createMemo, createSignal, onCleanup, Show, Switch, Match } from "solid-js"
import { SPINNER_FRAMES } from "../../../component/spinner-frames"
import { useConfig } from "../../../config"
import { AMBER_SPINNER, COLOR_ERROR, COLOR_MUTED, COLOR_SUCCESS } from "./palette"
import type { ToolRunStatus } from "./types"

export interface ToolDurationBadgeProps {
  status: ToolRunStatus
  createdTime?: number
  completedTime?: number
  durationMs?: number
}

export function formatExecutionDuration(ms: number): string {
  if (ms < 1000) {
    return `${Math.max(0, Math.round(ms))}ms`
  }
  if (ms < 60_000) {
    return `${(ms / 1000).toFixed(1)}s`
  }
  const minutes = Math.floor(ms / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1000)
  return `${minutes}m ${seconds}s`
}

/**
 * Badge de statut et de chronométrage précis façon Claude Code.
 * - Spinner ambré ultra-fluide avec timer en direct pendant l'exécution.
 * - Checkmark '✓' et durée finale exacte (ex: 240ms, 1.4s) une fois terminé.
 */
export function ToolDurationBadge(props: ToolDurationBadgeProps) {
  const config = useConfig().data
  const [now, setNow] = createSignal(Date.now())

  // Met à jour le chronomètre en temps réel uniquement pendant l'exécution
  createEffect(() => {
    if (props.status !== "running" && props.status !== "streaming") return
    const timer = setInterval(() => setNow(Date.now()), 100)
    onCleanup(() => clearInterval(timer))
  })

  const elapsedMs = createMemo(() => {
    if (props.durationMs !== undefined) return props.durationMs
    if (props.completedTime !== undefined && props.createdTime !== undefined) {
      return Math.max(0, props.completedTime - props.createdTime)
    }
    if (props.createdTime !== undefined) {
      return Math.max(0, now() - props.createdTime)
    }
    return 0
  })

  const formattedDuration = createMemo(() => formatExecutionDuration(elapsedMs()))

  return (
    <box flexDirection="row" gap={1} flexShrink={0} alignItems="center">
      <Switch>
        <Match when={props.status === "running" || props.status === "streaming"}>
          <Show
            when={config.animations ?? true}
            fallback={<text fg={AMBER_SPINNER}>⋯</text>}
          >
            <spinner frames={SPINNER_FRAMES} interval={80} color={AMBER_SPINNER} />
          </Show>
          <text fg={AMBER_SPINNER}>
            {formattedDuration()}
          </text>
        </Match>

        <Match when={props.status === "completed"}>
          <text fg={COLOR_SUCCESS}>✓</text>
          <text fg={COLOR_MUTED}>
            {formattedDuration()}
          </text>
        </Match>

        <Match when={props.status === "error"}>
          <text fg={COLOR_ERROR}>✗</text>
          <text fg={COLOR_ERROR}>
            {formattedDuration()}
          </text>
        </Match>

        <Match when={props.status === "denied"}>
          <text fg={AMBER_SPINNER}>⊘ denied</text>
        </Match>

        <Match when={true}>
          <text fg={COLOR_MUTED}>⋯</text>
        </Match>
      </Switch>
    </box>
  )
}
