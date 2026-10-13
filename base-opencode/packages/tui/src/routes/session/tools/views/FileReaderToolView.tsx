import { createMemo, For, Show } from "solid-js"
import { useTheme } from "../../../../context/theme"
import { usePathFormatter } from "../../../../context/path"
import { ToolAccordion } from "../ToolAccordion"
import { ToolArgumentsView } from "../ToolArgumentsView"
import type { ClaudeToolViewProps } from "../types"

/**
 * Vue spécialisée pour la lecture de fichiers (Read).
 * - En-tête : [Read] path/to/file.ts :1-50
 * - Corps accordéon : Liste des fichiers chargés ou aperçu du contenu sans saturer l'écran.
 */
export function FileReaderToolView(props: ClaudeToolViewProps) {
  const theme = useTheme()
  const pathFormatter = usePathFormatter()

  const filePath = createMemo(() => {
    const raw = props.input.path
    return typeof raw === "string" ? pathFormatter.format(raw) : "..."
  })

  const lineRange = createMemo(() => {
    const offset = typeof props.input.offset === "number" ? props.input.offset : undefined
    const limit = typeof props.input.limit === "number" ? props.input.limit : undefined
    if (offset === undefined && limit === undefined) return undefined
    const start = offset ?? 1
    const end = limit !== undefined ? start + limit - 1 : ""
    return `:${start}-${end}`
  })

  const loadedFiles = createMemo(() => {
    const loaded = props.metadata.loaded
    if (!Array.isArray(loaded)) return []
    return loaded.filter((item): item is string => typeof item === "string")
  })

  const cleanOutput = createMemo(() => (props.output ? props.output.trim() : ""))
  const hasDetails = createMemo(() => loadedFiles().length > 0 || Boolean(cleanOutput()))

  return (
    <ToolAccordion
      category="read"
      status={props.status}
      createdTime={props.part.time.created}
      completedTime={props.part.time.completed}
      durationMs={props.durationMs}
      defaultExpanded={props.defaultExpanded}
      hasDetails={hasDetails()}
      argumentsContent={
        <ToolArgumentsView
          primary={filePath()}
          secondary={lineRange()}
        />
      }
    >
      <Show when={loadedFiles().length > 0}>
        <box flexDirection="column" gap={1}>
          <text fg={theme.text.muted}>Loaded references:</text>
          <For each={loadedFiles()}>
            {(file) => (
              <text fg={theme.text.base}>
                ↳ {pathFormatter.format(file)}
              </text>
            )}
          </For>
        </box>
      </Show>

      <Show when={cleanOutput() && loadedFiles().length === 0}>
        <text fg={theme.text.muted} wrapMode="word">
          {cleanOutput()}
        </text>
      </Show>
    </ToolAccordion>
  )
}
