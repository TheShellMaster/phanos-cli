import { createMemo, Show } from "solid-js"
import { RGBA, TextAttributes } from "@opentui/core"
import type { ModelStatusBadgeProps } from "./types"

// Palette ambrée Phanos & statuts conformes GROUND_TRUTH_SCOUT.md
const GOLD = RGBA.fromInts(255, 205, 90, 255)
const AMBER = RGBA.fromInts(250, 190, 60, 255)
const MUTED = RGBA.fromInts(160, 146, 122, 255)
const GREEN = RGBA.fromInts(46, 204, 113, 255)
const RED = RGBA.fromInts(231, 76, 60, 255)

/**
 * ModelStatusBadge : Affiche le modèle actif, son fournisseur et une puce d'état réactive (vert/ambre).
 * Conforme à la Règle 1 (Responsabilité unique) et au plafond < 250 lignes.
 */
export function ModelStatusBadge(props: ModelStatusBadgeProps) {
  const model = () => props.modelName ?? "opencode/free"
  const rawStatus = () => (props.status ?? "ready").toLowerCase()

  const provider = createMemo(() => {
    if (props.provider) return props.provider
    if (model().includes("/")) {
      return model().split("/")[0]
    }
    return undefined
  })

  const displayName = createMemo(() => {
    const raw = model()
    if (!props.provider && raw.includes("/")) {
      const parts = raw.split("/")
      return parts.slice(1).join("/")
    }
    return raw
  })

  const dotColor = createMemo(() => {
    const st = rawStatus()
    if (st === "active" || st === "streaming" || st === "busy") {
      return AMBER
    }
    if (st === "error") {
      return RED
    }
    return GREEN
  })

  const statusLabel = createMemo(() => {
    const st = rawStatus()
    if (st === "streaming") return "Génération"
    if (st === "busy" || st === "active") return "Actif"
    if (st === "error") return "Erreur"
    if (st === "idle") return "En veille"
    return "Prêt"
  })

  return (
    <box flexDirection="column">
      {/* Ligne d'en-tête : Intitulé + Puce de statut */}
      <box flexDirection="row" justifyContent="space-between" alignItems="center">
        <text fg={MUTED}>Modèle actif :</text>
        <box flexDirection="row" alignItems="center">
          <text fg={dotColor()}>● </text>
          <text fg={dotColor()} attributes={TextAttributes.BOLD}>
            {statusLabel()}
          </text>
        </box>
      </box>

      {/* Nom du modèle en évidence */}
      <text fg={AMBER} attributes={TextAttributes.BOLD} truncate={true}>
        {displayName()}
      </text>

      {/* Fournisseur optionnel */}
      <Show when={provider()}>
        <box flexDirection="row">
          <text fg={MUTED}>fournisseur: </text>
          <text fg={GOLD}>{provider()}</text>
        </box>
      </Show>
    </box>
  )
}
