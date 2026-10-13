import { createMemo, Match, Switch } from "solid-js"
import type { SessionMessageAssistantTool } from "@opencode/client"
import { canonicalToolName, toolDisplayContent, toolDisplayMetadata } from "../../../util/tool-display"
import type { ClaudeToolViewProps, ToolCategory, ToolRunStatus } from "./types"
import { BashToolView } from "./views/BashToolView"
import { FileReaderToolView } from "./views/FileReaderToolView"
import { FileEditToolView } from "./views/FileEditToolView"
import { SearchToolView } from "./views/SearchToolView"
import { WebToolView } from "./views/WebToolView"
import { SubagentToolView } from "./views/SubagentToolView"
import { GenericToolView } from "./views/GenericToolView"

export interface ClaudeToolPartProps {
  part: SessionMessageAssistantTool
  defaultExpanded?: boolean
}

/**
 * Routeur principal des outils de travail inspiré de Claude Code pour Phanos.
 * Analyse l'état de l'outil, catégorise le badge et distribue le rendu
 * vers le sous-composant spécialisé approprié.
 */
export function ClaudeToolPart(props: ClaudeToolPartProps) {
  const toolName = createMemo(() => props.part.name)
  const canonical = createMemo(() => canonicalToolName(toolName()))

  const category = createMemo((): ToolCategory => {
    const name = canonical().toLowerCase()
    if (name === "shell" || name === "bash") return "bash"
    if (name === "read") return "read"
    if (name === "write" || name === "edit" || name === "patch") return "edit"
    if (name === "grep" || name === "glob") return "grep"
    if (name === "websearch") return "search"
    if (name === "webfetch" || name === "web") return "web"
    if (name === "subagent" || name === "task") return "subagent"
    return "generic"
  })

  const status = createMemo((): ToolRunStatus => {
    const s = props.part.state.status
    if (s === "error") {
      const msg = props.part.state.error.message || ""
      if (
        msg.includes("QuestionRejectedError") ||
        msg.includes("rejected permission") ||
        msg.includes("user dismissed")
      ) {
        return "denied"
      }
      return "error"
    }
    return s
  })

  const input = createMemo((): Record<string, unknown> => {
    const raw = props.part.state.input
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      return raw as Record<string, unknown>
    }
    return {}
  })

  const metadata = createMemo((): Record<string, unknown> => {
    return toolDisplayMetadata(props.part.state)
  })

  const output = createMemo((): string | undefined => {
    if (props.part.state.status === "error") {
      return props.part.state.error.message
    }
    if (props.part.state.status === "streaming") {
      return undefined
    }
    return toolDisplayContent(props.part.state)
      .flatMap((content) => (content.type === "text" ? [content.text] : [content.name ?? content.uri]))
      .join("\n")
  })

  const viewProps = createMemo((): ClaudeToolViewProps => ({
    part: props.part,
    tool: toolName(),
    category: category(),
    input: input(),
    metadata: metadata(),
    output: output(),
    status: status(),
    defaultExpanded: props.defaultExpanded,
  }))

  return (
    <Switch fallback={<GenericToolView {...viewProps()} />}>
      <Match when={category() === "bash"}>
        <BashToolView {...viewProps()} />
      </Match>
      <Match when={category() === "read"}>
        <FileReaderToolView {...viewProps()} />
      </Match>
      <Match when={category() === "edit"}>
        <FileEditToolView {...viewProps()} />
      </Match>
      <Match when={category() === "grep" || category() === "search"}>
        <SearchToolView {...viewProps()} />
      </Match>
      <Match when={category() === "web"}>
        <WebToolView {...viewProps()} />
      </Match>
      <Match when={category() === "subagent"}>
        <SubagentToolView {...viewProps()} />
      </Match>
    </Switch>
  )
}
