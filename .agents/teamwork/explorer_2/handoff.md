# RAPPORT DE HANDOFF — EXIGENCE R2 (Disposition Asymétrique Split Screen & Layout)

**Agent émetteur :** `explorer_2` (Teamwork Preview Explorer)  
**Destinataire :** Orchestrateur (`93042aa0-9fc5-4ff1-afe6-cebb08094553`) / Développeurs  
**Date :** 2026-10-13  
**Dossier de travail :** `/home/theshellpc/Bureau/nouveau-projet/.agents/teamwork/explorer_2/`  
**Type de handoff :** Hard (Investigation R2 terminée)

---

## 1. Observation (Faits Bruts & Citations Verbatim)

1. **Existence et contenu du dossier layout :**  
   Dans `base-opencode/packages/tui/src/routes/session/layout/` :
   - `types.ts` (9 lignes) :
     ```ts
     import type { JSX } from "@opentui/solid"

     export interface AsymmetricLayoutProps {
       sidebar: JSX.Element
       main: JSX.Element
       mascotHeader?: JSX.Element
       sidebarWidth?: number
     }
     ```
   - `index.ts` (4 lignes) : exporte `types`, `AsymmetricLayout`, `AsymmetricSidebar`.
   - `AsymmetricLayout.tsx` (51 lignes) :
     - Ligne 15 : `const showSidebar = () => dimensions().width >= 80`
     - Ligne 19 : `<box flexGrow={1} flexDirection="row" width={dimensions().width} height={dimensions().height}>`
   - `AsymmetricSidebar.tsx` (53 lignes) :
     - Ligne 31 : `<text fg={AMBER}>{props.modelName ?? "opencode/free"}</text>`
     - Ligne 37 : `<text fg={AMBER}>{props.tokensUsed ?? "0k / 128k"}</text>`
     - Ligne 43 : `<text fg={AMBER}>{props.activeToolsCount ?? 0} actif(s)</text>`
     - Aucune mention de sous-agents ni d'historique d'activités.
2. **Absence totale de raccordement dans `session/index.tsx` :**  
   - `grep_search` pour `AsymmetricLayout` dans `src/routes/session/index.tsx` renvoie 0 résultat.
   - `grep_search` pour `AsymmetricSidebar` dans `src/routes/session/index.tsx` renvoie 0 résultat.
   - Dans `src/routes/session/index.tsx` (3 641 lignes), ligne 1394 :
     Le conteneur JSX principal est toujours le layout historique d'OpenCode :
     `<box flexDirection="row" flexGrow={1} minHeight={0}>` sans sidebar d'inspection ni mascotte.
3. **Absence des composants prévus par la Charte de Modularité :**  
   Recherche de fichiers dans `base-opencode/packages/tui/src` :
   - `ModelStatusBadge.tsx` : introuvable (0 fichier).
   - `TokenContextMeter.tsx` : introuvable (0 fichier).
   - `SubagentTreeList.tsx` : introuvable (0 fichier).
   - `ActivityHistoryFeed.tsx` : introuvable (0 fichier).
   - `AmberFloatingComposer.tsx` : introuvable (0 fichier).
   - `ChatTranscriptPane.tsx` : introuvable (0 fichier).
4. **Disponibilité des briques tierces :**  
   - Mascotte : `src/component/mascot/MascotWidget.tsx` existe (41 lignes), fonctionne avec `mood?: MascotMood`, utilise les demi-blocs UTF-8 et la palette ambrée.
   - Outils Claude Code : `src/routes/session/tools/` contient déjà `ToolAccordion.tsx`, `ToolRowBadge.tsx`, `ToolDurationBadge.tsx`, etc.
   - Données de session dans `src/util/session.ts` : `contextUsage(messages, models)` (ligne 58) calcule exactement `{ tokens, percent }`.

---

## 2. Logic Chain (Chaîne Logique Déductive)

1. **Prémisse 1 (Issue de l'Observation 2) :** `AsymmetricLayout` et `AsymmetricSidebar` ne sont pas importés dans `src/routes/session/index.tsx`.  
   **Déduction 1 :** L'interface utilisateur actuelle de Phanos n'exécute pas du tout le split-screen asymétrique en runtime ; elle tourne toujours sur l'ancienne mise en page standard OpenCode.
2. **Prémisse 2 (Issue de l'Observation 1 & Exigence R2) :** L'exigence R2 requiert dans le volet gauche : statut du modèle, tokens/contexte, liste des sous-agents, historique récent. `AsymmetricSidebar.tsx` ne possède que 3 champs texte basiques et omet complètement la liste des sous-agents et l'historique d'activités.  
   **Déduction 2 :** Le composant `AsymmetricSidebar` actuel est un simple squelette non conforme au cahier des charges et doit être enrichi de ses 4 sous-sections.
3. **Prémisse 3 (Issue de l'Observation 3 & Charte de Modularité Règle 1) :** La charte impose 1 composant = 1 fichier ($\le$ 250 lignes).  
   **Déduction 3 :** La sidebar ne doit pas devenir un nouveau monolithe. Elle doit être décomposée en 4 sous-composants dédiés (`ModelStatusBadge`, `TokenContextMeter`, `SubagentTreeList`, `ActivityHistoryFeed`) orchestrés par `AsymmetricSidebar`.
4. **Prémisse 4 (Issue de l'Observation 1, ligne 15) :** `AsymmetricLayout.tsx` teste `dimensions().width >= 80` au lieu de `100`. Sur un écran de 80 colonnes, la barre latérale de 30 colonnes comprime le fil de messages à 46 colonnes effectives.  
   **Déduction 4 :** Le seuil de collapse doit impérativement être rehaussé à 100 colonnes (`width >= 100`) et prendre en compte la largeur disponible réelle (en soustrayant d'éventuels onglets verticaux).
5. **Prémisse 5 (Issue de l'Observation 1, ligne 19) :** `AsymmetricLayout.tsx` force `width={dimensions().width} height={dimensions().height}`. Dans `SessionFrame`, la présence d'onglets verticaux (`SessionTabs`) ampute la largeur disponible.  
   **Déduction 5 :** Le conteneur racine de `AsymmetricLayout` doit utiliser `flexGrow={1} minWidth={0} minHeight={0}` pour s'adapter dynamiquement à son conteneur parent au lieu de déborder de l'écran.

---

## 3. Caveats (Limites & Hypothèses)

1. **Terminal Resize Event :** L'appel direct à `bun run typecheck` en subagent a été bloqué par la politique de sécurité d'environnement, mais le code a été vérifié manuellement par rapport aux signatures déclarées dans `GROUND_TRUTH_SCOUT.md` et aux types d'OpenTUI.
2. **Comportement en Overlay :** L'exigence R2 demande un collapse automatique sous 100 colonnes. Le comportement d'ouverture temporaire de la sidebar sous forme d'overlay par raccourci clavier (ex: `Ctrl+B`) est supporté par `SessionFrame` d'OpenCode mais n'est pas encore branché sur `AsymmetricSidebar`.
3. **Persistance de l'état :** Nous assumons que le collapse sous 100 colonnes est automatique et réactif à la taille de la fenêtre, sans nécessiter d'écriture en base SQLite.

---

## 4. Conclusion (Évaluation Finale & Décision)

L'exigence R2 est **au stade de prototype non intégré (stubs isolés)**.  
Pour achever R2 de manière 100% conforme et propre :
1. **Créer 5 composants modulaires dans `src/routes/session/layout/` :**
   - `ModelStatusBadge.tsx` (modèle, provider, variant, dot d'état)
   - `TokenContextMeter.tsx` (jauge UTF-8 `[████░░░░] %` et décompte tokens)
   - `SubagentTreeList.tsx` (arbre hiérarchique avec icônes d'état)
   - `ActivityHistoryFeed.tsx` (flux compact des 4 derniers outils)
   - `AmberFloatingComposer.tsx` (boîte de saisie suspendue bordée d'ambre `#FABE3C`)
2. **Corriger `AsymmetricLayout.tsx` :**
   - Seuil de collapse à 100 colonnes (`dimensions().width >= 100` ou `availableWidth >= 100`).
   - Remplacer les dimensions absolues forcées par `flexGrow={1} minWidth={0}`.
3. **Refondre `AsymmetricSidebar.tsx` :**
   - Assembler les 4 widgets ci-dessus avec liaison réactive aux données de session.
4. **Raccorder dans `src/routes/session/index.tsx` :**
   - Encapsuler la vue de session dans `<AsymmetricLayout>` avec `mascotHeader={<MascotWidget mood={mascotMood()} />}` et le prompt dans `<AmberFloatingComposer>`.

---

## 5. Verification Method (Protocole de Vérification Indépendante)

1. **Inspection des Fichiers Clés :**
   - Inspecter `base-opencode/packages/tui/src/routes/session/layout/AsymmetricLayout.tsx` : vérifier la présence du seuil 100 colonnes et l'absence de `width={dimensions().width}` forcé.
   - Inspecter `base-opencode/packages/tui/src/routes/session/layout/AsymmetricSidebar.tsx` : vérifier l'import des 4 sous-widgets.
   - Inspecter `base-opencode/packages/tui/src/routes/session/index.tsx` (lignes 1390-1550) : vérifier la présence de `<AsymmetricLayout>` et `<AmberFloatingComposer>`.
2. **Vérification de Typage :**
   - Exécuter depuis `base-opencode` :
     `bun run typecheck`
   - Le statut doit être 0 erreur.
3. **Vérification Visuelle en Terminal :**
   - Démarrer l'application : `bun run tui`
   - Terminal large ($\ge$ 100 colonnes) :
     - Volet gauche présent (~30 cols) avec puce modèle, jauge tokens, sous-agents, historique.
     - Volet droit avec mascotte en haut à droite et prompt suspendu ambré.
   - Redimensionner sous 100 colonnes :
     - Le volet gauche disparaît instantanément.
     - Le volet droit occupe 100% de la largeur.
     - La mascotte reste visible en haut à droite.
