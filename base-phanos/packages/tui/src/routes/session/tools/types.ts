import type { RGBA } from "@opentui/core"
import type { SessionMessageAssistantTool } from "@opencode/client"

export type ToolCategory =
  | "bash"
  | "read"
  | "edit"
  | "grep"
  | "search"
  | "web"
  | "subagent"
  | "generic"

export type ToolRunStatus =
  | "streaming"
  | "running"
  | "completed"
  | "error"
  | "denied"

export interface ToolCategoryStyle {
  label: string
  fg: RGBA
  bg: RGBA
  icon: string
}

export interface ClaudeToolViewProps {
  part: SessionMessageAssistantTool
  tool: string
  category: ToolCategory
  input: Record<string, unknown>
  metadata: Record<string, unknown>
  output?: string
  status: ToolRunStatus
  durationMs?: number
  defaultExpanded?: boolean
}
