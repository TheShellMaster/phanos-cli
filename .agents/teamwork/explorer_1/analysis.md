# Analyse Détaillée — Requirement R1 : Compagnon Cyber Pixel-Art Animé (Vibe Mistral)

**Auteur :** explorer_1 (teamwork_preview_explorer)  
**Date :** 2026-10-13  
**Cible :** `base-opencode/packages/tui/src/component/mascot/` & intégration TUI  

---

## 1. Résumé Exécutif

L'investigation de l'exigence R1 montre que le composant mascotte dispose d'une implémentation de base très soignée au sein de `base-opencode/packages/tui/src/component/mascot/` :
- 8 fichiers modulaires strictement conformes au plafond de 250 lignes (tous font entre 8 et 105 lignes).
- Rendu terminal en demi-blocs Unicode (`▀`, `▄`, `█`) et tracé de boîtes avec expressions faciales évocatrices ("vibe Mistral").
- Palette ambre/or (`#FABE3C`, `#FFCD5A`, `#C47614`) rigoureusement respectée via `RGBA.fromInts`.
- Primitives OpenTUI (`<box>`, `<text>`, `RGBA`, `TextAttributes`) parfaitement utilisées.

**Cependant, deux problèmes majeurs bloquants et plusieurs défauts de réactivité ont été identifiés :**
1. **Zéro intégration (0% connecté) :** Ni `MascotSplash` ni `MascotWidget` ne sont importés ou rendus dans l'application (`src/app.tsx`, `src/component/session-frame.tsx`, ou `src/routes/session/index.tsx`). La créature n'apparaît ni au démarrage ni en cours de session.
2. **Bug de rupture de réactivité SolidJS dans `useMascotState.ts` / `MascotCanvas.tsx` :** Le hook `useMascotState({ mood: props.mood })` reçoit un objet JS statique à l'initialisation au lieu d'un accesseur/getter, brisant le suivi réactif des changements d'humeur.
3. **Bug de cycle de vie dans `MascotSplash.tsx` :** Utilisation d'un `return () => { clearTimeout(...) }` dans `onMount`, pattern React invalide en SolidJS (`onMount` ignore la valeur de retour, risque de fuite de timer ; `onCleanup` est requis).
4. **Rythme de clignement disproportionné :** En mode `idle`, la frame de clignement dure 1200ms (yeux fermés pendant 1,2 seconde toutes les 4,8s au lieu d'un clignement naturel de 150-200ms).
5. **Défaut d'alignement dans `matrix.ts` :** La première ligne de `FRAME_THINKING_1` mesure 13 caractères contre 12 pour les autres lignes.

---

## 2. Inspection Fichier par Fichier (`src/component/mascot/`)

### 2.1. `types.ts` (13 lignes)
- **Contenu :** Définit `MascotMood` (`"idle" | "thinking" | "executing" | "greeting" | "sleeping"`), `MascotSpriteFrame` (largeur, hauteur, lignes), et `MascotAnimationSequence`.
- **Évaluation :** Clair, typé strictement, exhaustif sur les humeurs.
- **Remarque :** `MascotAnimationSequence` n'est pas exploité par les autres fichiers (mineur).

### 2.2. `palette.ts` (15 lignes)
- **Contenu :** Constante `MASCOT_PALETTE` exportée en `as const` :
  - `goldGlow`: `RGBA.fromInts(255, 205, 90, 255)` (`#FFCD5A`)
  - `amberPrimary`: `RGBA.fromInts(250, 190, 60, 255)` (`#FABE3C`)
  - `bronzeDeep`: `RGBA.fromInts(196, 118, 20, 255)` (`#C47614`)
  - `darkBase`: `RGBA.fromInts(42, 30, 15, 255)` (`#2A1E0F`)
  - `sparklePale`: `RGBA.fromInts(255, 234, 170, 255)` (`#FFEAAA`)
- **Évaluation :** 100% conforme à `ORIGINAL_REQUEST.md` et `GROUND_TRUTH_SCOUT.md`.

### 2.3. `matrix.ts` (105 lignes)
- **Contenu :** Déclaration des matrices de sprites 4 lignes x 12 colonnes :
  - `FRAME_IDLE_OPEN` : Yeux ouverts (`●    ●`), sourire (`▽`), pattes demi-blocs (`▀▀  ▀▀`).
  - `FRAME_IDLE_BLINK` : Yeux fermés (`─    ─`).
  - `FRAME_THINKING_1` & `FRAME_THINKING_2` : Yeux dissymétriques (`◉    ·` / `·    ◉`), étincelles (`✦`), bouche perplexe (`~`).
  - `FRAME_EXECUTING_1` & `FRAME_EXECUTING_2` : Yeux étincelants (`✧    ✧` / `✦    ✦`), étoile (`★`), bouche active (`ω` / `∇`), pattes pleines (`██  ██`).
  - `FRAME_GREETING` : Salutation joyeuse (`^    ^`, patte levée `/`).
  - Fonction `getFramesForMood(mood: MascotMood)` renvoyant le tableau de frames.
- **Anomalie détectée :**
  - Dans `FRAME_THINKING_1` (ligne 37) : `" ╭────────╮ ✦"` compte 13 caractères (espace + bordure + espace + ✦), alors que les autres lignes en comptent 12. Cela génère un décalage de 1 colonne à droite lors de la réflexion.
  - Le commentaire ligne 6 indique `(6 lignes x 12 colonnes)`, mais la hauteur réelle est de 4 lignes (`height: 4`).

### 2.4. `useMascotState.ts` (38 lignes)
- **Contenu :** Hook réactif SolidJS cadençant le changement de frame :
  - Timer d'intervalle rapide (`350ms`) pour `thinking`/`executing`.
  - Timer lent (`1200ms`) pour `idle`.
- **Anomalies critiques :**
  1. **Perte de réactivité SolidJS :**
     ```ts
     export function useMascotState(props?: UseMascotStateProps) {
       const [frameIndex, setFrameIndex] = createSignal(0)
       const currentMood = () => props?.mood ?? "idle"
     ```
     Lorsque `MascotCanvas` appelle `useMascotState({ mood: props.mood })`, `props.mood` est évalué une seule fois à l'instanciation de `MascotCanvas`. La fonction `currentMood` lit une propriété d'un objet standard JS, pas un signal ni un proxy de props SolidJS. Par conséquent, changer l'humeur ne déclenche jamais le `createEffect` de mise à jour du timer.
  2. **Timing du clignement :**
     En mode idle, le tableau de frames est `[OPEN, OPEN, OPEN, BLINK]`. Avec un intervalle uniforme de 1200ms, les yeux restent fermés pendant 1,2 seconde ! Un clignement humain/naturel dure environ 150ms à 200ms.
  3. **Absence de respect des animations système :**
     Ne vérifie pas `config.animations === false` (préconisé dans `GROUND_TRUTH_SCOUT.md`).

### 2.5. `MascotCanvas.tsx` (53 lignes)
- **Contenu :** Composant terminal de rendu matriciel :
  - Calcule la couleur (`fgColor`) selon l'humeur.
  - Applique `attributes={TextAttributes.BOLD}` en mode exécution.
  - Boucle `<For each={currentFrame().rows}>` et affiche chaque ligne dans un `<text>`.
- **Anomalie :**
  - Ligne 17 : `const state = useMascotState({ mood: props.mood })`. Devrait passer un accesseur réactif : `useMascotState({ mood: () => props.mood })`.

### 2.6. `MascotSplash.tsx` (51 lignes)
- **Contenu :** Animation d'introduction au centre de l'écran :
  - 0-400ms : `sleeping`
  - 400-900ms : `waking` (mood "thinking")
  - 900-1600ms : `greeting` (mood "greeting" + texte `"✨ Phanos s'éveille..."`)
  - 1600ms : appel de `props.onComplete?.()`
- **Anomalies critiques :**
  1. **Bug SolidJS `onMount` :**
     Lignes 27-31 : `return () => { clearTimeout(t1); ... }` à l'intérieur de `onMount(...)`. En SolidJS, `onMount` n'utilise pas la valeur de retour (contrairement à React `useEffect`). Pour nettoyer des timers, il faut impérativement utiliser `onCleanup(() => { ... })`.
  2. **Non positionné pour un overlay :**
     Le `<box>` racine n'a pas `position="absolute"`, `top={0}`, `left={0}`, `width="100%"`, `height="100%"`, ni de fond opaque `backgroundColor`. S'il est monté au-dessus de l'interface, il ne masquera pas les composants sous-jacents.

### 2.7. `MascotWidget.tsx` (41 lignes)
- **Contenu :** Widget permanent pour coin supérieur droit :
  - Badge textuel ambré : `[Prêt]` (idle), `[Réflexion...]` (thinking), `[Actif ⚡]` (executing).
  - Affiche `<MascotCanvas mood={props.mood} />`.
- **Évaluation :** Composant propre, compact (41 lignes), mais orphelin : aucun fichier du projet ne l'importe ni ne lui injecte l'état réel de l'agent.

### 2.8. `index.ts` (8 lignes)
- **Contenu :** Barrel file réexportant les 7 fichiers.

---

## 3. Conformité aux Directives Techniques

| Règle / Directive | Cible | Statut Réel | Détails |
|---|---|---|---|
| **Plafond de taille** | $\le$ 250 lignes / fichier | ✅ **100% Conforme** | Max : 105 lignes (`matrix.ts`), Min : 8 lignes (`index.ts`) |
| **Responsabilité Unique** | 1 composant visuel = 1 fichier | ✅ **100% Conforme** | 1 fichier pour chaque vue (`Canvas`, `Splash`, `Widget`) |
| **Primitives OpenTUI** | `<box>`, `<text>`, `RGBA`, `TextAttributes` | ✅ **100% Conforme** | Pas de JSX web/HTML illégal, tout est intrinsèque OpenTUI |
| **Palette Mistral / Ambre** | `#FABE3C`, `#FFCD5A`, `#C47614` | ✅ **100% Conforme** | Présents sous `amberPrimary`, `goldGlow`, `bronzeDeep` |
| **Cycle de vie SolidJS** | `onCleanup`, accesseurs réactifs | ❌ **Non Conforme** | Fuite de timers dans `MascotSplash` ; perte de proxy dans `useMascotState` |
| **Intégration Splash** | Éveil au démarrage du terminal | ❌ **Non Intégré (0%)** | Absent de `src/app.tsx` et `src/component/startup-loading.tsx` |
| **Intégration Widget** | Permanent dans le coin supérieur droit | ❌ **Non Intégré (0%)** | Absent de `SessionFrame` et `session/index.tsx` |

---

## 4. Analyse de l'Intégration & Plomberie Native

### 4.1. Point d'entrée de démarrage (`src/app.tsx`)
Dans `src/app.tsx`, le chargement initial actuel est géré aux lignes 1432-1434 :
```tsx
<Show when={!startup.skipInitialLoading}>
  <StartupLoading ready={plugins.ready} />
</Show>
```
`StartupLoading` est un bandeau discret en bas de l'écran ("Loading plugins...").  
Pour respecter **R1**, `MascotSplash` doit être orchestré au centre du terminal :
- Soit en overlay plein écran au démarrage (`position="absolute"`, `zIndex={9999}`), se fermant via `onComplete` une fois l'animation d'éveil jouée (~1,6s) et les plugins prêts.
- Soit au sein de `src/routes/home.tsx` au-dessus ou en remplacement temporaire du logo au tout premier lancement.
L'intégration via overlay plein écran dans `src/app.tsx` est la plus élégante et garantit que la créature s'éveille quel que soit le mode de lancement (session directe ou page d'accueil).

### 4.2. Point d'ancrage permanent (Coin supérieur droit)
Dans `base-opencode/packages/tui/src/routes/session/layout/AsymmetricLayout.tsx`, une barre d'en-tête est déjà prévue :
```tsx
{/* Volet Droit Principal (Fil de discussion) */}
<box flexGrow={1} minWidth={0} flexDirection="column">
  {/* Barre d'en-tête supérieure avec la Mascotte Phanos dans le coin droit */}
  <box flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={1}>
    <text fg={RGBA.fromInts(250, 190, 60, 255)}>PHANOS</text>
    <Show when={props.mascotHeader}>{props.mascotHeader}</Show>
  </box>
```
De plus, dans `src/app.tsx`, le conteneur principal dispose d'un bandeau d'onglets (`SessionTabs`).  
La présence permanente peut être assurée :
- Directement dans `AsymmetricLayout` pour la vue de session via la prop `mascotHeader={<MascotWidget mood={activeMood()} />}`.
- Et/ou dans le coin haut-droit global de `src/app.tsx` (en overlay ou aligné avec les onglets).

### 4.3. Détection Réactive de l'État Agent (Idle vs Thinking vs Executing)
Dans `@opencode/client` et `base-opencode/packages/tui/src/context/data.tsx` :
- `data.session.status(sessionID)` renvoie `"running" | "idle"`.
- Lorsque `status === "running"`, les messages de type assistant comportent des parties d'outils dont l'état est `part.state.status === "running" | "streaming"`.
- **Règle de dérivation de l'humeur :**
  - Si un outil est en statut `"running"` : humeur = `"executing"` (étincelles `★`, yeux `✧`, badge `[Actif ⚡]`).
  - Si l'assistant génère du texte ou réfléchit (`status === "running"` sans outil en cours) : humeur = `"thinking"` (yeux `◉`, étincelle `✦`, badge `[Réflexion...]`).
  - Si `data.session.status(sessionID) === "idle"` : humeur = `"idle"` (yeux `●`, clignement périodique, badge `[Prêt]`).

---

## 5. Recommandations et Plan d'Action Précis

### Étape 1 : Corriger les bugs internes dans `src/component/mascot/`
1. **Corriger `matrix.ts` :**
   Remplacer dans `FRAME_THINKING_1` la ligne 37 `" ╭────────╮ ✦"` par `" ╭────────╮✦"` (longueur exacte de 12 caractères).
2. **Corriger `useMascotState.ts` :**
   - Modifier l'interface pour accepter un getter : `mood?: MascotMood | (() => MascotMood)`.
   - Normaliser : `const getMood = () => typeof props?.mood === "function" ? props.mood() : (props?.mood ?? "idle")`.
   - Implémenter un clignement asymétrique réaliste : les yeux restent ouverts pendant 2500-3500ms, puis se ferment pendant 150-200ms avant de se rouvrir.
   - Respecter `config.animations === false`.
3. **Corriger `MascotCanvas.tsx` :**
   Passer l'accesseur réactif : `useMascotState({ mood: () => props.mood })`.
4. **Corriger `MascotSplash.tsx` :**
   Importer `onCleanup` depuis `"solid-js"`. Remplacer le `return () => { ... }` dans `onMount` par `onCleanup(() => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); })`.
   Ajouter le style overlay plein écran au `<box>` conteneur.

### Étape 2 : Connecter `MascotSplash` au flux de démarrage (`src/app.tsx`)
- Définir dans `App` :
  ```tsx
  const [splashVisible, setSplashVisible] = createSignal(!startup.skipInitialLoading)
  ```
- Rendre au premier plan :
  ```tsx
  <Show when={splashVisible()}>
    <box
      position="absolute"
      top={0}
      left={0}
      width={dimensions().width}
      height={dimensions().height}
      zIndex={9999}
      backgroundColor={theme.background.base}
      justifyContent="center"
      alignItems="center"
    >
      <MascotSplash
        onComplete={() => {
          if (plugins.ready()) setSplashVisible(false)
          else {
            // Attendre la fin du chargement des plugins si plus long
            createEffect(() => {
              if (plugins.ready()) setSplashVisible(false)
            })
          }
        }}
      />
    </box>
  </Show>
  ```

### Étape 3 : Connecter `MascotWidget` au layout et à l'état de l'agent
- Créer un petit hook ou fonction utilitaire `useAgentMascotMood(sessionID: () => string | undefined)` :
  Surveille `data.session.status(id)` et les messages récents pour déduire dynamiquement `"idle" | "thinking" | "executing"`.
- Injecter `<MascotWidget mood={mascotMood()} />` dans `AsymmetricLayout` (via `mascotHeader`) ou dans l'en-tête principal.
