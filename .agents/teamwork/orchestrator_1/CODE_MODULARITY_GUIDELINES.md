# CHARTE DE MODULARITÉ & D'ARCHITECTURE DU CODE TUI PHANOS
**Version :** 1.0.0  
**Auteur :** Garant de la Clarté et de la Modularité du Code Phanos  
**Destinataires :** Orchestrateur, Développeurs (Workers), Réviseurs (Reviewers), Auditeurs  
**Statut :** DIRECTIVE OBLIGATOIRE — STRICT ENFORCEMENT  

---

## 1. Audit Critique de l'Architecture Existante (`base-opencode/packages/tui`)

L'audit approfondi de la base de code existante révèle une dette technique critique caractérisée par la présence de **fichiers monstres monolithiques** qui violent les principes fondamentaux de maintenabilité, testabilité et clarté.

### 1.1. Les Fichiers Monstres Identifiés
- **`src/routes/session/index.tsx` (3 640 lignes — 131 Ko)** :  
  Ce fichier est un anti-pattern monolithique absolu. Il concentre simultanément :
  - La gestion globale de la vue de session et du routage.
  - Le calcul du défilement, ancrage scroll et budget de rendu.
  - L'affichage de plus de 15 messages et états système différents (`UserMessage`, `TurnTokenUsage`, `CompactionMessage`, `ShellMessage`, etc.).
  - L'implémentation directe et en vrac de TOUS les outils de l'agent (`Shell`, `Write`, `Glob`, `Read`, `Grep`, `WebFetch`, `WebSearch`, `Subagent`, `Execute`, `Edit`, `ApplyPatch`, `Question`, `Skill`, `Diagnostics`).
  - Des fonctions utilitaires de parsing de formats et de permissions.
- **`src/component/session-tabs.tsx` (1 803 lignes — 75 Ko)** :  
  Mélange la navigation d'onglets, la détection souris, les effets visuels de pulse, le marquee et les raccourcis clavier.
- **`src/component/prompt/index.tsx` (2 011 lignes)** :  
  Monolithe de saisie, autocomplétion, stash et interactions textuelles.
- **`src/app.tsx` (1 442 lignes)** :  
  Point d'entrée surchargé reliant toutes les dépendances sans délégation modulaire claire.
- **`src/routes/session/form.tsx` (1 175 lignes)** :  
  Gestion monolithique des entrées utilisateur interactives.

### 1.2. Risques Majeurs pour le Projet Phanos
1. **Risque de régression incontrôlable** : Toute retouche sur l'affichage d'un outil ou sur la disposition risque de corrompre le scroll ou le rendu du chat.
2. **Incompatibilité avec les exigences Phanos** : Injecter la mascotte animée pixel-art, le split-screen asymétrique et les accordéons Claude Code directement dans ces monolithes rendrait la base de code totalement ingérable et non auditable.
3. **Collision de travail en équipe** : Impossible pour plusieurs agents de travailler en parallèle sur un même fichier de 3 600 lignes.

---

## 2. Les 5 Règles d'Or de Modularité Phanos

Tout code rédigé dans le cadre du projet Phanos doit impérativement respecter ces 5 règles.

### Règle 1 : Responsabilité Unique (1 Composant Visuel = 1 Fichier Autonome)
- Chaque composant visuel dispose de son propre fichier `.tsx` dédié.
- Les sous-composants réutilisables ne doivent JAMAIS être empilés à la chaîne en bas d'un fichier existant.
- Nommage explicite en PascalCase pour les composants (`MascotWidget.tsx`, `ToolRowBadge.tsx`, `ToolAccordion.tsx`, `AsymmetricSidebar.tsx`).

### Règle 2 : Plafond Strict de Taille de Fichier (Budget Max : 250 lignes)
- **Tolérance zéro pour les fichiers monstres** : Aucun fichier de composant UI ne doit dépasser **250 lignes de code**.
- Si un fichier s'approche de 200 lignes, il doit obligatoirement être découpé en sous-blocs interconnectés.
- Les fonctions utilitaires ou de calcul pur sont extraites dans un fichier `.ts` distinct (ex: `helpers.ts`, `animations.ts`, `matrix.ts`).

### Règle 3 : Typage Strict, Découplage et Fichiers de Contrat (`types.ts`)
- Les types et interfaces de props ne doivent pas être dispersés ou dupliqués.
- Chaque dossier fonctionnel doit comporter son fichier `types.ts` explicitant les contrats de données.
- Utilisation systématique de TypeScript strict, interdiction de `any` implicite ou de coercition obscure.

### Règle 4 : Aération, Structure Standardisée et Commentaires Stratégiques
Chaque fichier de composant doit suivre une structure claire et prévisible :
```tsx
// 1. Imports externes / SolidJS / OpenTUI
// 2. Imports internes (types, utilitaires, sous-composants)
// 3. Constantes locales & styles
// 4. Définition des Props
// 5. Composant principal
//    - Hooks & signaux
//    - Mémos dérivés
//    - Gestionnaires d'événements
//    - Rendu JSX aéré et indenté
```
- **Commentaires stratégiques** : Commenter le *pourquoi* (rationale architectural, gestion d'état réactive, timing d'animation), jamais l'évidence du *quoi*.

### Règle 5 : Réactivité Granulaire SolidJS & Préservation de la Tuyauterie Native
- Tirer profit des signaux SolidJS fins (`createSignal`, `createMemo`, `createEffect`) sans provoquer de re-rendu complet du DOM terminal.
- Ne jamais réimplémenter ce qui existe dans `@opencode/client` ou `@opentui/core` : réutiliser 100% de la plomberie existante.

---

## 3. Cartographie Cible & Architecture Modulaire Requis

Voici le découpage obligatoire en 4 blocs autonomes que chaque développeur doit appliquer.

```
src/
├── component/
│   └── mascot/                      # [BLOC 1] Mascotte Mistral Pixel-Art
│       ├── types.ts                 # Interfaces d'état (idle, thinking, executing, greeting)
│       ├── matrix.ts                # Définition matricielle des demi-blocs UTF-8 (▀, ▄, █)
│       ├── palette.ts               # Constantes couleurs ambrées (#FABE3C, #FFCD5A, #C47614)
│       ├── useMascotState.ts        # Hook d'état réactif (clignement, synchronisation agent)
│       ├── MascotCanvas.tsx         # Moteur de rendu matriciel terminal
│       ├── MascotSplash.tsx         # Séquence d'animation au démarrage / réveil
│       └── MascotWidget.tsx         # Widget permanent haut-droit réactif
│
├── routes/
│   └── session/
│       ├── layout/                  # [BLOC 2] Layout Asymétrique & Panneaux
│       │   ├── types.ts             # Tailles relatives, split ratios, props de layout
│       │   ├── AsymmetricLayout.tsx # Conteneur Split Screen réactif au redimensionnement
│       │   ├── AsymmetricSidebar.tsx# Volet Gauche (Inspection & Contexte Agent)
│       │   │   ├── ModelStatusBadge.tsx     # Statut modèle, nom, latence
│       │   │   ├── TokenContextMeter.tsx    # Jauge & métriques tokens/contexte
│       │   │   ├── SubagentTreeList.tsx     # Liste et statut des sous-agents
│       │   │   └── ActivityHistoryFeed.tsx  # Historique des activités récentes
│       │   └── ChatTranscriptPane.tsx       # Volet Droit Principal (Fil aéré + Mascotte)
│       │       └── AmberFloatingComposer.tsx# Zone de saisie suspendue aux contours ambrés
│       │
│       ├── tools/                   # [BLOC 3] Affichage Dynamique Façon Claude Code
│       │   ├── types.ts             # Types ToolViewProps, ToolState, ToolCategory
│       │   ├── ToolRowBadge.tsx     # Badges catégorisés ([Bash], [Read], [Edit], [Grep], [Search])
│       │   ├── ToolAccordion.tsx    # Accordéon interactif repliable (clic / raccourci)
│       │   ├── ToolDurationBadge.tsx# Spinner d'activité ambré + chronomètre final
│       │   ├── ToolArgumentsView.tsx# Affichage épuré des arguments en une ligne propre
│       │   ├── ToolOutputView.tsx   # Contenu détaillé dépliable (terminal output / logs)
│       │   └── views/               # Adaptateurs spécifiques par outil
│       │       ├── BashToolView.tsx
│       │       ├── FileEditToolView.tsx
│       │       ├── FileReaderToolView.tsx
│       │       ├── SearchToolView.tsx
│       │       ├── SubagentToolView.tsx
│       │       └── GenericToolView.tsx
│       │
│       └── messages/                # [BLOC 4] Démantèlement de session/index.tsx
│           ├── SessionUserMessage.tsx
│           ├── SessionAssistantMessage.tsx
│           ├── SessionCompactionMessage.tsx
│           └── SessionShellMessage.tsx
```

---

## 4. Spécifications Détaillées des Blocs Autonomes

### 4.1. Bloc 1 : Mascotte Pixel-Art (`src/component/mascot/`)
- **`matrix.ts`** :
  - Déclare les matrices de demi-blocs ASCII/Unicode (`▀`, `▄`, `█`) pour les différentes frames d'animation.
  - Sépare distinctement les frames : `SLEEPING`, `AWAKE_BLINK`, `CONCENTRATING`, `SPARKLE_EXCITED`.
- **`palette.ts`** :
  - Exporte les tokens de couleur ambre/or :
    - `AMBER_PRIMARY = "#FABE3C"`
    - `AMBER_GLOW = "#FFCD5A"`
    - `AMBER_DEEP = "#C47614"`
- **`MascotWidget.tsx`** :
  - Se positionne dans le coin supérieur droit du volet principal.
  - Écoute l'état de l'agent :
    - `idle` : respiration subtile et clignements périodiques (timer décalé non bloquant).
    - `thinking` : étincelles ambrées et regard concentré.
    - `tool_running` : animation active d'exécution.
- **`MascotSplash.tsx`** :
  - S'exécute lors du démarrage terminal.
  - Séquence temporelle : réveil au centre de l'écran -> ouverture des yeux ambrés -> salutation étincelante -> transition fluide vers la position haute-droite de session.

### 4.2. Bloc 2 : Layout Asymétrique Split Screen (`src/routes/session/layout/`)
- **`AsymmetricLayout.tsx`** :
  - Implémente la division asymétrique à deux panneaux :
    - Volet gauche (Largeur fixe ou ratio ~30%) : Inspection / Contexte.
    - Volet droit (Largeur dynamique ~70%) : Interaction / Chat.
  - Gère élégamment le responsive : collapse automatique du volet gauche sur terminaux étroits (< 100 colonnes).
- **`AsymmetricSidebar.tsx`** :
  - Agrège les 4 blocs d'inspection de manière modulaire, sans logique métier codée en dur.
  - Chaque sous-élément (`ModelStatusBadge`, `TokenContextMeter`, `SubagentTreeList`, `ActivityHistoryFeed`) a son fichier dédié.
- **`AmberFloatingComposer.tsx`** :
  - Décolle visuellement du bas de l'écran avec bordure et lueur ambrée (`#FABE3C`).
  - Encapsule le champ de prompt sans modifier le moteur interne de saisie OpenCode.

### 4.3. Bloc 3 : Affichage Dynamique des Outils Claude Code (`src/routes/session/tools/`)
- **`ToolRowBadge.tsx`** :
  - Rendu compact d'une pastille typée : `[Bash]`, `[Read]`, `[Edit]`, `[Grep]`, `[Search]`.
  - Palette sémantique harmonisée avec la charte ambrée.
- **`ToolDurationBadge.tsx`** :
  - En cours d'exécution : spinner ambré animé + durée écoulée en temps réel.
  - Terminé : indicateur discret de statut + temps total (`ex: 1.4s`).
- **`ToolAccordion.tsx`** :
  - Composant générique dépliable avec chevron interactif (`▶` replié, `▼` déplié).
  - Gestion du clic souris (`onMouseUp`) et du focus clavier.
  - Rendu fluide du contenu détaillé sans à-coups dans le transcript.
- **`views/*.tsx`** :
  - Chaque outil dispose de sa vue d'arguments épurée :
    - `BashToolView` : commande tronquée lisiblement.
    - `FileReaderToolView` : chemin de fichier relatif stylé.
    - `FileEditToolView` : fichier cible + résumé des lignes modifiées.

---

## 5. Grille d'Évaluation & Validation par l'Orchestrateur & Reviewer

Avant qu'une PR ou qu'une modification de code soit acceptée, l'Auditeur / Reviewer doit valider cette checklist :

| Critère | Seuil Requis | Statut de Blocage |
|---|---|---|
| **Taille de fichier** | $\le$ 250 lignes par composant | **Veto Immédiat** si dépassé |
| **Responsabilité Unique** | 1 seul composant visuel exporté par fichier | **Veto Immédiat** si mélangé |
| **Modularité Mascotte** | Packagé dans `component/mascot/` | Rejet si in-line dans index/app |
| **Modularité Sidebar** | Découpé en `AsymmetricLayout` + 4 sous-widgets | Rejet si monolithique |
| **Modularité Outils** | Accordéons & Badges dans `tools/` | Rejet si logé dans index.tsx |
| **Typage TypeScript** | 0 erreur `bun run typecheck` | **Veto Immédiat** |
| **Documentation & Clarté** | Code commenté aux points stratégiques | Rejet si illisible/opaque |

---

## 6. Ordre d'Exécution Imposé aux Équipes de Développement

1. **Phase 1** : Créer l'architecture de dossiers propre (`src/component/mascot/`, `src/routes/session/layout/`, `src/routes/session/tools/`).
2. **Phase 2** : Développer les blocs autonomes brique par brique, avec leurs contrats `types.ts`.
3. **Phase 3** : Raccorder les blocs modulaires dans les routes principales sans jamais ré-alourdir les conteneurs parents.
4. **Phase 4** : Valider systématiquement par `bun run typecheck`.

> **Note d'autorité :** L'orchestrateur doit rejeter toute proposition de code qui tente d'injecter des blocs monolithiques ou d'ajouter des centaines de lignes supplémentaires aux fichiers monstres existants. La clarté, l'aération et la séparation stricte des responsabilités sont la priorité absolue de Phanos.
