import { createMemo, Show } from "solid-js"
import { RGBA } from "@opentui/core"
import type { AmberFloatingComposerProps } from "./types"

// Palette ambrée Phanos (#FABE3C / #FFCD5A / #C47614)
const AMBER_PRIMARY = RGBA.fromInts(250, 190, 60, 255) // #FABE3C
const AMBER_GLOW = RGBA.fromInts(255, 205, 90, 255) // #FFCD5A
const AMBER_SUBTLE = RGBA.fromInts(196, 118, 20, 200) // #C47614

/**
 * AmberFloatingComposer : Conteneur de saisie suspendu décollé du bas avec contours ambrés.
 * Encapsule le prompt OpenCode sans altérer son moteur d'autocomplétion ou de frappe.
 * Conforme à la Règle 1 (Responsabilité unique) et au plafond < 250 lignes.
 */
export function AmberFloatingComposer(props: AmberFloatingComposerProps) {
  const borderColor = createMemo(() => {
    if (props.isFocused) {
      return AMBER_GLOW
    }
    return AMBER_PRIMARY
  })

  return (
    <box
      flexDirection="column"
      flexGrow={0}
      minWidth={0}
      marginTop={1}
      marginBottom={0}
      paddingX={props.padding ?? 1}
      border={["top", "bottom", "left", "right"]}
      borderColor={borderColor()}
    >
      {/* Étiquette d'état suspendue optionnelle */}
      <Show when={props.statusText}>
        <box flexDirection="row" justifyContent="flex-end" paddingRight={1}>
          <text fg={AMBER_SUBTLE}>◆ {props.statusText}</text>
        </box>
      </Show>

      {/* Rendu du composant de saisie injecté */}
      {props.children}
    </box>
  )
}
