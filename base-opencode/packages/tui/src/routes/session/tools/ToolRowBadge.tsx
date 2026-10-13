import { createMemo } from "solid-js"
import { CATEGORY_STYLES } from "./palette"
import type { ToolCategory } from "./types"

export interface ToolRowBadgeProps {
  category: ToolCategory
  customLabel?: string
}

/**
 * Pastille de catégorie typée façon Claude Code ([Bash], [Read], [Edit], etc.)
 * Assure un repère visuel immédiat dans le flux de conversation du terminal.
 */
export function ToolRowBadge(props: ToolRowBadgeProps) {
  const style = createMemo(() => CATEGORY_STYLES[props.category] ?? CATEGORY_STYLES.generic)
  const label = createMemo(() => props.customLabel ?? style().label)

  return (
    <box flexShrink={0} flexDirection="row">
      <text bg={style().bg} fg={style().fg}>
        {` ${label()} `}
      </text>
    </box>
  )
}
