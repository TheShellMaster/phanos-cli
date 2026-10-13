import { createMemo, For, Show } from "solid-js"
import { useTheme } from "../../../../context/theme"
import { ToolAccordion } from "../ToolAccordion"
import { ToolArgumentsView } from "../ToolArgumentsView"
import type { ClaudeToolViewProps } from "../types"

/**
 * Vue générique de repli pour les outils arbitraires et plugins.
 * - En-tête : [Tool] toolName key=val...
 * - Corps accordéon : Paramètres d'entrée détaillés et sortie brute.
 */
export function GenericToolView(props: ClaudeToolViewProps) {
  const theme = useTheme()

  const entries = createMemo(() => Object.entries(props.input))

  const summary = createMemo(() => {
    const list = entries()
      .filter(([, v]) => typeof v === "string" || typeof v === "number" || typeof v === "boolean")
      .map(([k, v]) => `${k}=${String(v)}`)
      .join(" ")
    return list ? list : undefined
  })

  const outputText = createMemo(() => (props.output ? props.output.trim() : ""))
  const hasDetails = createMemo(() => entries().length > 0 || Boolean(outputText()))

  return (
    <ToolAccordion
      category="generic"
      customLabel={props.tool}
      status={props.status}
      createdTime={props.part.time.created}
      completedTime={props.part.time.completed}
      durationMs={props.durationMs}
      defaultExpanded={props.defaultExpanded}
      hasDetails={hasDetails()}
      argumentsContent={
        <ToolArgumentsView
          primary={props.tool}
          secondary={summary()}
        />
      }
    >
      <Show when={entries().length > 0}>
        <box flexDirection="column" gap={1} marginBottom={outputText() ? 1 : 0}>
          <For each={entries()}>
            {([key, val]) => (
              <box flexDirection="row">
                <text fg={theme.text.muted}>{key}: </text>
                <text fg={theme.text.base} wrapMode="word">
                  {typeof val === "string" ? val : JSON.stringify(val, null, 2)}
                </text>
              </box>
            )}
          </For>
        </box>
      </Show>

      <Show when={outputText()}>
        <text fg={props.status === "error" ? theme.text.feedback.error.base : theme.text.muted} wrapMode="word">
          {outputText()}
        </text>
      </Show>
    </ToolAccordion>
  )
}
