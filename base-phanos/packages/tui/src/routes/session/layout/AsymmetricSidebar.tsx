import { RGBA } from "@opentui/core"
import type { JSX } from "@opentui/solid"

export interface AsymmetricSidebarProps {
  modelName?: string
  tokensUsed?: string
  activeToolsCount?: number
  children?: JSX.Element
}

const GOLD = RGBA.fromInts(255, 205, 90, 255)
const MUTED = RGBA.fromInts(160, 146, 122, 255)
const AMBER = RGBA.fromInts(250, 190, 60, 255)

/**
 * Volet gauche d'inspection et contexte pour Phanos.
 * Affiche le statut du modèle, l'usage des tokens et les sous-agents.
 */
export function AsymmetricSidebar(props: AsymmetricSidebarProps) {
  return (
    <box flexDirection="column" gap={1} paddingLeft={1} paddingTop={1}>
      {/* En-tête du volet d'inspection */}
      <box flexDirection="column">
        <text fg={GOLD}>◈ INSPECTION</text>
        <text fg={MUTED}>───────────────</text>
      </box>

      {/* Statut Modèle */}
      <box flexDirection="column">
        <text fg={MUTED}>Modèle actif :</text>
        <text fg={AMBER}>{props.modelName ?? "opencode/free"}</text>
      </box>

      {/* Métriques Contexte */}
      <box flexDirection="column">
        <text fg={MUTED}>Contexte / Tokens :</text>
        <text fg={AMBER}>{props.tokensUsed ?? "0k / 128k"}</text>
      </box>

      {/* Outils & Sous-agents */}
      <box flexDirection="column">
        <text fg={MUTED}>Outils sollicités :</text>
        <text fg={AMBER}>{props.activeToolsCount ?? 0} actif(s)</text>
      </box>

      {/* Emplacement additionnel pour widgets contextuels */}
      <box flexGrow={1} minHeight={0} flexDirection="column">
        {props.children}
      </box>
    </box>
  )
}
