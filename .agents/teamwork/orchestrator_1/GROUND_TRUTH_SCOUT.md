# GROUND TRUTH SCOUT — BASE TECHNIQUE OPENCODE / OPENTUI
**Document de repérage et de vérité terrain pour l'équipe Phanos**  
*Généré par : Field Scout & Technical Unblocker*  
*Date : 2026-10-13*  
*Objectif : Zéro hallucination. Signatures réelles, props valides, imports exacts et patterns testés sur le code source.*

---

## 1. Composants Intrinsèques OpenTUI Solid (`@opentui/solid` & `@opentui/core`)

Dans `base-opencode/packages/tui`, le JSX n'utilise **pas** React ni les balises HTML classiques (`div`, `span` HTML classique). Il utilise les primitives intrinsèques du terminal fournies par `@opentui/solid` (typées via `JSX.Element`).

### 1.1. Balise `<box>` — Layout et Conteneurs

Le composant `<box>` est le bloc de mise en page principal (système flexbox terminal basé sur Yoga/Taffy).

#### Props réelles et vérifiées sur `<box>` :
```tsx
<box
  // Flexbox Layout
  flexDirection="row" | "column" | "row-reverse" | "column-reverse"
  flexGrow={1}
  flexShrink={0}
  flexWrap="wrap" | "nowrap"
  justifyContent="flex-start" | "flex-end" | "center" | "space-between" | "space-around"
  alignItems="flex-start" | "flex-end" | "center" | "stretch"
  gap={1}
  columnGap={1}
  rowGap={1}

  // Dimensions & Positionnement
  width={10} | "100%"
  height={5}
  minWidth={0}
  maxWidth="100%"
  minHeight={0}
  position="relative" | "absolute"
  top={0}
  left={0}
  right={0}
  bottom={0}
  zIndex={10}
  overflow="hidden" | "visible" | "scroll"
  visible={true}

  // Marges et Espacement interne
  padding={1}
  paddingX={1}
  paddingY={1}
  paddingLeft={2}
  paddingRight={1}
  paddingTop={1}
  paddingBottom={1}
  marginLeft={1}
  marginRight={1}
  marginTop={1}
  marginBottom={1}

  // Style visuel (Couleurs et Bordures)
  backgroundColor={theme.background.base} // Accepte RGBA
  bg={theme.background.base}             // Alias court de backgroundColor
  borderColor={theme.border.base}         // RGBA
  border={["left"]}                      // Accepte string[], ex: ["left"], ["top", "bottom"], ["left", "right", "top", "bottom"]
  customBorderChars={SplitBorder.customBorderChars} // Caractères de bordure personnalisés

  // Événements souris
  onMouseOver={() => setHover(true)}
  onMouseOut={() => setHover(false)}
  onMouseUp={(event: MouseEvent) => { /* clic */ }}
  ref={(el: BoxRenderable) => { /* ref d'élément */ }}
>
  {children}
</box>
```

---

### 1.2. Balise `<text>` — Rendu Typographique Terminal

Le composant `<text>` est le réceptacle obligatoire pour afficher des chaînes de caractères.

#### Props réelles et vérifiées sur `<text>` :
```tsx
<text
  fg={theme.text.base}                 // Couleur avant-plan (RGBA)
  bg={theme.background.base}           // Couleur arrière-plan (RGBA)
  attributes={TextAttributes.BOLD}     // Bitmask d'attributs de style
  wrapMode="none" | "word" | "char"    // Mode de retour à la ligne
  truncate={true}                      // Tronquer si dépassement
  width={2} | "100%"
  maxWidth="100%"
  minWidth={0}
  flexGrow={1}
  flexShrink={0}
  paddingLeft={1}
  selectable={false}
  onMouseUp={(event: MouseEvent) => {}}
>
  Texte ou {" "} expressions
</text>
```

---

### 1.3. Attributs de Texte : `TextAttributes` (`@opentui/core`)

`TextAttributes` est un enum binaire (bitmask). Les styles se combinent via l'opérateur bitwise `|`.

```ts
import { TextAttributes } from "@opentui/core"

// Valeurs disponibles :
TextAttributes.BOLD           // Gras
TextAttributes.DIM            // Atténué / estompé
TextAttributes.ITALIC         // Italique
TextAttributes.UNDERLINE      // Souligné
TextAttributes.STRIKETHROUGH  // Barré (utilisé pour les outils denied)
TextAttributes.INVERSE        // Inversé vidéo
TextAttributes.NONE           // Aucun effet (0)

// Exemple de combinaison valide :
const style = TextAttributes.BOLD | TextAttributes.INVERSE
```

---

### 1.4. Système de Couleurs : `RGBA` (`@opentui/core`)

Toutes les couleurs des composants OpenTUI utilisent la classe `RGBA`.
```ts
import { RGBA } from "@opentui/core"

// Constructeurs utiles :
const amber = RGBA.fromInts(250, 190, 60, 255)       // #FABE3C (r, g, b, a de 0 à 255)
const semitransparent = RGBA.fromValues(0.98, 0.74, 0.23, 0.6) // r, g, b (0..1), a (0..1)
const blackDim = RGBA.fromInts(0, 0, 0, 70)          // Opacité réduite pour overlay
const transparent = RGBA.fromValues(0, 0, 0, 0)
const copy = RGBA.clone(color)

// Fonctions par défaut :
RGBA.defaultForeground()
RGBA.defaultBackground()
```

---

## 2. Timer d'Animation & Mascotte Pixel (Pattern SolidJS Vérifié)

OpenTUI n'utilise pas de DOM standard (`requestAnimationFrame` n'est pas universel en terminal pur).  
Le pattern d'animation standard d'OpenCode (validé dans `src/component/spinner.tsx`, `src/ui/animation.ts` et `src/routes/session/tools/ToolDurationBadge.tsx`) repose sur les primitives réactives Solid : `createSignal`, `createEffect`, `onCleanup`, et `setInterval`.

### Pattern Réactif de Frame Loop pour Mascotte :
```tsx
import { createSignal, createEffect, onCleanup, Show } from "solid-js"
import { useConfig } from "../config"

export function MascotPixelWidget(props: { mode: "idle" | "working" | "speaking" }) {
  const config = useConfig().data
  const [frameIndex, setFrameIndex] = createSignal(0)

  createEffect(() => {
    // Respecte le réglage global de désactivation des animations si configuré
    if (config.animations === false) return

    // Vitesse adaptée selon le mode (ex: 200ms en idle, 80ms en travail)
    const intervalMs = props.mode === "working" ? 80 : 250

    const timer = setInterval(() => {
      setFrameIndex((current) => (current + 1) % MASCOT_FRAMES[props.mode].length)
    }, intervalMs)

    // Nettoyage obligatoire pour éviter toute fuite de ressources / double boucle
    onCleanup(() => clearInterval(timer))
  })

  const currentFrame = () => MASCOT_FRAMES[props.mode][frameIndex()]

  return (
    <box flexDirection="column">
      {/* Rendu des lignes de pixels */}
    </box>
  )
}
```

### Note sur le composant intrinsèque `<spinner>` :
OpenTUI dispose d'un composant de spinner terminal natif :
```tsx
import { SPINNER_FRAMES } from "../../component/spinner-frames"
// Utilisation :
<spinner frames={SPINNER_FRAMES} interval={80} color={theme.text.muted} />
```
*(Nécessite que `registerOpencodeSpinner()` ait été appelé au démarrage, ce qui est déjà le cas dans `src/app.tsx`).*

---

## 3. Architecture d'Exécution et Rendu des Outils

Dans l'architecture OpenCode originale :
- `src/routes/session/message-parts.tsx` définit :
  - `toolDisplay(name)` : normalise le nom de l'outil (`canonicalToolName`) et renvoie son identifiant de rendu ou `"generic"`.
  - `InlineToolRow` : ligne générique avec icône fixe (largeur 2), spinner d'attente, label et gestion d'erreur cliquable.
- `src/routes/session/index.tsx` :
  - `ToolPart` reçoit `props.part: SessionMessageAssistantTool`.
  - Évalue les props de données :
    - `metadata`: `toolDisplayMetadata(props.part.state)`
    - `input`: `props.part.state.input` (arguments envoyés par le LLM)
    - `output`: `toolDisplayContent(props.part.state)` (résultat texte ou URI)
  - `status`: `"streaming" | "running" | "completed" | "error"`.
  - `useToolPermission(() => props.part)` : détecte si l'outil attend une validation utilisateur.
- `src/routes/session/tools/` (Refonte modulaire Phanos - Claude Code style) :
  - `ToolAccordion.tsx` : Accordéon pliable cliquable avec header sur 1 ligne (`▼`/`▶`, Badge, Arguments, Chronomètre).
  - `ToolRowBadge.tsx` : Badges colorés par catégorie (`[Bash]`, `[Read]`, `[Edit]`, `[Search]`, `[Subagent]`, etc.).
  - `ToolDurationBadge.tsx` : Spinner ambré + chronomètre en direct (`setInterval` à 100ms) pendant `running`, puis `✓ 240ms` à l'état `completed`.

---

## 4. Règles d'Imports Valides (Checklist Anti-Hallucination)

| Ce que vous voulez importer | Chemin d'import réel EXACT |
|---|---|
| Primitives SolidJS | `import { createSignal, createMemo, createEffect, onCleanup, Show, Switch, Match, For } from "solid-js"` |
| Types JSX Solid Terminal | `import type { JSX } from "@opentui/solid"` |
| Couleurs et Événements | `import { RGBA, TextAttributes, type MouseEvent } from "@opentui/core"` |
| Hook Renderer & Dimensions | `import { useRenderer, useTerminalDimensions } from "@opentui/solid"` |
| Thème visuel | `import { useTheme } from "../../../context/theme"` (ou chemin relatif adapté) |
| Configuration | `import { useConfig } from "../../../config"` |
| Caractères de bordures | `import { SplitBorder } from "../../../ui/border"` |
| Frames du Spinner | `import { SPINNER_FRAMES } from "../../../component/spinner-frames"` |
| Types Session & Messages | `import type { SessionMessageAssistantTool } from "@opencode/client"` |

---

## 5. Règle d'Or Modulaire (Strict Enforced)
- **Max 250 lignes par fichier `.tsx`**.
- **1 composant = 1 fichier**.
- Pas d'injection de logique complexe directement dans `session/index.tsx` : toujours importer des composants enfants autonomes depuis un sous-dossier modulaire (ex: `src/routes/session/tools/` ou `src/component/mascot/`).
