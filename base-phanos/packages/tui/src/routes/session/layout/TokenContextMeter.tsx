import { createMemo, Show } from "solid-js"
import { RGBA, TextAttributes } from "@opentui/core"
import type { TokenContextMeterProps } from "./types"

const GOLD = RGBA.fromInts(255, 205, 90, 255)
const AMBER = RGBA.fromInts(250, 190, 60, 255)
const MUTED = RGBA.fromInts(160, 146, 122, 255)
const RED = RGBA.fromInts(231, 76, 60, 255)

/**
 * TokenContextMeter : Affiche la consommation de tokens et une jauge UTF-8 réactive [████░░░░] %.
 * Alerte visuelle par coloration ambre -> or -> rouge selon la saturation du contexte.
 * Conforme à la Règle 1 (Responsabilité unique) et au plafond < 250 lignes.
 */
export function TokenContextMeter(props: TokenContextMeterProps) {
  // Calcul du pourcentage d'utilisation effectif
  const effectivePercent = createMemo<number>(() => {
    if (typeof props.percent === "number") {
      return Math.min(100, Math.max(0, Math.round(props.percent)))
    }

    if (typeof props.tokensUsed === "number" && typeof props.tokensLimit === "number" && props.tokensLimit > 0) {
      const p = (props.tokensUsed / props.tokensLimit) * 100
      return Math.min(100, Math.max(0, Math.round(p)))
    }

    if (typeof props.tokensUsed === "string") {
      const match = props.tokensUsed.match(/(\d+(?:\.\d+)?)\s*k?\s*\/\s*(\d+(?:\.\d+)?)\s*k?/i)
      if (match) {
        const used = parseFloat(match[1])
        const total = parseFloat(match[2])
        if (total > 0) {
          const p = (used / total) * 100
          return Math.min(100, Math.max(0, Math.round(p)))
        }
      }
    }

    return 0
  })

  // Jauge en demi-blocs / blocs UTF-8 (largeur fixe de 10 caractères)
  const progressBar = createMemo(() => {
    const totalChars = 10
    const pct = effectivePercent()
    const filledCount = Math.min(totalChars, Math.max(0, Math.round((pct / 100) * totalChars)))
    const emptyCount = totalChars - filledCount
    const filledStr = "█".repeat(filledCount)
    const emptyStr = "░".repeat(emptyCount)
    return `[${filledStr}${emptyStr}] ${pct}%`
  })

  // Couleur adaptée au seuil de remplissage
  const barColor = createMemo(() => {
    const pct = effectivePercent()
    if (pct >= 90) return RED
    if (pct >= 70) return GOLD
    return AMBER
  })

  const tokensText = createMemo(() => {
    if (typeof props.tokensUsed === "number") {
      const usedFormatted = props.tokensUsed.toLocaleString("fr-FR")
      if (props.tokensLimit) {
        return `${usedFormatted} / ${props.tokensLimit.toLocaleString("fr-FR")}`
      }
      return `${usedFormatted} tokens`
    }
    return props.tokensUsed ?? "0k / 128k"
  })

  return (
    <box flexDirection="column">
      {/* En-tête de section */}
      <box flexDirection="row" justifyContent="space-between" alignItems="center">
        <text fg={MUTED}>Contexte / Tokens :</text>
        <Show when={props.cost !== undefined}>
          <text fg={GOLD}>
            {typeof props.cost === "number" ? `$${props.cost.toFixed(3)}` : String(props.cost)}
          </text>
        </Show>
      </box>

      {/* Barre de progression UTF-8 */}
      <text fg={barColor()} attributes={TextAttributes.BOLD}>
        {progressBar()}
      </text>

      {/* Décompte chiffré des tokens */}
      <text fg={MUTED}>{tokensText()}</text>
    </box>
  )
}
