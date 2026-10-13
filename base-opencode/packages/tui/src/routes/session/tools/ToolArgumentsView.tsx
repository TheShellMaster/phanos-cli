import { Show } from "solid-js"
import { useTheme } from "../../../context/theme"

export interface ToolArgumentsViewProps {
  primary: string
  secondary?: string
  badge?: string
}

/**
 * Formatage dynamique et soigné de la ligne d'arguments façon Claude Code.
 * Met en valeur la commande ou le chemin principal et estompe les détails secondaires.
 */
export function ToolArgumentsView(props: ToolArgumentsViewProps) {
  const theme = useTheme()

  return (
    <box flexDirection="row" gap={1} flexGrow={1} minWidth={0} alignItems="center">
      <text fg={theme.text.base} wrapMode="none" truncate flexShrink={1}>
        {props.primary}
      </text>

      <Show when={props.secondary}>
        <text fg={theme.text.muted} wrapMode="none" truncate flexShrink={2}>
          {props.secondary}
        </text>
      </Show>

      <Show when={props.badge}>
        <text fg={theme.text.muted} bg={theme.decrease(theme.background.base)} flexShrink={0}>
          {` ${props.badge} `}
        </text>
      </Show>
    </box>
  )
}
