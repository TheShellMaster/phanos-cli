import { createMemo, For, Show } from "solid-js"
import { RGBA, TextAttributes } from "@opentui/core"
import type { ActivityItem, ActivityHistoryFeedProps } from "./types"

const GOLD = RGBA.fromInts(255, 205, 90, 255)
const AMBER = RGBA.fromInts(250, 190, 60, 255)
const MUTED = RGBA.fromInts(160, 146, 122, 255)
const GREEN = RGBA.fromInts(46, 204, 113, 255)
const RED = RGBA.fromInts(231, 76, 60, 255)
const TEXT_BASE = RGBA.fromInts(240, 235, 220, 255)

/**
 * ActivityHistoryFeed : Affiche le flux des actions et outils récemment exécutés par l'agent.
 * Conforme à la Règle 1 (Responsabilité unique) et au plafond < 250 lignes.
 */
export function ActivityHistoryFeed(props: ActivityHistoryFeedProps) {
  const items = createMemo<ActivityItem[]>(() => {
    if (!props.activities || !Array.isArray(props.activities)) return []
    const max = props.maxItems ?? 4
    return props.activities.slice(-max).reverse().map((raw) => {
      if (typeof raw === "object" && raw !== null) {
        return {
          id: raw.id,
          tool: raw.tool ?? raw.name ?? "Tool",
          summary: raw.summary ?? raw.description ?? raw.input,
          status: raw.status ?? "completed",
          duration: raw.duration,
        }
      }
      return {
        tool: String(raw),
        summary: "",
        status: "completed",
      }
    })
  })

  // Formatage de la durée d'exécution
  const formatDuration = (d?: string | number) => {
    if (d === undefined || d === null) return ""
    if (typeof d === "number") {
      return d < 1000 ? `${d}ms` : `${(d / 1000).toFixed(1)}s`
    }
    return String(d)
  }

  // Formatage de l'état
  const getStatusDisplay = (status?: string, duration?: string | number) => {
    const st = (status ?? "").toLowerCase()
    const dur = formatDuration(duration)
    if (st === "running" || st === "in_progress") {
      return { text: "● en cours", color: AMBER }
    }
    if (st === "error" || st === "failed") {
      return { text: `✗ ${dur || "err"}`, color: RED }
    }
    return { text: `✓ ${dur || "ok"}`, color: GREEN }
  }

  return (
    <box flexDirection="column">
      {/* En-tête de section */}
      <box flexDirection="row" justifyContent="space-between" alignItems="center">
        <text fg={MUTED}>Activités récentes :</text>
        <Show when={items().length > 0}>
          <text fg={GOLD}>{items().length}</text>
        </Show>
      </box>

      {/* Liste des activités ou message vide */}
      <Show
        when={items().length > 0}
        fallback={<text fg={MUTED}>En attente d'actions...</text>}
      >
        <box flexDirection="column">
          <For each={items()}>
            {(activity) => {
              const statusDisplay = () => getStatusDisplay(activity.status, activity.duration)
              const toolLabel = () => `[${activity.tool}]`

              return (
                <box flexDirection="column">
                  <box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <text fg={AMBER} attributes={TextAttributes.BOLD}>
                      {toolLabel()}
                    </text>
                    <text fg={statusDisplay().color}>
                      {statusDisplay().text}
                    </text>
                  </box>

                  <Show when={activity.summary}>
                    <text fg={TEXT_BASE} truncate={true}>
                      {activity.summary}
                    </text>
                  </Show>
                </box>
              )
            }}
          </For>
        </box>
      </Show>
    </box>
  )
}
