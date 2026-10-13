import { createMemo, Show } from "solid-js"
import { useTheme } from "../../../../context/theme"
import { usePathFormatter } from "../../../../context/path-format"
import { ToolAccordion } from "../ToolAccordion"
import { ToolArgumentsView } from "../ToolArgumentsView"
import type { ClaudeToolViewProps } from "../types"

/**
 * Vue spécialisée pour l'édition et écriture de fichiers (Edit, Write, Patch).
 * - En-tête : [Edit] src/routes/session/index.tsx (+12 -3)
 * - Corps accordéon : Diff visuel détaillé repliable d'un clic pour garder l'espace de lecture clair.
 */
export function FileEditToolView(props: ClaudeToolViewProps) {
  const theme = useTheme()
  const pathFormatter = usePathFormatter()

  const filePath = createMemo(() => {
    const raw = props.input.path ?? props.input.filePath ?? props.metadata.file
    return typeof raw === "string" ? pathFormatter.format(raw) : "..."
  })

  const diffStats = createMemo(() => {
    const additions = typeof props.metadata.additions === "number" ? props.metadata.additions : undefined
    const deletions = typeof props.metadata.deletions === "number" ? props.metadata.deletions : undefined
    if (additions === undefined && deletions === undefined) return undefined
    return `(+${additions ?? 0} -${deletions ?? 0})`
  })

  const diffContent = createMemo(() => {
    if (typeof props.metadata.diff === "string") return props.metadata.diff
    if (typeof props.output === "string") return props.output.trim()
    return ""
  })

  const hasDetails = createMemo(() => Boolean(diffContent()))

  return (
    <ToolAccordion
      category="edit"
      status={props.status}
      createdTime={props.part.time.created}
      completedTime={props.part.time.completed}
      durationMs={props.durationMs}
      defaultExpanded={props.defaultExpanded ?? (props.status === "error" && hasDetails())}
      hasDetails={hasDetails()}
      argumentsContent={
        <ToolArgumentsView
          primary={filePath()}
          badge={diffStats()}
        />
      }
    >
      <Show when={hasDetails()}>
        <text fg={props.status === "error" ? theme.text.feedback.error.base : theme.text.base} wrapMode="word">
          {diffContent()}
        </text>
      </Show>
    </ToolAccordion>
  )
}
