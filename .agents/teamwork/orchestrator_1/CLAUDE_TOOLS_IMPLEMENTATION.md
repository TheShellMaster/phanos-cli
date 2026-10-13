# Guide d'Implémentation : Affichage des Outils Façon Claude Code

**Projet :** Phanos TUI (sur socle OpenCode / OpenTUI / SolidJS)  
**Auteur :** Spécialiste Outils Claude Code (`claude_tools_specialist`)  
**Cible :** Orchestrateur, Équipe de Développement, Auditeurs & Reviewers  
**Emplacement du code :** `packages/tui/src/routes/session/tools/`  
**Statut :** Composants de référence prêts pour intégration directe  

---

## 1. Vision et Objectifs Ergonomiques

Dans Claude Code (CLI officiel d'Anthropic), l'expérience développeur repose sur une compacité visuelle maximale couplée à une transparence totale :
1. **Badges catégorisés immédiats** : Pastilles colorées à haut contraste (`[Bash]`, `[Read]`, `[Edit]`, `[Grep]`, `[Search]`, `[Web]`, `[Agent]`) permettant d'identifier instantanément le type d'opération sans devoir lire le JSON d'invocation.
2. **Arguments concis et mis en valeur** : Une seule ligne propre mettant en avant les éléments cruciaux (commande shell `$ ...`, chemin relatif du fichier, filtre regex, statistiques de diff `(+12 -3)`).
3. **Spinner ambré fluide & chronométrage réel** :
   - En cours d'exécution : un spinner ambré animé (`#FABE3C` / `#FFCD5A`) couplé à un chronomètre temps réel (`120ms`, `450ms`, `1.4s`).
   - Terminé : checkmark discret `✓` et durée d'exécution totale exacte avec précision milliseconde.
4. **Accordéon dépliable d'un clic** :
   - État replié par défaut pour ne jamais encombrer le fil de discussion.
   - Chevron interactif (`▶` replié, `▼` déplié).
   - Au clic (ou touche clavier), déploiement d'un conteneur bordé contenant les détails bruts (stdout/stderr terminal, diff unifié/split, contenu de fichier).
   - Protection contre le repli intempestif lors de la sélection de texte à la souris.

---

## 2. Découpage Modulaire & Respect des 5 Règles d'Or Phanos

Conformément à la [CHARTE DE MODULARITÉ & D'ARCHITECTURE DU CODE TUI PHANOS](file:///home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/orchestrator_1/CODE_MODULARITY_GUIDELINES.md), l'implémentation est découpée en briques autonomes de moins de 250 lignes :

```
packages/tui/src/routes/session/tools/
├── types.ts                  # Contrat TypeScript strict (ToolCategory, ToolRunStatus, etc.)
├── palette.ts                # Tokens de couleurs ambre (#FABE3C) et palettes des badges
├── ToolRowBadge.tsx          # Pastille [Bash], [Read], [Edit] stylée (~30 lignes)
├── ToolDurationBadge.tsx     # Spinner ambré réactif + chrono temps réel (~90 lignes)
├── ToolAccordion.tsx         # Conteneur interactif avec chevron & volet dépliable (~110 lignes)
├── ToolArgumentsView.tsx     # Formateur de ligne d'arguments épurée (~40 lignes)
├── ClaudeToolPart.tsx        # Routeur principal remplaçant le switch monolithique (~115 lignes)
├── index.ts                  # Barrel export
└── views/                    # Vues spécialisées par catégorie (< 80 lignes chacune)
    ├── BashToolView.tsx
    ├── FileReaderToolView.tsx
    ├── FileEditToolView.tsx
    ├── SearchToolView.tsx
    ├── WebToolView.tsx
    ├── SubagentToolView.tsx
    └── GenericToolView.tsx
```

---

## 3. Spécifications Visuelles & Palette Sémantique

### 3.1. Tokens de Couleurs Ambrés (Mascotte & Spinners)
- `AMBER_SPINNER` : `#FABE3C` (RGB `250, 190, 60`) — Couleur centrale de l'animation d'exécution.
- `AMBER_GLOW` : `#FFCD5A` (RGB `255, 205, 90`) — Effet de surbrillance / focus.
- `AMBER_DEEP` : `#C47614` (RGB `196, 118, 20`) — Bordures et contrastes d'appui.

### 3.2. Badges Catégorisés Claude Code
| Catégorie | Label Badge | Fond (Bg) | Texte (Fg) | Contexte d'usage |
|---|---|---|---|---|
| **bash** | `[Bash]` | `#0E3A40` (Cyan sombre) | `#38BDF8` (Cyan ciel) | Exécution de commandes shell, compilateurs, scripts |
| **read** | `[Read]` | `#1E293B` (Ardoise) | `#60A5FA` (Bleu ciel) | Lecture de code source, inspection de doc |
| **edit** | `[Edit]` | `#422006` (Ambre sombre) | `#F59E0B` (Ambre vif) | Modification de fichiers, patchs, écritures |
| **grep** | `[Grep]` | `#064E3B` (Émeraude sombre)| `#34D399` (Vert vif) | Grep de code, scan regex, recherche textuelle |
| **search** | `[Search]` | `#3B0764` (Pourpre sombre)| `#C084FC` (Mauve vif) | Glob de structure, recherche de fichiers |
| **web** | `[Web]` | `#500724` (Fuchsia sombre)| `#F472B6` (Rose vif) | Téléchargement HTTP, recherche internet |
| **subagent**| `[Agent]` | `#1E1B4B` (Indigo sombre) | `#818CF8` (Indigo ciel)| Délégation subagent, tâche en arrière-plan |
| **generic** | `[Tool]` | `#1E293B` (Ardoise neutre)| `#94A3B8` (Gris acier) | Plugins tiers, outils MCP non reconnus |

---

## 4. Composants Clés & Code Source de Référence

### 4.1. Contrat & Types (`types.ts`)
Fichier : [types.ts](file:///home/theshellpc/Bureau/nouveau-projet/base-opencode/packages/tui/src/routes/session/tools/types.ts)
```typescript
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
```

### 4.2. Badge de Pastille (`ToolRowBadge.tsx`)
Fichier : [ToolRowBadge.tsx](file:///home/theshellpc/Bureau/nouveau-projet/base-opencode/packages/tui/src/routes/session/tools/ToolRowBadge.tsx)
- Rendu d'une pastille compacte avec un espacement ` 1 char ` autour du label.
- Rendu direct sur primitive OpenTUI `<text bg={...} fg={...}>`.

### 4.3. Chronomètre Réactif & Spinner Ambré (`ToolDurationBadge.tsx`)
Fichier : [ToolDurationBadge.tsx](file:///home/theshellpc/Bureau/nouveau-projet/base-opencode/packages/tui/src/routes/session/tools/ToolDurationBadge.tsx)
- Pendant `running` / `streaming` : lance un intervalle réactif SolidJS (`100ms`) pour calculer `now() - createdTime` sans toucher au transcript.
- Utilise `<spinner frames={SPINNER_FRAMES} interval={80} color={AMBER_SPINNER} />` natif OpenTUI.
- Formatage adaptatif : `< 1000ms` $\rightarrow$ `240ms` ; `1s - 60s` $\rightarrow$ `1.4s` ; `> 60s` $\rightarrow$ `1m 24s`.
- Une fois `completed` : affiche un `✓` vert suivi du temps final figé.

### 4.4. Accordéon Interactif (`ToolAccordion.tsx`)
Fichier : [ToolAccordion.tsx](file:///home/theshellpc/Bureau/nouveau-projet/base-opencode/packages/tui/src/routes/session/tools/ToolAccordion.tsx)
- Chevron interactif (`▶` fermé, `▼` ouvert).
- Détection de sélection souris (`renderer.getSelection()?.getSelectedText()`) pour permettre à l'utilisateur de copier du texte sans déclencher un toggle d'accordéon.
- Bordure gauche standardisée (`SplitBorder.customBorderChars`) avec indentation pour une intégration fluide.

### 4.5. Routeur Maître (`ClaudeToolPart.tsx`)
Fichier : [ClaudeToolPart.tsx](file:///home/theshellpc/Bureau/nouveau-projet/base-opencode/packages/tui/src/routes/session/tools/ClaudeToolPart.tsx)
- Normalise l'état asynchrone (`streaming`, `running`, `completed`, `error`, `denied`).
- Mappe les noms d'outils standards (`shell` $\rightarrow$ `bash`, `task` $\rightarrow$ `subagent`, `apply_patch` $\rightarrow$ `edit`).
- Extrait les métadonnées et le contenu de sortie via `toolDisplayMetadata` et `toolDisplayContent`.
- Distribue vers les vues modulaires (`BashToolView`, `FileReaderToolView`, `FileEditToolView`, `SearchToolView`, `WebToolView`, `SubagentToolView`, `GenericToolView`).

---

## 5. Intégration dans `message-parts.tsx` et `session/index.tsx`

### 5.1. Raccordement dans `message-parts.tsx`
Le module est directement exporté depuis `message-parts.tsx` :
```typescript
// packages/tui/src/routes/session/message-parts.tsx
export { ClaudeToolPart } from "./tools/ClaudeToolPart"
export * from "./tools"
```

### 5.2. Raccordement dans `session/index.tsx`
Dans `packages/tui/src/routes/session/index.tsx`, la fonction `ToolPart` (anciennement un switch géant de 250 lignes) est allégée pour déléguer directement à `ClaudeToolPart` :

```tsx
import { ClaudeToolPart } from "./tools"

function ToolPart(props: { part: SessionMessageAssistantTool; images?: boolean }) {
  return [
    <ClaudeToolPart part={props.part} />,
    <Show when={props.images !== false}>
      <ToolImages parts={[props.part]} />
    </Show>,
  ]
}
```

---

## 6. Checklist de Validation

| Point de Contrôle | Critère Attendu | Résultat |
|---|---|---|
| **Modularité** | Aucun fichier > 250 lignes | **Validé** (Tous les fichiers $\le$ 120 lignes) |
| **Responsabilité Unique** | 1 composant visuel = 1 fichier | **Validé** (`types.ts`, `palette.ts`, + 1 composant par fichier) |
| **Badges Claude Code** | 7 catégories distinctes avec contraste clair | **Validé** ([Bash], [Read], [Edit], [Grep], [Search], [Web], [Agent]) |
| **Spinner Ambré** | Couleur `#FABE3C` et frames fluides | **Validé** (`SPINNER_FRAMES` à 80ms) |
| **Chronométrage** | Mesure en direct puis durée finale | **Validé** (`now() - createdTime` dynamique puis figé) |
| **Accordéon interactif** | Clic toggle + protection sélection souris | **Validé** (via `useRenderer().getSelection()`) |
| **Compatibilité OpenCode** | Préserve `SessionMessageAssistantTool` et `toolDisplayContent` | **Validé** (aucune altération de la plomberie native) |
