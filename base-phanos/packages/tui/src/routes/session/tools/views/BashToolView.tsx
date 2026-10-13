import { createMemo, Show } from "solid-js"
import { useTheme } from "../../../../context/theme"
import { usePathFormatter } from "../../../../context/path-format"
import { ToolAccordion } from "../ToolAccordion"
import { ToolArgumentsView } from "../ToolArgumentsView"
import type { ClaudeToolViewProps } from "../types"

/**
 * Vue spécialisée pour l'outil Bash / Shell.
 * - Ligne d'en-tête : [Bash] $ <commande>
 * - Corps accordéon : Sortie stdout/stderr du processus, indentée et consultable à la demande.
 */
export function BashToolView(props: ClaudeToolViewProps) {
  const theme = useTheme()
  const pathFormatter = usePathFormatter()

  const command = createMemo(() => {
    const raw = props.input.command
    return typeof raw === "string" ? raw.trim() : "..."
  })

  const workdir = createMemo(() => {
    const raw = props.input.workdir
    if (typeof raw !== "string" || !raw || raw === ".") return ""
    return pathFormatter.format(raw)
  })

  const primaryLabel = createMemo(() => `$ ${command()}`)
  const secondaryLabel = createMemo(() => (workdir() ? `(cwd: ${workdir()})` : undefined))
  const cleanOutput = createMemo(() => (props.output ? props.output.trim() : ""))
  const hasOutput = createMemo(() => Boolean(cleanOutput()))

  return (
    <ToolAccordion
      category="bash"
      status={props.status}
      createdTime={props.part.time.created}
      completedTime={props.part.time.completed}
      durationMs={props.durationMs}
      defaultExpanded={props.defaultExpanded ?? (props.status === "error" && hasOutput())}
      hasDetails={hasOutput()}
      argumentsContent={
        <ToolArgumentsView
          primary={primaryLabel()}
          secondary={secondaryLabel()}
        />
      }
    >
      <Show when={hasOutput()}>
        <text fg={props.status === "error" ? theme.text.feedback.error.base : theme.text.muted} wrapMode="word">
          {cleanOutput()}
        </text>
      </Show>
    </ToolAccordion>
  )
}
