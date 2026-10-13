import { Show } from "solid-js"
import { useTerminalDimensions } from "@opentui/solid"
import { RGBA } from "@opentui/core"
import type { AsymmetricLayoutProps } from "./types"

const BORDER_COLOR = RGBA.fromInts(196, 118, 20, 180) // Ambre/bronze

/**
 * Conteneur Split Screen Asymétrique :
 * - Volet gauche (~28-32 colonnes) : Inspection & Contexte agent
 * - Volet droit (flexGrow) : Fil de discussion et saisie suspendue
 */
export function AsymmetricLayout(props: AsymmetricLayoutProps) {
  const dimensions = useTerminalDimensions()
  const showSidebar = () => dimensions().width >= 80
  const sidebarWidth = () => props.sidebarWidth ?? 30

  return (
    <box flexGrow={1} flexDirection="row" width={dimensions().width} height={dimensions().height}>
      {/* Volet Gauche (Panneau d'inspection) */}
      <Show when={showSidebar()}>
        <box
          width={sidebarWidth()}
          minWidth={24}
          maxWidth={36}
          flexDirection="column"
          border={["right"]}
          borderColor={BORDER_COLOR}
          paddingRight={1}
        >
          {props.sidebar}
        </box>
      </Show>

      {/* Volet Droit Principal (Fil de discussion) */}
      <box flexGrow={1} minWidth={0} flexDirection="column">
        {/* Barre d'en-tête supérieure avec la Mascotte Phanos dans le coin droit */}
        <box flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={1}>
          <text fg={RGBA.fromInts(250, 190, 60, 255)}>PHANOS</text>
          <Show when={props.mascotHeader}>{props.mascotHeader}</Show>
        </box>

        {/* Zone de contenu principale */}
        <box flexGrow={1} minHeight={0} flexDirection="column">
          {props.main}
        </box>
      </box>
    </box>
  )
}
