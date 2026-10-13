import { createMemo, Show } from "solid-js"
import { useTheme } from "../../../../context/theme"
import { ToolAccordion } from "../ToolAccordion"
import { ToolArgumentsView } from "../ToolArgumentsView"
import type { ClaudeToolViewProps } from "../types"

/**
 * Vue spécialisée pour la navigation et recherche web (WebFetch, WebSearch).
 * - En-tête : [Web] https://example.com ou "requête de recherche"
 * - Corps accordéon : Contenu ou résumé de la page web.
 */
export function WebToolView(props: ClaudeToolViewProps) {
  const theme = useTheme()

  const target = createMemo(() => {
    const url = props.input.url
    if (typeof url === "string" && url) return url
    const query = props.input.query
    if (typeof query === "string" && query) return `"${query}"`
    return "Web request"
  })

  const provider = createMemo(() => {
    const raw = props.metadata.provider
    return typeof raw === "string" ? `via ${raw}` : undefined
  })

  const outputText = createMemo(() => (props.output ? props.output.trim() : ""))
  const hasDetails = createMemo(() => Boolean(outputText()))

  return (
    <ToolAccordion
      category="web"
      status={props.status}
      createdTime={props.part.time.created}
      completedTime={props.part.time.completed}
      durationMs={props.durationMs}
      defaultExpanded={props.defaultExpanded}
      hasDetails={hasDetails()}
      argumentsContent={
        <ToolArgumentsView
          primary={target()}
          secondary={provider()}
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
