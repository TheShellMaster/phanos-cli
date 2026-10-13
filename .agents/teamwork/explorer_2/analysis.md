# Analyse Technique Approfondie — Exigence R2 (Disposition Asymétrique Split Screen & Layout)

**Agent :** `explorer_2` (Teamwork Preview Explorer)  
**Date :** 2026-10-13  
**Cible :** `base-opencode/packages/tui` — Exigence R2 de Phanos  
**Périmètre :** `src/routes/session/layout/`, `src/routes/session/index.tsx`, réactivité terminale, modularité et conformité OpenTUI.

---

## 1. Résumé Exécutif

L'audit technique de l'Exigence R2 (*Disposition Asymétrique Split Screen*) montre que le socle de départ a été esquissé dans `src/routes/session/layout/` (`AsymmetricLayout.tsx`, `AsymmetricSidebar.tsx`, `types.ts`, `index.ts`), mais qu'il est actuellement **incomplet, non raccordé et partiellement défaillant** :

1. **Non-intégration dans `SessionRoute` (0% raccordé) :**  
   Ni `AsymmetricLayout` ni `AsymmetricSidebar` ne sont importés ou utilisés dans `src/routes/session/index.tsx`. L'interface de session tourne encore sur le gabarit monolithique standard d'OpenCode (3 641 lignes).
2. **Volet Gauche (Sidebar) incomplet et non modulaire :**  
   `AsymmetricSidebar.tsx` est un stub rigide de 53 lignes avec valeurs textuelles statiques en dur (`"opencode/free"`, `"0k / 128k"`). Deux des quatre sections obligatoires (liste des sous-agents et historique des activités récentes) sont totalement absentes. Aucun des 4 sous-composants modulaires prévus par la Charte d'Architecture (`ModelStatusBadge`, `TokenContextMeter`, `SubagentTreeList`, `ActivityHistoryFeed`) n'existe.
3. **Volet Droit Principal dépourvu du Composer Ambré suspendu :**  
   Le composant `AmberFloatingComposer.tsx` n'existe pas. Le composant `Prompt` standard est rendu directement au ras du bas de l'écran.
4. **Anomalie de Seuil Responsive (< 100 colonnes) :**  
   `AsymmetricLayout.tsx` utilise un seuil `width >= 80` au lieu de `width >= 100`. Sur un terminal standard de 80 colonnes, réserver 30 colonnes à la barre latérale réduit la zone de discussion à ~46 colonnes effectives, brisant l'aération et la lisibilité des blocs markdown et des accordéons d'outils.
5. **Dimensions absolues forcées sur la racine :**  
   `AsymmetricLayout.tsx` impose `width={dimensions().width} height={dimensions().height}` sur son conteneur `<box>` racine, ce qui est incompatible avec la présence d'onglets verticaux (`SessionTabs orientation="vertical"` d'une largeur de 20-25 colonnes) et cause un débordement horizontal.

---

## 2. Inspection Détaillée de `src/routes/session/layout/`

### 2.1. Fichiers Existants et Métriques

Le dossier `base-opencode/packages/tui/src/routes/session/layout/` comprend 4 fichiers :

| Fichier | Taille (octets) | Lignes | Statut actuel |
|---|---|---|---|
| `types.ts` | 182 | 9 | Schéma minimal (`AsymmetricLayoutProps` uniquement) |
| `index.ts` | 95 | 4 | Re-export basique |
| `AsymmetricLayout.tsx` | 1 762 | 51 | Conteneur split-screen avec anomalie responsive et dimensions rigides |
| `AsymmetricSidebar.tsx` | 1 649 | 53 | Stub statique incomplet (manque 2 sections sur 4) |

### 2.2. Analyse Critique de `AsymmetricLayout.tsx`

```tsx
// Source : src/routes/session/layout/AsymmetricLayout.tsx (lignes 13-48)
export function AsymmetricLayout(props: AsymmetricLayoutProps) {
  const dimensions = useTerminalDimensions()
  const showSidebar = () => dimensions().width >= 80  // ⚠️ ANOMALIE 1 : seuil à 80 au lieu de 100
  const sidebarWidth = () => props.sidebarWidth ?? 30

  return (
    // ⚠️ ANOMALIE 2 : width et height absolues forcent la taille terminale globale
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
        <box flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={1}>
          <text fg={RGBA.fromInts(250, 190, 60, 255)}>PHANOS</text>
          <Show when={props.mascotHeader}>{props.mascotHeader}</Show>
        </box>
        <box flexGrow={1} minHeight={0} flexDirection="column">
          {props.main}
        </box>
      </box>
    </box>
  )
}
```

#### Défauts relevés :
1. **Seuil responsive inadapté :** L'exigence R2 stipule un collapse automatique sur terminaux étroits `< 100 colonnes`. Le code applique `>= 80`. Sur un écran de 80 colonnes, la barre latérale de 30 colonnes ne laisse que 50 colonnes au chat (et même ~46 colonnes après déduction du padding).
2. **Dimensionnement absolu :** Forcer `width={dimensions().width}` ignore les conteneurs parents flexibles. Dans `app.tsx`, si les onglets verticaux de session (`SessionTabs orientation="vertical"`) sont activés, la largeur disponible est amputée de ~25 colonnes. Forcer `dimensions().width` pousse la fenêtre hors de l'écran du terminal.
3. **Alignement d'en-tête de la mascotte :** Le header `<box flexDirection="row" justifyContent="space-between" alignItems="center">` place "PHANOS" à gauche et `props.mascotHeader` à droite. La mascotte fait 4 lignes de haut (`matrix.ts`). Avec `alignItems="center"`, le texte "PHANOS" se retrouve centré verticalement sur 4 lignes au lieu d'être aligné sur la première ligne.

### 2.3. Analyse Critique de `AsymmetricSidebar.tsx`

```tsx
// Source : src/routes/session/layout/AsymmetricSidebar.tsx (lignes 19-51)
export function AsymmetricSidebar(props: AsymmetricSidebarProps) {
  return (
    <box flexDirection="column" gap={1} paddingLeft={1} paddingTop={1}>
      <box flexDirection="column">
        <text fg={GOLD}>◈ INSPECTION</text>
        <text fg={MUTED}>───────────────</text>
      </box>
      {/* Statut Modèle */}
      <box flexDirection="column">
        <text fg={MUTED}>Modèle actif :</text>
        <text fg={AMBER}>{props.modelName ?? "opencode/free"}</text>
      </box>
      {/* Métriques Contexte */}
      <box flexDirection="column">
        <text fg={MUTED}>Contexte / Tokens :</text>
        <text fg={AMBER}>{props.tokensUsed ?? "0k / 128k"}</text>
      </box>
      {/* Outils & Sous-agents */}
      <box flexDirection="column">
        <text fg={MUTED}>Outils sollicités :</text>
        <text fg={AMBER}>{props.activeToolsCount ?? 0} actif(s)</text>
      </box>
      <box flexGrow={1} minHeight={0} flexDirection="column">
        {props.children}
      </box>
    </box>
  )
}
```

#### Défauts relevés :
1. **Absence de 2 sections fondamentales de R2 :**
   - **Liste des sous-agents** : absente (seul un vague compteur `activeToolsCount` est affiché).
   - **Historique d'activités récentes** : totalement absent.
2. **Non-respect de la Charte de Modularité (Section 4.2) :**
   La charte impose 4 sous-fichiers autonomes :
   - `ModelStatusBadge.tsx`
   - `TokenContextMeter.tsx`
   - `SubagentTreeList.tsx`
   - `ActivityHistoryFeed.tsx`
   Aucun n'a été créé ; la sidebar regroupe en vrac du texte statique.
3. **Données déconnectées de la tuyauterie réactive :**
   Aucune liaison avec `useData()`, `useLocal()`, `contextUsage()`, ni `data.session.family()`. Si aucune prop n'est fournie, le composant affiche un mock trompeur (`opencode/free`, `0k / 128k`).

---

## 3. Inspection de `src/routes/session/index.tsx` & Câblage

### 3.1. État Actuel du Fichier `session/index.tsx`

Le fichier fait **3 641 lignes**.
Le résultat de recherche de `AsymmetricLayout` dans ce fichier renvoie **0 occurrence**.
Le résultat de recherche de `AsymmetricSidebar` renvoie **0 occurrence**.

Ligne 1351 à 1548, le rendu de `Session` s'effectue dans :
```tsx
<box flexDirection="row" flexGrow={1} minHeight={0}>
  <box
    flexGrow={1}
    minHeight={0}
    paddingBottom={1}
    paddingLeft={dimensions().width < 44 ? 1 : 2}
    paddingRight={dimensions().width < 44 ? 1 : 2}
  >
    <Show when={session()}>
      <box flexGrow={1} minHeight={0} position="relative">
        <scrollbox ...>
          {/* Transcript Markdown des messages et outils */}
        </scrollbox>
      </box>
      {/* Saut vers le bas */}
      <box flexShrink={0}>
        {/* QueuedPromptDock, Composer, Prompt standard */}
      </box>
    </Show>
  </box>
</box>
```

### 3.2. Cartographie des Sources de Données Existantes dans OpenCode

Toutes les données nécessaires pour alimenter le volet gauche sans réinventer la plomberie existent déjà dans le contexte de `Session` :

1. **Statut et Nom du Modèle Actif :**
   - Contexte : `useLocal().model.current()` ou `session()?.model`.
   - Liste des modèles de la localisation : `models = createMemo(() => data.location.model.list(location()) ?? [])` (déjà instancié ligne 256 de `session/index.tsx`).
   - Nom résolu : `models()?.find(m => m.providerID === model.providerID && m.id === model.id)?.name`.
   - Variante active : `model.variant` (ex: `"thinking"`).
2. **Métriques Contexte / Tokens :**
   - Fonction utilitaire existante : `contextUsage(messages(), models())` dans `src/util/session.ts` (ligne 58).
   - Retourne : `{ tokens: number, percent?: number }`.
   - Limite max du contexte : `model?.limit.context` (ex: 128 000 ou 200 000).
   - Formateur existant : `formatContextUsage(tokens, percent)` dans `src/util/session.ts`.
3. **Liste et Statut des Sous-Agents :**
   - Signal existant dans `session/index.tsx` (ligne 198) :
     `descendantSessionIDs = createMemo(() => data.session.family(route.sessionID).filter(id => id !== route.sessionID))`
   - Chaque ID permet d'obtenir : `data.session.get(id)` (titre, modèle) et `data.session.status(id)` (`"idle" | "running" | "completed" | "failed"`).
4. **Historique des Activités Récentes :**
   - Accessible via `messages()` : filtrage des derniers `SessionMessageAssistant` contenant des `parts` de type `"tool"` ou des derniers tours de dialogue.
5. **État de la Mascotte Phanos (Humeur en temps réel) :**
   - Signal réactif dérivable :
     ```ts
     const isExecuting = createMemo(() => {
       const last = messages().at(-1)
       return last?.type === "assistant" && last.parts.some(p => p.type === "tool" && p.state.status === "running")
     })
     const isThinking = createMemo(() => {
       const last = messages().at(-1)
       return last?.type === "assistant" && last.time.completed === undefined
     })
     const mascotMood = createMemo<MascotMood>(() => {
       if (isExecuting()) return "executing"
       if (isThinking()) return "thinking"
       return "idle"
     })
     ```
   - Le composant `MascotWidget` est prêt dans `src/component/mascot/MascotWidget.tsx` et accepte `mood={mascotMood()}`.

---

## 4. Analyse de la Réactivité et du Redimensionnement (< 100 Colonnes)

### 4.1. Comportement Spécifié vs Comportement Réel

| Propriété | Exigence R2 & Charte | Implémentation `AsymmetricLayout.tsx` | Écart |
|---|---|---|---|
| Seuil de collapse | `< 100` colonnes | `dimensions().width >= 80` | **Échec** (-20 colonnes d'écart) |
| Gestion des conteneurs parents | Respecter `verticalTabsWidth` | Ignore les onglets verticaux | **Échec** (débordement si onglets ouverts) |
| Largeur Sidebar | 28 à 32 colonnes (défaut: 30) | `props.sidebarWidth ?? 30` (min: 24, max: 36) | **Conforme** |
| Préservation Mascotte en collapse | Mascotte toujours visible en haut-droit | Mascotte logée dans l'en-tête du volet droit | **Conforme** |
| Élasticité du volet droit | `flexGrow={1} minWidth={0}` | `flexGrow={1} minWidth={0}` | **Conforme** |

### 4.2. Impact Utilisateur du Seuil à 80 Colonnes
Dans un terminal de 80 × 24 :
- Si la sidebar s'affiche (30 cols + 1 col de bordure + padding) : il reste ~45 cols au transcript.
- Les blocs de code, lignes de logs d'outils et citations markdown se retrouvent violemment tronqués ou fragmentés avec un retour à la ligne chaque mot.
- **Correction requise :** Le collapse doit s'activer dès que la largeur disponible passe sous 100 colonnes (`width < 100`).

---

## 5. Conformité OpenTUI & Modularité (< 250 Lignes)

### 5.1. Conformité OpenTUI Flexbox Primitives
L'inspection du code JSX dans `layout/` démontre une bonne conformité avec les règles validées dans `GROUND_TRUTH_SCOUT.md` :
- Utilisation exclusive des balises `<box>` et `<text>`. Aucune balise HTML (`div`, `span`).
- Types de bordure valides : `border={["right"]}` avec `borderColor={RGBA}`.
- Couleurs créées via la classe `RGBA` de `@opentui/core`.
- Primitives Solid réactives utilisées (`Show`, `createMemo`, signaux).

### 5.2. Conformité aux Directives de Modularité

| Règle | Statut | Commentaire |
|---|---|---|
| **Max 250 lignes / composant** | Conforme | Fichiers actuels entre 9 et 53 lignes. Les sous-composants recommandés feront entre 40 et 80 lignes. |
| **1 composant = 1 fichier** | Violé dans `AsymmetricSidebar.tsx` | La sidebar mélange l'inspection de 3 concepts différents dans 1 seul fichier au lieu d'utiliser des sous-composants dédiés. |
| **Contrats `types.ts`** | Partiel | `types.ts` ne contient que `AsymmetricLayoutProps` et ignore les contrats de la sidebar et des widgets. |
| **Isolation de `session/index.tsx`** | À respecter | L'intégration ne doit pas ajouter plus de 30-40 lignes dans `session/index.tsx`. Tout doit être encapsulé dans `src/routes/session/layout/`. |

---

## 6. Synthèse des Écarts : Complet vs Manquant / Défaillant

| Composant | Statut Actuel | Ce qui manque / est défaillant |
|---|---|---|
| **`AsymmetricLayout.tsx`** | Ébauche fonctionnelle (51 lignes) | 1. Seuil à 80 au lieu de 100.<br>2. `width`/`height` absolues en racine.<br>3. Non raccordé dans `session/index.tsx`. |
| **`AsymmetricSidebar.tsx`** | Ébauche statique (53 lignes) | 1. Manque sous-agents.<br>2. Manque historique d'activités.<br>3. Données en dur (non branchées à la session).<br>4. Non découpé en 4 sous-composants. |
| **`ModelStatusBadge.tsx`** | **MANQUANT (0%)** | Fichier à créer pour afficher statut, nom, provider et variant. |
| **`TokenContextMeter.tsx`** | **MANQUANT (0%)** | Fichier à créer pour afficher jauge visuelle UTF-8 et ratio tokens/contexte. |
| **`SubagentTreeList.tsx`** | **MANQUANT (0%)** | Fichier à créer pour afficher l'arbre hiérarchique des sous-agents et leur statut. |
| **`ActivityHistoryFeed.tsx`** | **MANQUANT (0%)** | Fichier à créer pour afficher les 3 à 5 dernières actions/outils exécutés. |
| **`AmberFloatingComposer.tsx`** | **MANQUANT (0%)** | Fichier à créer pour envelopper le prompt dans une boîte suspendue aux bordures ambrées (`#FABE3C`). |
| **Mascotte Haut-Droit** | Composant prêt dans `component/mascot/` | Non branché dans le header de session ni alimenté en humeur réactive. |
| **Câblage `session/index.tsx`** | **0% raccordé** | L'appel à `AsymmetricLayout` doit remplacer le conteneur racine de `Session`. |

---

## 7. Plan d'Action & Recommandations Concrètes (Blueprint Développeur)

### 7.1. Architecture Cible du Dossier `src/routes/session/layout/`

```
src/routes/session/layout/
├── types.ts                 # Contrats stricts pour tous les composants
├── index.ts                 # Export barrel propre
├── AsymmetricLayout.tsx     # Conteneur responsive (seuil 100 cols, sans width absolue)
├── AsymmetricSidebar.tsx    # Agrégateur modulaire réactif
├── ModelStatusBadge.tsx     # Statut modèle actif (nom, provider, variant)
├── TokenContextMeter.tsx    # Jauge de contexte graphique et tokens
├── SubagentTreeList.tsx     # Arbre réactif des sous-agents
├── ActivityHistoryFeed.tsx  # Historique compact des 4 dernières actions
└── AmberFloatingComposer.tsx# Boîte suspendue aux contours ambrés
```

### 7.2. Spécification Détaillée des Composants à Produire

#### A. `AsymmetricLayout.tsx` (Correction)
- Remplacer `dimensions().width >= 80` par `(props.availableWidth ?? dimensions().width) >= (props.collapseThreshold ?? 100)`.
- Remplacer `<box flexGrow={1} flexDirection="row" width={dimensions().width} height={dimensions().height}>` par `<box flexGrow={1} minWidth={0} minHeight={0} flexDirection="row">`.
- Aligner le titre "PHANOS" et `mascotHeader` avec un espacement propre.

#### B. `ModelStatusBadge.tsx` (~45 lignes)
- Props : `modelName?: string`, `providerID?: string`, `variant?: string`, `active?: boolean`.
- Affichage : Puce colorée (`●` vert/ambre) + Nom du modèle en ambre + `[provider · variant]`.

#### C. `TokenContextMeter.tsx` (~65 lignes)
- Props : `tokens: number`, `limit?: number`, `percent?: number`.
- Jauge visuelle calculée sur 16 caractères :
  Exemple : `[██████░░░░░░░░░░] 38%`
- Ligne de détail : `48.5k / 128k`.

#### D. `SubagentTreeList.tsx` (~70 lignes)
- Props : `sessionID: string`.
- Utilise `data.session.family(props.sessionID)` et affiche pour chaque enfant :
  `├─ [agent-name] ⚡ actif` ou `└─ [agent-name] ✓ terminé`.
- Si aucun sous-agent : `<text fg={MUTED}>Aucun sous-agent actif</text>`.

#### E. `ActivityHistoryFeed.tsx` (~75 lignes)
- Props : `messages: readonly SessionMessageInfo[]`.
- Extrait les 3 à 4 derniers outils appelés depuis `messages` et affiche :
  `• bash: bun test (✓ 240ms)`
  `• read: src/app.tsx (✓ 15ms)`.

#### F. `AmberFloatingComposer.tsx` (~55 lignes)
- Encapsule le prompt existant sans toucher à son fonctionnement interne.
- Style visuel :
  - `marginBottom={1}`, `marginX={1}` (effet suspendu au-dessus du bas de l'écran).
  - `border={["top", "bottom", "left", "right"]}`.
  - `borderColor={RGBA.fromInts(250, 190, 60, 255)}` (`#FABE3C`).
  - `backgroundColor={theme.background.raised.base}`.

#### G. Point d'Injection dans `src/routes/session/index.tsx`
Remplacer le bloc conteneur de retour (lignes 1394-1546) par :

```tsx
<AsymmetricLayout
  availableWidth={props.width}
  collapseThreshold={100}
  sidebar={
    <AsymmetricSidebar
      sessionID={route.sessionID}
      models={models()}
      messages={messages()}
    />
  }
  mascotHeader={
    <MascotWidget mood={mascotMood()} />
  }
  main={
    <box flexGrow={1} minHeight={0} flexDirection="column">
      <Show when={session()}>
        <box flexGrow={1} minHeight={0} position="relative" paddingX={1}>
          <scrollbox ...>
            {/* Transcript inchangé */}
          </scrollbox>
        </box>
        <box height={1} flexShrink={0} flexDirection="row" justifyContent="flex-end" paddingRight={1}>
          {/* Jump to latest */}
        </box>
        <AmberFloatingComposer>
          {/* QueuedPromptDock, Composer, Prompt/FormPrompt/PermissionPrompt */}
        </AmberFloatingComposer>
      </Show>
    </box>
  }
/>
```

---

## 8. Conclusion de l'Analyse

La structure d'accueil de R2 existe mais est actuellement dormante, incomplète et affectée de deux bugs de disposition (seuil de redimensionnement et dimensions absolues forcées).
La mise en conformité stricte avec l'Exigence R2 et la Charte de Modularité nécessite :
1. La création des 5 fichiers manquants dans `src/routes/session/layout/` (`ModelStatusBadge.tsx`, `TokenContextMeter.tsx`, `SubagentTreeList.tsx`, `ActivityHistoryFeed.tsx`, `AmberFloatingComposer.tsx`).
2. La correction du responsive (< 100 colonnes) et des dimensions relatives dans `AsymmetricLayout.tsx`.
3. L'assemblage réactif dans `AsymmetricSidebar.tsx`.
4. Le branchement chirurgical dans `src/routes/session/index.tsx` (moins de 30 lignes modifiées dans le monolithe, sans régression sur la plomberie).
