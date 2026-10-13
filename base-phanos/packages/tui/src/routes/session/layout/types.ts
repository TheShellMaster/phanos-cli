import type { JSX } from "@opentui/solid"

/**
 * Propriétés du conteneur AsymmetricLayout.
 */
export interface AsymmetricLayoutProps {
  sidebar: JSX.Element
  main: JSX.Element
  mascotHeader?: JSX.Element
  sidebarWidth?: number
}

/**
 * Statuts possibles pour l'indicateur de modèle.
 */
export type ModelStatusDot = "active" | "idle" | "streaming" | "ready" | "busy" | "error"

/**
 * Propriétés du composant ModelStatusBadge.
 */
export interface ModelStatusBadgeProps {
  modelName?: string
  provider?: string
  status?: ModelStatusDot | string
  variant?: string
}

/**
 * Propriétés du composant TokenContextMeter.
 */
export interface TokenContextMeterProps {
  tokensUsed?: string | number
  tokensLimit?: number
  percent?: number
  cost?: number | string
}

/**
 * Élément représentant un sous-agent dans l'arborescence.
 */
export interface SubagentItem {
  id?: string
  sessionID?: string
  name?: string
  agent?: string
  title?: string
  status?: "running" | "idle" | "completed" | "error" | string
  prefix?: string
  current?: boolean
}

/**
 * Propriétés du composant SubagentTreeList.
 */
export interface SubagentTreeListProps {
  subagents?: ReadonlyArray<SubagentItem | any>
  maxItems?: number
}

/**
 * Élément représentant une activité récente ou action d'outil.
 */
export interface ActivityItem {
  id?: string
  tool?: string
  summary?: string
  status?: "running" | "completed" | "error" | string
  duration?: string | number
  timestamp?: string | number
}

/**
 * Propriétés du composant ActivityHistoryFeed.
 */
export interface ActivityHistoryFeedProps {
  activities?: ReadonlyArray<ActivityItem | any>
  maxItems?: number
}

/**
 * Propriétés du composant AmberFloatingComposer.
 */
export interface AmberFloatingComposerProps {
  children: JSX.Element
  isFocused?: boolean
  statusText?: string
  padding?: number
}

/**
 * Propriétés du volet latéral AsymmetricSidebar.
 */
export interface AsymmetricSidebarProps {
  modelName?: string
  provider?: string
  modelStatus?: ModelStatusDot | string
  tokensUsed?: string | number
  tokensLimit?: number
  tokensPercent?: number
  activeToolsCount?: number
  subagents?: ReadonlyArray<SubagentItem | any>
  activities?: ReadonlyArray<ActivityItem | any>
  children?: JSX.Element
}
