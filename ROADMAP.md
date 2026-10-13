# PHANOS — Roadmap

Agent CLI agentique : on lance `phanos` dans le terminal, il fait le PC à ta
place. Providers gratuits ou payants au choix. Installation via npm.

> Statut : cadrage + recherche. Aucune ligne de code.
> Dernière mise à jour : 13/10/2026.

---

## 1. Découverte bloquante : le nom npm est pris

`phanos` existe sur npm depuis 2013 : un outil de stress-test abandonné
(dernière version 0.1.4, février 2014, 2 utilisateurs).
Source : https://registry.npmjs.org/phanos

**Conséquence** : `npm i -g phanos` est impossible sous ce nom exact.
Options, par ordre de simplicité :

| Option | Exemple | Effort |
|---|---|---|
| Package scopé | `npm i -g @cypher/phanos` (binaire `phanos` inchangé) | nul, le nom affiché reste `phanos` |
| Variante | `phanos-ai`, `phanos-cli` | nul, mais nom moins pur |
| Récupérer `phanos` | contacter le mainteneur / npm support | long, incertain (compte inactif depuis 2014) |

Recommandation : **package scopé**. L'utilisateur tape toujours `phanos`
dans le terminal, seul l'install change d'une ligne.

---

## 2. Découverte structurante : OpenCode est déjà découpé en deux

Recherche approuvée, c'est le point qui change tout le plan :

- `opencode serve` lance un serveur headless avec spec **OpenAPI 3.1**.
  Source : https://opencode.ai/docs/server/
- Le **SDK public** `@opencode-ai/sdk` (`createOpencode`, `createOpencodeClient`)
  pilote sessions, messages, sous-agents, permissions.
  Source : https://opencode.ai/docs/sdk/
- Le TUI officiel n'est qu'un client de ce serveur (worker thread + RPC,
  ou HTTP + SSE). Source : https://www.opencodebook.xyz/en/chapter_12_cli_and_tui/12.2_tui_implementation
- **Licence MIT**, vérifiée sur le fichier LICENSE du dépôt :
  https://raw.githubusercontent.com/sst/opencode/dev/LICENSE
  → réutilisation, modification et redistribution autorisées, y compris
  commerciale. Seule obligation : garder la notice de copyright.
- Catalogue de modèles communautaire : https://github.com/sst/models.dev
  (fichiers TOML par provider, utilisé en interne par OpenCode).

**Traduction** : « garder toute la base des outils et refaire le TUI » est
légalement et techniquement possible **sans forker** : phanos peut être un
client du serveur OpenCode.

---

## 2 bis. Test réel passé : les modèles gratuitsmarchent sans rien

Vérifié en machine le 13/10/2026, avec `opencode 1.18.35` déjà installé :

```
$ opencode auth list        → 0 credentials  (aucun compte, aucune clé)
$ opencode models opencode  → 12 modèles gratuits
$ opencode run -m opencode/big-pickle "Dis bonjour en une phrase."
→ Bonjour ! Comment puis-je vous aider aujourd'hui ?
```

Et surtout, l'**agent a agi** sans supervision : demande de créer un fichier →
`Write SPIKE_OK.txt` + `ls -la`, fichier créé et vérifié. La boucle agentique
(outil, permission, exécution) fonctionne avec un modèle gratuit.

**Conséquences, qui corrigent la section 5 :**

- Aucun provider externe n'est nécessaire pour démarrer phanos.
- Aucun code de provider n'est à écrire : OpenCode expose déjà ses 12 modèles
  gratuits via `opencode/<model-id>`.
- Le risque n'est plus « comment brancher une IA », il est « que se passe-t-il
  quand OpenCode retire ses modèles gratuits ? » Ils sont annoncés
  « pour une durée limitée » (promos). C'est exactement là que phanos se
  distingue : une **chaîne de repli** vers des sources gratuites stables
  (Ollama local, OpenRouter `:free`, Groq) quand un modèle gratuit disparaît.
- Quota exact des modèles gratuits non vérifié empiriquement (la FAQ mentionne
  un ordre de grandeur de 200 requêtes/jour). À mesurer, pas à supposer.

## 3. Les trois architectures possibles

### Voie A — client léger sur le serveur OpenCode (recommandée)

- `phanos` = ton TUI + tes couleurs + ton branding.
- Le noyau (boucle agentique, outils, permissions, compaction, providers,
  MCP) tourne dans `opencode serve`, piloté via `@opencode-ai/sdk`.
- Distribution npm : ton TUI + dépendance épinglée vers le binaire serveur.

| + | − |
|---|---|
| 90 % du noyau déjà écrit et maintenu par SST | dépendance au rythme et aux choix de SST |
| Mises à jour du noyau = changer un numéro de version | si l'API du SDK casse, tu suis |
| Le poste utilisateur n'a besoin que de Node + npm | le serveur embarque Bun (transparent, mais présent) |

### Voie B — fork d'OpenCode

- Copie du dépôt, tu modifies le TUI dedans.
- Contrôle total, mais tu absorbes chaque mise à jour amont (rebase).
- C'est exactement le coût qu'on a refusé pour Cypher quand il s'agissait
  de patcher `config.js` côté serveur.

### Voie C — noyau maison sur Vercel AI SDK

- Tu réécris la boucle agentique avec `ai` + `@ai-sdk/*`
  (le même socle qu'OpenCode : https://github.com/sst/opencode/blob/dev/packages/opencode/src/provider/provider.ts).
- Contrôle absolu, mais tu réécris : boucle outils, permissions, compaction
  du contexte, streaming, gestion d'erreurs par provider. Des mois.
- À ne choisir que si les voies A et B s'avèrent bloquantes.

**Décision proposée : voie A, avec sortie de secours vers B.**
Si le SDK s'avère trop limitant pendant le spike (phase 1), on bascule sur
le fork avant d'avoir investi dans le TUI.

---

## 4. Stack proposée

| Couche | Choix | Pourquoi (source) |
|---|---|---|
| Noyau agentique | Serveur OpenCode via `@opencode-ai/sdk` | MIT, OpenAPI 3.1, déjà maintenu (opencode.ai/docs/server) |
| Providers IA | ceux du serveur (25+ via Vercel AI SDK) | `@ai-sdk/*` + `@ai-sdk/openai-compatible` en attrape-tout (provider.ts du dépôt) |
| Catalogue modèles | `models.dev` (miroir ou dépendance) | TOML communautaires, prix + capacités (github.com/sst/models.dev) |
| TUI | **Ink** (React, Node) | 35k+ stars, MIT, utilisé par Claude Code et Gemini CLI. Écosystème le plus large |
| Alternative TUI | OpenTUI | Plus rapide (cœur Zig), mais Bun requis + pré-1.0 + soucis mémoire du driver React (benchmarks Rezi, Better Stack) |
| Extensions | MCP (`@modelcontextprotocol/sdk`) | Standard déjà supporté par le serveur |
| Config utilisateur | `~/.config/phanos/phanos.json` + `{{env:VAR}}` | même convention qu'OpenCode, clés jamais en dur |
| Distribution | `npm i -g @cypher/phanos` + script `install.sh` | même chemin qu'OpenCode (`npm i -g opencode-ai`) |

Pourquoi Ink plutôt qu'OpenTUI : un outil distribué via npm doit tourner
sur Node partout. OpenTUI exige Bun et reste pré-1.0 ; Ink est prouvé par
deux produits majeurs. La perf suffit pour un agent (le goulot, c'est le
réseau vers le LLM, pas le rendu).

---

## 4 bis. Identité retenue : ambre, or, pixel

Choix de l'utilisateur, à la place de la palette « Aurore » de Cypher :

- Palette **ambre/or** : bronze `#C47614`, ambre `#FABE3C`, or `#FFCD5A`,
  pâle `#FFEAAA`, encre chaude `#F6F0E4`, gris chaud `#A0927A`.
- Animation d'entrée : **boule d'or pixelisée qui tourne sur elle-même**
  (`phanos/splash/orb.mjs`). Sphère 3D ombrée, rendue en demi-blocs `▀`
  (2 pixels par cellule), 26 colonnes × 26 lignes de caractères, dégradé
  bronze → or pâle, plus des scintillements twinkles. Se termine sur le logo
  `phanos` en lettres pixel dorées et la signature « agent terminal · gratuit ·
  français ».
- Contrainte de proportions vérifiée : un caractère terminal étant deux fois
  plus haut que large, la grille doit avoir `H = 2 × W` en pixels pour que la
  sphère paraisse ronde. Mesure : 24 colonnes × 46 lignes pixel = 23 lignes de
  caractères → quasi carré à l'écran.
- `phanos/mockup/screen.mjs` : écran principal re-teinté ambre.

---

## 4 ter. Rectificatif majeur : on ne refait PAS l'interface

Lecture du code de `base-opencode/packages/tui` (13/10/2026). J'avais supposé
qu'il faudrait reconstruire un écran. C'est faux, et c'est mieux :

- L'interface est **déjà écrite** : SolidJS + OpenTUI (`@opentui/core`,
  `@opentui/solid`). Rendu via un seul `CliRenderer` (`src/app.tsx:265`),
  cible 60 fps, clavier kitty.
- Les **messages** ont déjà leurs composants : `UserMessage`
  (`src/routes/session/index.tsx:2227`), `TextPart` (markdown streaming,
  `src/routes/session/message-parts.tsx:169`), `ReasoningPart` (avec spinner
  « Thinking », `:42`), `ToolPart` qui dispatche read/write/edit/grep/glob/shell
  (`index.tsx:2418`).
- Le **défilement** est déjà résolu : `<scrollbox>` + montage par fenêtrage
  « tail-first ». Seules les 40 dernières lignes sont montées
  (`TRANSCRIPT_TAIL_ROWS`, `index.tsx:142`), les anciennes remontent par
  paquets de 60 (`TRANSCRIPT_BACKFILL_CHUNK`) en compensant la position avec
  `scrollHeight` avant/après. Pas de virtualisation maison à réinventer.
- Le **streaming** n'a pas de buffer local : les événements SSE du serveur
  mutent le store et seuls les morceaux concernés se redessinent.
- Et surtout : **le thème est un fichier JSON**, pas du code. Thèmes
  discoveries dans `<configDir>/themes/*.json` (`src/theme/discovery.ts:4`),
  surcharge depuis la config (`theme: {name}`), rechargement à chaud sur
  `SIGUSR2`.

**Conséquence : phanos = OpenCode + un thème + un nom + une config.**
On ne touche ni aux messages, ni au défilement, ni au streaming.

### Ce qui a été fait dans ce sens

- Thème **phanos** créé dans le mécanisme officiel :
  `~/.config/opencode/themes/phanos.json` — nuances `orange` et `gray`
  remplacées par des échelles or et gris chaud, `accent` et `interactive`
  pointant sur l'or.
- Activé dans `~/.config/opencode/opencode.json` : `"theme": "phanos"`.
- Vérification visuelle encore **à faire par l'utilisateur** (`opencode` dans
  un terminal) : `opencode debug config` n'expose pas le thème, donc la preuve
  ne peut pas être faite en mode non interactif.

### Abandonné

- `phanos/mockup/screen.mjs` : maquette en dur, supprimée. Elle inventait une
  conversation fictive au lieu d'afficher la vraie donnée — exactement l'erreur
  signalée.
- L'animation d'entrée reste à refaire, mais avec OpenTUI (la même bibliothèque
  que l'interface réelle), et seulement si on garde une identité propre.

---

## 4 quater. Lanceur `phanos` + étude visuelle Claude Code / Codex

### Lanceur (fait et vérifié le 13/10/2026)

- `phanos/package.json` : nom `@cypher/phanos` (npm `phanos` étant pris),
  binaire `phanos`.
- `phanos/bin/phanos.mjs` : lanceur qui trouve le moteur `opencode`, installe
  le thème `phanos` dans `~/.config/opencode/themes/` au premier lancement,
  l'active dans `~/.config/opencode/opencode.json`, puis transmet au moteur.
  Les sous-commandes (`run`, `serve`, `models`, `providers`, `session`,
  `debug`…) sont relayées telles quelles.
- `phanos/theme/phanos.json` : le thème embarqué, installé par le lanceur.
- Installé par `npm link` → `phanos` est une vraie commande.
- Vérifié : `phanos --version` et
  `phanos run -m opencode/big-pickle "…"` → `LANCEUR PHANOS OK`.

**Limite connue** : le nom **dans** l'application (le logo ASCII de 4 lignes,
`packages/tui/src/logo.ts`) ne peut pas être changé par le lanceur. Le moteur
installé est un binaire compilé ; il faudrait recompiler la TUI, donc un fork.
**Bun est inutilisable sur cette machine** (`bun --version` →
« Instruction non permise », core dump) et OpenTUI a un cœur natif Zig. Donc
la compilation locale est bloquée : à trancher (fork compilé ailleurs, ou
accepter le logo d'origine).

### Ce que font Claude Code et Codex, et ce qu'on peut en reprendre

Étude du bundle Claude Code v2.1.295 installé sur cette machine + du repo
`openai/codex` (`codex-rs/tui`). Ce qui est déjà présent dans OpenCode est
signalé.

| Idée | Claude Code | Codex | OpenCode aujourd'hui |
|---|---|---|---|
| Pastille à 3 états : même glyphe, couleur = état | `·✔️·` / `✗` | `•` vert / rouge / animé | **déjà présent** (ToolPart) |
| Curseur pendant l'action | 10 images braille, 80 ms | mêmes images, 100 ms | **déjà présent** `component/spinner.tsx` |
| Pulsation pendant un outil (≠ rotation) | sinus 2 s, quantifié en 1/8 | — | **à faire** |
| « Shimmer » : une bande qui balaie le texte | statut qui respire gris après 3 s | bande 2 s, cosinus relevé, 1 balayage / 4 s | **déjà présent** `component/shimmer-text.tsx` |
| Indentation des résultats `⎿` (avec espaces insécables) | oui, `  ⎿  ` | `│` + `└` | **déjà présent** (groupes) |
| Résultats d'outils en gris, rouge seulement en cas d'échec | oui | rouge **et** gris en ligne | à vérifier |
| Diff à 6 couleurs : ligne + mot, et version atténuée à la recherche | 6 jetons | 6 palettes truecolor + 6 palettes 256 | **déjà présent** `patch-diff.tsx` |
| Rendu compact et rendu complet = deux rendus distincts | repli/dépli | oui (compact sans contexte) | partially (disclosure) |
| Texte d'attente qui monte en intensité | 5 phrases sur 45 s | — | **à faire** |
| Motion réduite = arrêt du timer, pas de frame de secours | oui | `MotionMode` par site | config `animations` existe |

Conclusions :

1. **La majorité est déjà dans OpenCode.** Copier Claude Code ne gained presque
   rien côté affichage ; le vrai écart est le renommage du produit et le thème.
2. Ce qui manque et mérite d'être fait, mais **exige un fork** : la pulsation
   distincte pendant un outil, les phrases d'attente, le double rendu
   compact/complet.
3. Un détail d'implémentation à copier si on fork un jour : chaque image du
   spinner dérive de l'**horloge murale** et chaque rendu **planifie la
   suivante**, donc rien ne se désynchronise et une animation coûte cher
   seulement quand quelque chose bouge (`codex-rs/tui/src/motion.rs:57`).

---

## 5. Différenciation : ce qui justifie phanos face aux 5 existants

Le marché (vérifié le 13/10/2026) :

- OpenCode (MIT), Crush (FSL, pas vraiment libre), Aider (Apache-2.0,
  mature mais lent à évoluer), Goose (Apache-2.0), Gemini CLI (Apache-2.0,
  1000 req/jour gratuites), Claude Code / Codex (propriétaires).

« Multi-provider + npm » ne différencie plus. Ce qui manque :

1. **Un gratuit qui ne disparaît pas.** OpenCode donne 12 modèles gratuits,
   mais ils sont **promotionnels et révocables** : le jour où SST les retire,
   l'utilisateur se retrouve sans IA. phanos garde un modèle gratuit par
   défaut *et* une chaîne de repli (Ollama local → OpenRouter `:free` →
   Groq) qui prend le relais automatiquement. C'est le système
   `provider_health.py` de Cypher, aucun des 5 concurrents ne le fait.
   Positionnement : « gratuit qui survit à la promo ».
2. **Onboarding guidé.** `phanos /connect` qui détecte les clés présentes,
   teste chaque provider par un vrai appel, et dit quoi remplir. Inspiré
   de `/connect` d'OpenCode, en plus strict (tester avant d'affirmer — leçon
   du faux 200 sur `/v1/models` côté Cypher).
3. **Français natif.** Aucun des 5 n'est francophone-first. Coût faible,
   signal fort pour le public visé.

---

## 6. Phases

### Phase 0 — cadrage et spike (2–3 jours)

- [ ] Trancher le nom npm (`@cypher/phanos` vs variante) et réserver
- [x] **Spike CLI : VALIDÉ le 13/10/2026.** `opencode run -m opencode/big-pickle`
      a répondu puis exécuté un outil (création de fichier + `ls`) sans aucune
      clé. Le noyau agentique est utilisable tel quel.
- [x] **Spike serveur + SDK : VALIDÉ le 13/10/2026.** Sans TUI, sans clé :
      `opencode serve --port 4098` (auth basic `opencode:$OPENCODE_SERVER_PASSWORD`)
      puis `POST /session` → `POST /session/{id}/message` avec
      `{"model":{"providerID":"opencode","modelID":"big-pickle"}}` → réponse
      `PILOTE OK`. Le noyau se pilote entièrement depuis notre code.
      → **Voie A confirmée.** On construit notre propre écran, sans fork.
- [ ] Mesurer le quota réel des modèles gratuits (usage réel, pas la FAQ)
- [ ] Maquette du TUI (couleurs Aurore, logo) en statique, validée à l'écran

### Phase 1 — client minimal (1–2 semaines)

- [ ] `phanos "fais X"` : prompt → stream → sortie, sans TUI (texte simple)
- [ ] `phanos` seul : TUI Ink minimal (input + transcript + spinner)
- [ ] Config `~/.config/phanos/phanos.json` + lecture `{{env:VAR}}`
- [ ] `phanos /connect` : guide de saisie des clés
- [ ] **Critère de sortie** : un tiers installe via npm et obtient une réponse
      d'un provider gratuit en moins de 5 minutes

### Phase 2 — identité et gratuits-d'abord (2 semaines)

- [ ] Thème Aurore complet (couleurs, orbe, splash terminal)
- [ ] Preset providers avec ordre gratuit → payant + bascule auto sur 429/402
- [ ] `phanos /status` : état de chaque provider (testé en direct, pas affiché)
- [ ] Sessions persistées, historique, `/undo` esprit Aider
- [ ] **Critère de sortie** : démo « 0 € dépensé, 3 providers qui se relaient »

### Phase 3 — distribution et docs (1 semaine)

- [ ] `npm i -g @cypher/phanos` sur Linux/macOS/Windows (CI matrice)
- [ ] `install.sh` (dépendances, clés, vérifications) sur le modèle Cypher
- [ ] README + `phanos --help` + site minimal
- [ ] **Critère de sortie** : installation propre sur machine vierge

### Phase 4 — divergence contrôlée (ensuite, au besoin)

- [ ] Outils propres à phanos (ex. `web_search` SearXNG local, mémoire)
- [ ] Skills, subagents, MCP préconfigurés
- [ ] N'ouvrir cette phase que sur un besoin prouvé, pas spéculatif

---

## 7. Risques

| Risque | Probabilité | Mitigation |
|---|---|---|
| L'API du serveur OpenCode casse | moyenne | épingler la version serveur, CI qui teste la montée de version |
| SST change de licence | faible (MIT stable) | le code déjà récupéré reste MIT |
| `phanos` scopé moins mémorable | sûr | binaire `phanos` inchangé, seul l'install diffère |
| Qualité de boucle en deçà de Claude Code | forte | ne pas promettre l'équivalent ; promettre « gratuit + simple » |
| Coûts tokens des utilisateurs | moyenne | preset gratuits-d'abord + compteur visible, leçon Cypher (`usage_usd` compteur, pas facture) |
| Maintenance multi-plateforme npm | moyenne | CI sur 3 OS dès la phase 3, pas après |

---

## 8. Prochaines actions (dans l'ordre)

1. Valider le nom (`@cypher/phanos`) et cette roadmap
2. Réserver le scope npm + créer le dépôt GitHub
3. Spike phase 0 (le seul point qui peut tout changer)
4. Scaffold `nouveau-projet/` : `package.json`, `bin/phanos`, config exemple
