# ⚡ PHANOS CLI

> **Agent Terminal Agentique & Autonome**  
> Une interface TUI ambre/or hautement réactive, inspirée de l'ergonomie de Claude Code et de la vibe Mistral, bâtie sur le socle natif ultra-robuste d'OpenCode (`@opencode/server` + `@opentui/solid`).

---

## 🏛️ Structure du Dépôt

Ce dépôt est organisé de manière modulaire afin de séparer nettement l'outil prêt à l'emploi, le moteur terminal sous-jacent, et l'ensemble des travaux de conception agentique :

```
phanos-cli/
├── phanos/                 # 🚀 LANCEUR & DISTRIBUTION CLI (@cypher/phanos)
│   ├── bin/phanos.mjs      # Point d'entrée binaire exécutable globalement (`phanos`)
│   ├── splash/orb.mjs      # Animation de la sphère dorée 3D pixel
│   ├── theme/phanos.json   # Thème sémantique ambre/or
│   └── package.json        # Configuration npm
│
├── base-opencode/          # ⚙️ MOTEUR NATIF OPENCODE & EXTENSIONS TUI PHANOS
│   └── packages/tui/src/
│       ├── component/mascot/       # 🦉 Mascotte Cyber Pixel-Art (vibe Mistral)
│       │   ├── MascotCanvas.tsx    # Rendu matriciel demi-blocs (▀, ▄, █)
│       │   ├── MascotSplash.tsx    # Séquence d'animation au réveil
│       │   ├── MascotWidget.tsx    # Widget permanent d'angle supérieur droit
│       │   ├── matrix.ts           # Sprites et frames d'humeur (idle, thinking, executing)
│       │   └── palette.ts          # Nuances or/ambre (#FABE3C, #FFCD5A, #C47614)
│       │
│       ├── routes/session/layout/  # 📐 Layout Split-Screen Asymétrique
│       │   ├── AsymmetricLayout.tsx  # Conteneur réactif split (~30% gauche / ~70% droite)
│       │   └── AsymmetricSidebar.tsx # Volet gauche d'inspection (modèle, tokens, sous-agents)
│       │
│       └── routes/session/tools/   # 🛠️ Affichage Outils Dynamique Façon Claude Code
│           ├── ClaudeToolPart.tsx    # Routeur et dispatcher d'outils
│           ├── ToolRowBadge.tsx      # Badges catégorisés ([Bash], [Read], [Edit], etc.)
│           ├── ToolAccordion.tsx     # Accordéon interactif dépliable d'un clic
│           ├── ToolDurationBadge.tsx # Spinner fluide ambré + chronométrage réel
│           └── views/                # Vues spécialisées par catégorie d'outil
│
├── .agents/                # 🧠 ARCHITECTURE & SYSTÈME MULTI-AGENTS
│   ├── teamwork/           # Rapports de conception et logs d'orchestration
│   │   ├── orchestrator_1/
│   │   │   ├── CODE_MODULARITY_GUIDELINES.md   # Charte modulaire (< 250 lignes/fichier)
│   │   │   ├── CLAUDE_TOOLS_IMPLEMENTATION.md  # Spécifications réelles des outils
│   │   │   ├── SERVER_CONNECTION_REPORT.md     # Preuve de robustesse native du serveur
│   │   │   ├── GROUND_TRUTH_SCOUT.md           # Vérités terrain SolidJS / OpenTUI
│   │   │   └── CLEANUP_AUDIT.md                # Rapport d'audit de nettoyage
│   │   └── ORIGINAL_REQUEST.md                 # Brief originel du projet
│
├── ROADMAP.md              # Feuille de route technique complète
└── BRIEF-FORK.md           # Cadrage et stratégie de découpage OpenCode
```

---

## 🚀 Installation & Utilisation (1 Seule Commande)

### 1. Prérequis
- [Node.js](https://nodejs.org/) ($\ge 20$)
- [Bun](https://bun.sh/) ($\ge 1.1$)

### 2. Cloner et Lier Localement
```bash
git clone https://github.com/TheShellMaster/phanos-cli.git
cd phanos-cli/phanos
npm link
```

### 3. Lancer Phanos
Où que vous soyez dans votre terminal :
```bash
phanos
```

---

## ✨ Fonctionnalités Clés

1. **Mascotte Pixel-Art Vivante (Vibe Mistral)** :
   - Éveil animé au démarrage.
   - Compagnon permanent dans le coin supérieur droit qui cligne doucement des yeux en veille et s'illumine d'étincelles lors de la réflexion ou de l'exécution d'un outil.
2. **Disposition Asymétrique Split-Screen** :
   - Volet gauche dédié au contexte : modèle actif, jauge de tokens, sous-agents et historique.
   - Volet droit dédié au chat et aux outils avec composer suspendu ambre/or.
3. **Affichage des Outils Façon Claude Code** :
   - Badges colorés clairs (`[Bash]`, `[Read]`, `[Edit]`, `[Grep]`, `[Search]`).
   - Spinner d'activité ambré et chronométrage à la milliseconde.
   - Sorties volumineuses repliées par défaut dans des accordéons interactifs dépliables d'un clic.
4. **Pensée & Raisonnement (Thinking)** :
   - En-tête concise avec chevrons interactifs (`▶ Thought: Analysé · 1.4s`) dépliable d'un clic pour inspecter la réflexion complète sans saturer l'écran.
5. **Tuyauterie Native Éprouvée** :
   - Conservation intégrale de la boucle agentique et du terminal persistant (PTY) d'OpenCode, éliminant tout risque de gel ou de déconnexion.

---

## 📜 Licence
MIT
