#!/usr/bin/env bash
set -e

echo -e "\033[38;2;250;190;60m"
cat << "EOF"
  ╭────────╮  ★ INSTALLATION DE PHANOS
  │ ✧    ✧ │  Configuration autonome & sécurisée
  │   ▽    │  Theme Ambre/Or + Commandes agentiques
  ╰─▀▀──▀▀─╯
EOF
echo -e "\033[0m"

# 1. Vérification de Node.js / npm
if ! command -v node >/dev/null 2>&1; then
  echo "Erreur : Node.js (version 20+) est requis."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Erreur : npm est requis."
  exit 1
fi

# 2. Installation du moteur d'exécution requis
if ! command -v opencode >/dev/null 2>&1; then
  echo "Installation du moteur d'exécution..."
  npm install -g opencode-ai --silent || npm install -g opencode-ai
fi

# 3. Liaison globale du binaire phanos
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Liaison globale de la commande 'phanos'..."
cd "$SCRIPT_DIR" && npm link

# 4. Initialisation du thème et configuration
"$SCRIPT_DIR/bin/phanos.mjs" --version >/dev/null 2>&1 || true

echo -e "\033[32m✓ Phanos est installé avec succès !\033[0m"
echo -e "Tapez simplement \033[38;2;255;205;90mphanos\033[0m depuis n'importe quel terminal pour le lancer."
echo -e "Pour le désinstaller proprement à tout moment : \033[38;2;255;205;90mphanos uninstall --all\033[0m"
