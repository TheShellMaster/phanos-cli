import { createMemo, Show } from "solid-js"
import { useTheme } from "../../../../context/theme"
import { usePathFormatter } from "../../../../context/path"
import { ToolAccordion } from "../ToolAccordion"
import { ToolArgumentsView } from "../ToolArgumentsView"
import type { ClaudeToolViewProps } from "../types"

/**
 * Vue spécialisée pour la recherche de code et fichiers (Grep, Glob).
 * - En-tête : [Grep] "searchPattern" in src/ (8 matches)
 * - Corps accordéon : Liste détaillée des occurrences repliable.
 */
export function SearchToolView(props: ClaudeToolViewProps) {
  const theme = useTheme()
  const pathFormatter = usePathFormatter()

  const pattern = createMemo(() => {
    const raw = props.input.pattern ?? props.input.query
    return typeof raw === "string" ? `"${raw}"` : '""'
  })

  const searchPath = createMemo(() => {
    const raw = props.input.path
    if (typeof raw !== "string" || !raw) return undefined
    return `in ${pathFormatter.format(raw)}`
  })

  const matchesBadge = createMemo(() => {
    const count = typeof props.metadata.matches === "number"
      ? props.metadata.matches
      : typeof props.metadata.count === "number"
        ? props.metadata.count
        : undefined
    if (count === undefined) return undefined
    return `${count} match${count === 1 ? "" : "es"}`
  })

  const outputText = createMemo(() => (props.output ? props.output.trim() : ""))
  const hasDetails = createMemo(() => Boolean(outputText()))

  return (
    <ToolAccordion
      category={props.category === "grep" ? "grep" : "search"}
      status={props.status}
      createdTime={props.part.time.created}
      completedTime={props.part.time.completed}
      durationMs={props.durationMs}
      defaultExpanded={props.defaultExpanded}
      hasDetails={hasDetails()}
      argumentsContent={
        <ToolArgumentsView
          primary={pattern()}
          secondary={searchPath()}
          badge={matchesBadge()}
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
