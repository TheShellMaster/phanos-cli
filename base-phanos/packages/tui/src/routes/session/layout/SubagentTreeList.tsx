import { createMemo, For, Show } from "solid-js"
import { RGBA, TextAttributes } from "@opentui/core"
import type { SubagentItem, SubagentTreeListProps } from "./types"

const GOLD = RGBA.fromInts(255, 205, 90, 255)
const AMBER = RGBA.fromInts(250, 190, 60, 255)
const MUTED = RGBA.fromInts(160, 146, 122, 255)
const GREEN = RGBA.fromInts(46, 204, 113, 255)
const RED = RGBA.fromInts(231, 76, 60, 255)
const TEXT_BASE = RGBA.fromInts(240, 235, 220, 255)

/**
 * SubagentTreeList : Affiche l'arborescence des sous-agents avec icônes de statut et préfixes de branches.
 * Conforme à la Règle 1 (Responsabilité unique) et au plafond < 250 lignes.
 */
export function SubagentTreeList(props: SubagentTreeListProps) {
  const items = createMemo<SubagentItem[]>(() => {
    if (!props.subagents || !Array.isArray(props.subagents)) return []
    const max = props.maxItems ?? 6
    return props.subagents.slice(0, max).map((raw) => {
      if (typeof raw === "object" && raw !== null) {
        return {
          id: raw.id ?? raw.sessionID,
          name: raw.name ?? raw.agent ?? "Subagent",
          title: raw.title ?? raw.description,
          status: raw.status ?? "running",
          prefix: raw.prefix,
          current: Boolean(raw.current),
        }
      }
      return {
        id: String(raw),
        name: String(raw),
        status: "running",
      }
    })
  })

  // Détermination de l'icône et de la couleur selon l'état
  const getStatusIcon = (status?: string) => {
    const st = (status ?? "").toLowerCase()
    if (st === "running" || st === "active" || st === "busy") {
      return { icon: "●", color: AMBER }
    }
    if (st === "completed" || st === "done" || st === "finished") {
      return { icon: "✓", color: GREEN }
    }
    if (st === "error" || st === "failed") {
      return { icon: "✗", color: RED }
    }
    return { icon: "○", color: MUTED }
  }

  return (
    <box flexDirection="column">
      {/* En-tête de section */}
      <box flexDirection="row" justifyContent="space-between" alignItems="center">
        <text fg={MUTED}>Sous-agents :</text>
        <text fg={GOLD}>
          {items().length > 0 ? `${items().length} actif(s)` : "0"}
        </text>
      </box>

      {/* Liste arborescente ou état vide */}
      <Show
        when={items().length > 0}
        fallback={<text fg={MUTED}>Aucun sous-agent</text>}
      >
        <box flexDirection="column">
          <For each={items()}>
            {(agent, index) => {
              const statusInfo = () => getStatusIcon(agent.status)
              const prefix = () =>
                agent.prefix ?? (index() === items().length - 1 ? "└─ " : "├─ ")
              const isCurrent = () => Boolean(agent.current)

              return (
                <box flexDirection="row" alignItems="center">
                  {/* Préfixe d'arborescence */}
                  <text fg={MUTED}>{prefix()}</text>

                  {/* Puce / Icône d'état */}
                  <text fg={statusInfo().color}>{statusInfo().icon} </text>

                  {/* Nom du sous-agent */}
                  <text
                    fg={isCurrent() ? GOLD : TEXT_BASE}
                    attributes={isCurrent() ? TextAttributes.BOLD : TextAttributes.NONE}
                    truncate={true}
                  >
                    {agent.name}
                  </text>
                </box>
              )
            }}
          </For>
        </box>
      </Show>
    </box>
  )
}
