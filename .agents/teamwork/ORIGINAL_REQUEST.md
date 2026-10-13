# Original User Request

## 2026-10-13T13:07:30Z

Refondre l'interface TUI de Phanos sur le socle natif haute performance d'OpenCode (`base-opencode/packages/tui`), en intégrant une créature pixel-art vivante (vibe Mistral) animée au splash screen et logée dans le coin supérieur droit, une disposition asymétrique en split screen, et un affichage dynamique des outils façon Claude Code.

Working directory: /home/theshellpc/Bureau/nouveau-projet/base-opencode
Integrity mode: development

## Requirements

### R1. Compagnon Cyber Pixel-Art Animé (Vibe Mistral)
- Créer un composant graphique terminal en demi-blocs / art pixelisé représentant un petit compagnon cyber-créature aux reflets ambre/or (`#FABE3C`, `#FFCD5A`, `#C47614`).
- **Au Splash Screen** : La créature s'éveille au centre de l'écran avec une animation d'introduction vivante (ouverture des yeux, étincelles pixel, salutation) avant la transition fluide vers l'interface.
- **Widget Permanent (Coin supérieur droit)** : La créature reste active dans le coin haut-droit du terminal avec des yeux expressifs qui clignent périodiquement en état de veille (idle), et des animations dynamiques en temps réel (yeux concentrés / étincelles d'activité quand l'agent réfléchit ou exécute un outil).

### R2. Disposition Asymétrique Split Screen
- Restructurer l'interface de session principale en deux volets asymétriques distincts de la disposition standard d'OpenCode :
  - **Volet Gauche (Panneau d'Inspection & Contexte Agent)** : Statut du modèle, métriques de contexte/tokens, liste des sous-agents et historique d'activités récentes.
  - **Volet Droit Principal (Fil de Discussion & Interaction)** : Zone de messages aérée avec rendu Markdown, surmontée du compagnon cyber dans le coin supérieur droit, et barre de saisie (Composer) suspendue aux contours ambrés.

### R3. Affichage des Outils Dynamique Façon Claude Code
- Remplacer l'affichage standard des exécutions d'outils par une présentation interactive inspirée de Claude Code :
  - Badges distinctifs par catégorie (`[Bash]`, `[Read]`, `[Edit]`, `[Grep]`, `[Search]`).
  - Ligne d'arguments concise et propre.
  - Spinner d'activité ambré fluide pendant l'exécution, avec durée finale d'exécution.
  - Accordéon dépliable/repliable d'un clic pour afficher le détail de la sortie (diff, console logs) sans encombrer la discussion.

### R4. Conservation Intégrale de la Tuyauterie Native
- Préserver et réutiliser à 100% l'infrastructure serveur, la gestion de session, le PTY persistant et la communication réactive Solid/Effect existante dans `@opencode/client` et `@opencode/server`.

## Acceptance Criteria

### Compagnon Pixel-Art (Mascotte Phanos)
- [ ] La créature pixel s'affiche et s'anime au démarrage du terminal avec une transition sans à-coup vers le TUI.
- [ ] La créature est présente en permanence dans le coin supérieur droit et commute entre ses états (idle clignement vs travail actif).

### Disposition & Affichage des Outils
- [ ] La disposition asymétrique split fonctionne et réagit correctement aux redimensionnements de terminal.
- [ ] Les exécutions d'outils s'affichent sous forme de cartes/lignes façon Claude Code avec accordéons fonctionnels.
- [ ] Le projet passe les vérifications de typage et de build (`bun run typecheck`).
