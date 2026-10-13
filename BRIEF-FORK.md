# Brief de reprise — fork « phanos » du moteur OpenCode

À destination de l'agent qui prendra le relais (Antigravity).
Lu le 13/10/2026. Tout ce qui suit est **vérifié**, pas supposé.

## Contexte en 5 lignes

On construit **phanos**, un agent CLI. On ne réécrit pas la boucle agentique :
on utilise celle d'OpenCode (MIT) et on change l'identité (nom, logo, thème).
Le lanceur `phanos` existe déjà et fonctionne (§5). Ce brief couvre uniquement
le **fork**, qui exige de compiler.

## Contraintes à connaître avant de commencer

1. **Bun plante sur la machine hôte.** `bun --version` →
   `Instruction not permitted (core dumped)`. Le build du moteur est basé sur
   Bun (`bunfig.toml`, `bun run`, `@opentui/*` avec cœur natif Zig).
   → Le build doit se faire **ailleurs** (machine sans cette restriction,
   conteneur, ou CI). Ne pas perdre de temps à contourner sur l'hôte.
2. **Le moteur installé est un binaire compilé**
   (`~/.npm-global/lib/node_modules/opencode-ai/bin/opencode.exe`), donc le
   logo interne n'est pas patchable de façon fiable. D'où le fork.
3. **Licence MIT** (`LICENSE`, « Copyright (c) 2025 opencode »). En cas de
   redistribution : conserver la notice de copyright.

## Étape 1 — Fork

```
fork de https://github.com/sst/opencode  →  dépôt phanos
```
Repère de départ vérifié : commit du 13/10/2026, version `opencode 1.18.35`.

Structure utile (dans le dépôt) :

| Chemin | Rôle |
|---|---|
| `packages/tui/` | l'interface terminal (SolidJS + OpenTUI) — **c'est ce qu'on customise** |
| `packages/tui/src/logo.ts` | le logo ASCII de 4 lignes (les mots « opencode ») |
| `packages/tui/src/component/logo.tsx` | le composant qui l'affiche |
| `packages/tui/src/theme/` | le système de thème (JSON + résolution) |
| `packages/server/` | le moteur agentique — **ne pas y toucher** |
| `packages/client/` | le client du serveur — **ne pas y toucher** |
| `packages/cli/` | le binaire et les commandes |

## Étape 2 — Les changements, dans l'ordre d'importance

### 2.1 Le logo (le vrai objet de ce fork)

`packages/tui/src/logo.ts` contient exactement ceci :

```ts
export const logo = {
  left: ["                   ", "█▀▀█ █▀▀█ █▀▀█ █▀▀▄", "█__█ █__█ █^^^ █__█", "▀▀▀▀ █▀▀▀ ▀▀▀▀ ▀~~▀"],
  right: ["             ▄     ", "█▀▀▀ █▀▀█ █▀▀█ █▀▀█", "█___ █__█ █__█ █^^^", "▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀"],
}
```

Deux colonnes : `left` et `right`. Le logo doit tenir dans **la même largeur de
gouttière** que l'ancien, sinon l'alignement de l'écran casse. C'est la
contrainte principale, et elle n'est pas évidente.

Attendu : un logo « phanos » (6 lettres) et un orbe d'or, dans le même gabarit
de 4 lignes. Le gabarit de la version actuelle fait 4 lignes ; le logo
`phanos` en pixel ASCII testé fait 5 lignes — vérifier le rendu réel.

### 2.2 Les chaînes visibles

Chercher les occurrences de la marque dans le paquet TUI et dans les messages
de sortie du CLI :

```bash
rg -n "opencode" packages/tui/src packages/cli/src | rg -v "opencode\.ai|@opencode/|from \"opencode"
```

Deux catégories, à traiter différemment :

- **Visibles par l'utilisateur** → remplacer par `phanos`.
- **Techniques** (`@opencode/tui`, clés d'import, noms de fichiers de config,
  noms de dossiers sous `~/.local/share/opencode`) → **ne pas renommer sans
  décision explicite**. Renommer les chemins de données cassera les sessions
  existantes et le mode headless déjà en place.

Point d'attention : le lanceur actuel lit et écrit
`~/.config/opencode/opencode.json` (clé `theme`). Si le fork change le nom du
dossier de config, `phanos/bin/phanos.mjs` doit être mis à jour **dans le même
changement** (voir `phanos/bin/phanos.mjs`, fonctions `installTheme` et
`useTheme`).

### 2.3 Ce qu'il ne faut PAS refaire

Ces éléments existent déjà et fonctionnent. Ne pas les réimplémenter :

| Besoin | Où c'est fait |
|---|---|
| affichage des messages | `packages/tui/src/routes/session/index.tsx` (`UserMessage:2227`, `ToolPart:2418`) |
| défilement avec fenêtrage | `packages/tui/src/routes/session/index.tsx:142` (`TRANSCRIPT_TAIL_ROWS`), `mount-budget.ts` |
| streaming | `packages/tui/src/routes/session/rows.ts:262` |
| spinner | `packages/tui/src/component/spinner.tsx` |
| scintillement | `packages/tui/src/component/shimmer-text.tsx` |
| diffs colorés | `packages/tui/src/component/patch-diff.tsx` |
| thème | `packages/tui/src/theme/` |

## Étape 3 — Ce qui est optionnel (améliorations d'affichage)

À faire seulement si le fork compile et tourne déjà. Priorité décroissante,
chacune avec sa source comme modèle :

1. **Pulsation pendant l'exécution d'un outil**, distincte de la rotation
   pendant la réflexion. Modèle : Claude Code — sinus de période 2 s, quantifié
   en 1/8. Codex : `codex-rs/tui/src/motion.rs`.
2. **Texte d'attente qui monte en intensité** : 5 phrases sur 45 s
   (« réflexion », « toujours en réflexion », …). Modèle : bundle Claude Code.
3. **Rendu compact et rendu complet = deux rendus distincts** (le compact
   retire les lignes de contexte), au lieu d'un repli qui masque. Modèle :
   `codex-rs/tui/src/exec_cell/compact.rs` et `transcript.rs`.
4. **Résultats d'outils en gris, rouge uniquement en cas d'échec**, pour que
   l'écran ne crie pas au milieu d'un tour.

Règle de mise en œuvre, à reprendre de Codex (`motion.rs:57`) : l'image
courante se dérive de **l'horloge murale** et chaque rendu **planifie le
suivant**. Pas de timer indépendant, donc pas de désynchronisation ni de coût
quand rien ne bouge.

## Étape 4 — Build et publication

Commandes du dépôt (Bun obligatoire) :

```bash
bun install
bun run --cwd packages/cli src/index.ts     # `dev`, lance la TUI
bun run typecheck
```

Le paquet npm `phanos` étant déjà pris sur npm (outil de stress-test
abandonné en 2014), **le nom publié doit être scopé** : `@cypher/phanos`,
avec le binaire toujours nommé `phanos`. Une simple ligne de commande
`npm i -g @cypher/phanos` donne ensuite `phanos` dans le terminal.

## Critères de sortie

- [ ] `phanos` au terminal affiche le logo phanos, pas opencode
- [ ] le thème or s'applique à toute l'interface, pas à une maquette
- [ ] une vraie session démarre, l'agent lit et écrit un fichier, le défilement
      remonte correctement dans les deux sens
- [ ] `~/.local/share/opencode` : les sessions existantes sont toujours lues
- [ ] licence MIT conservée avec sa notice

## Contexte vérifié qui ne doit pas être re-découvert

- Les **12 modèles gratuits** `opencode/*` fonctionnent **sans compte, sans clé,
  sans carte** (`opencode run -m opencode/big-pickle "…"` → réponse correcte,
  y compris exécution d'outils). Vérifié le 13/10/2026.
- Le serveur headless se pilote entièrement par HTTP :
  `POST /session` puis `POST /session/{id}/message`. Auth basic
  `opencode:$OPENCODE_SERVER_PASSWORD`. Vérifié.
- Le thème est un **JSON** découvert dans `<configDir>/themes/*.json` : c'est
  ainsi que le thème or est appliqué, sans toucher au code.
- Le `~/.config/opencode/opencode.json` de cette machine contient déjà une
  config OpenRouter existante de l'utilisateur — **ne pas l'écraser ni la
  supprimer**.