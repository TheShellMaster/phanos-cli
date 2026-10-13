import { createMemo, createSignal, Show, type JSX } from "solid-js"
import { useRenderer } from "@opentui/solid"
import { useTheme } from "../../../context/theme"
import { SplitBorder } from "../../../ui/border"
import { ToolRowBadge } from "./ToolRowBadge"
import { ToolDurationBadge } from "./ToolDurationBadge"
import type { ToolCategory, ToolRunStatus } from "./types"

export interface ToolAccordionProps {
  category: ToolCategory
  customLabel?: string
  status: ToolRunStatus
  createdTime?: number
  completedTime?: number
  durationMs?: number
  defaultExpanded?: boolean
  argumentsContent: JSX.Element
  children?: JSX.Element
  hasDetails?: boolean
  onToggle?: (expanded: boolean) => void
}

/**
 * Accordéon interactif dépliable/repliable d'un clic pour outils Claude Code.
 * - En-tête concise sur une seule ligne (Chevron + Badge + Arguments + Chronomètre).
 * - Volet déroulant bordé pour examiner les sorties détaillées (stdout, diffs, erreurs)
 *   sans encombrer la conversation.
 */
export function ToolAccordion(props: ToolAccordionProps) {
  const theme = useTheme()
  const renderer = useRenderer()
  const [expanded, setExpanded] = createSignal(Boolean(props.defaultExpanded))
  const [hover, setHover] = createSignal(false)

  const canExpand = createMemo(() => props.hasDetails !== false && Boolean(props.children))

  const toggle = () => {
    if (!canExpand()) return
    // Ne pas replier si l'utilisateur est en train de surligner/sélectionner du texte
    if (renderer.getSelection()?.getSelectedText()) return
    const next = !expanded()
    setExpanded(next)
    props.onToggle?.(next)
  }

  const chevron = createMemo(() => {
    if (!canExpand()) return " "
    return expanded() ? "▼" : "▶"
  })

  return (
    <box flexDirection="column" flexShrink={0} paddingLeft={1} marginBottom={expanded() ? 1 : 0}>
      {/* Barre d'en-tête cliquable */}
      <box
        flexDirection="row"
        alignItems="center"
        gap={1}
        paddingLeft={1}
        paddingRight={1}
        backgroundColor={hover() && canExpand() ? theme.decrease(theme.background.raised.base) : undefined}
        onMouseOver={() => canExpand() && setHover(true)}
        onMouseOut={() => setHover(false)}
        onMouseUp={toggle}
      >
        {/* Chevron interactif */}
        <text fg={canExpand() ? theme.text.muted : theme.decrease(theme.text.muted)}>
          {chevron()}
        </text>

        {/* Badge catégorie [Bash], [Read], etc. */}
        <ToolRowBadge category={props.category} customLabel={props.customLabel} />

        {/* Ligne d'arguments épurée */}
        <box flexGrow={1} minWidth={0} flexDirection="row" overflow="hidden">
          {props.argumentsContent}
        </box>

        {/* Indicateur de statut / Spinner ambré / Durée finale */}
        <ToolDurationBadge
          status={props.status}
          createdTime={props.createdTime}
          completedTime={props.completedTime}
          durationMs={props.durationMs}
        />
      </box>

      {/* Contenu déroulant détaillé */}
      <Show when={expanded() && canExpand()}>
        <box
          marginTop={1}
          marginLeft={2}
          paddingLeft={2}
          border={["left"]}
          borderColor={theme.decrease(theme.background.base)}
          customBorderChars={SplitBorder.customBorderChars}
          flexDirection="column"
        >
          {props.children}
        </box>
      </Show>
    </box>
  )
}
