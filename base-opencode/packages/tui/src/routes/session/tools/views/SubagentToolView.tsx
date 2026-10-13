import { createMemo, Show } from "solid-js"
import { useTheme } from "../../../../context/theme"
import { ToolAccordion } from "../ToolAccordion"
import { ToolArgumentsView } from "../ToolArgumentsView"
import type { ClaudeToolViewProps } from "../types"

/**
 * Vue spécialisée pour la délégation à un sous-agent (Subagent / Task).
 * - En-tête : [Agent] Description de la mission · Modèle assigné
 * - Corps accordéon : Résultat de la tâche ou identifiant de sous-session.
 */
export function SubagentToolView(props: ClaudeToolViewProps) {
  const theme = useTheme()

  const description = createMemo(() => {
    const raw = props.input.description ?? props.input.prompt ?? props.input.agent
    return typeof raw === "string" ? raw : "Subagent task"
  })

  const model = createMemo(() => {
    const raw = props.input.model ?? props.metadata.model
    return typeof raw === "string" ? `(${raw})` : undefined
  })

  const outputText = createMemo(() => (props.output ? props.output.trim() : ""))
  const hasDetails = createMemo(() => Boolean(outputText()))

  return (
    <ToolAccordion
      category="subagent"
      status={props.status}
      createdTime={props.part.time.created}
      completedTime={props.part.time.completed}
      durationMs={props.durationMs}
      defaultExpanded={props.defaultExpanded}
      hasDetails={hasDetails()}
      argumentsContent={
        <ToolArgumentsView
          primary={description()}
          secondary={model()}
        />
      }
    >
      <Show when={hasDetails()}>
        <text fg={theme.text.muted} wrapMode="word">
          {outputText()}
        </text>
      </Show>
    </ToolAccordion>
  )
}
