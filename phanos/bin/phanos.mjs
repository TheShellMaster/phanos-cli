#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, unlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const configDir = join(homedir(), ".config", "opencode");
const themesDir = join(configDir, "themes");
const configFile = join(configDir, "opencode.json");
const themeName = "phanos";

function which(cmd) {
  const dirs = (process.env.PATH || "").split(":");
  for (const d of dirs) {
    if (!d) continue;
    const p = join(d, cmd);
    if (existsSync(p)) return p;
  }
  return null;
}

function installTheme() {
  const src = join(root, "theme", "phanos.json");
  if (!existsSync(src)) return;
  mkdirSync(themesDir, { recursive: true });
  const dst = join(themesDir, "phanos.json");
  if (existsSync(dst)) {
    if (readFileSync(dst, "utf8") === readFileSync(src, "utf8")) return;
    writeFileSync(dst, readFileSync(src, "utf8"));
    return;
  }
  copyFileSync(src, dst);
}

function useTheme() {
  let cfg = {};
  if (existsSync(configFile)) {
    try {
      cfg = JSON.parse(readFileSync(configFile, "utf8"));
    } catch {
      return;
    }
  }
  if (cfg.theme === themeName) return;
  cfg.theme = themeName;
  mkdirSync(configDir, { recursive: true });
  writeFileSync(configFile, JSON.stringify(cfg, null, 2) + "\n");
}

function uninstallPhanos(deep = false) {
  process.stdout.write("\x1b[38;2;250;190;60m\n⚡ Désinstallation complète de Phanos en cours...\x1b[0m\n\n");

  // 1. Nettoyer la configuration utilisateur
  if (existsSync(configFile)) {
    try {
      const cfg = JSON.parse(readFileSync(configFile, "utf8"));
      if (cfg.theme === themeName) {
        delete cfg.theme;
        writeFileSync(configFile, JSON.stringify(cfg, null, 2) + "\n");
        process.stdout.write("  ✓ Configuration locale nettoyée\n");
      }
    } catch {}
  }

  // 2. Supprimer les fichiers de thèmes et résidus
  const installedTheme = join(themesDir, "phanos.json");
  if (existsSync(installedTheme)) {
    try {
      unlinkSync(installedTheme);
      process.stdout.write("  ✓ Fichiers de thèmes Phanos purgés\n");
    } catch {}
  }

  // 3. Purge complète du moteur sous-jacent si demandé via --all ou --full
  if (deep) {
    process.stdout.write("  ✓ Désinstallation du moteur terminal et dépendances...\n");
    try {
      spawn("npm", ["-g", "uninstall", "@cypher/phanos", "opencode-ai"], { stdio: "inherit" });
    } catch {}
  } else {
    process.stdout.write("  ✓ Nettoyage des composants Phanos terminé\n\n");
    process.stdout.write("\x1b[1mPour désinstaller complètement Phanos et son moteur de ce PC :\x1b[0m\n");
    process.stdout.write("  \x1b[38;2;255;205;90mphanos uninstall --all\x1b[0m\n");
    process.stdout.write("  ou manuellement : \x1b[38;2;255;205;90mnpm -g uninstall @cypher/phanos opencode-ai\x1b[0m\n\n");
  }

  process.stdout.write("\x1b[32m✓ Phanos a été désinstallé proprement de votre machine.\x1b[0m\n");
  process.exit(0);
}

const argv = process.argv.slice(2);

// Commande de désinstallation complète
if (argv[0] === "uninstall" || argv[0] === "remove" || argv.includes("--uninstall")) {
  const isDeep = argv.includes("--all") || argv.includes("--full");
  uninstallPhanos(isDeep);
}

if (argv.includes("--version") || argv.includes("-v")) {
  process.stdout.write("phanos 0.0.1 (Terminal Agentique Ambre & Or)\n");
  process.exit(0);
}

const engine = which("opencode");

if (!engine) {
  process.stderr.write(
    "phanos : moteur d'exécution introuvable.\n" +
      "Pour initialiser : npm i -g opencode-ai\n",
  );
  process.exit(127);
}

// Activation automatique
installTheme();
useTheme();

// Petite mascotte ASCII Mistral-vibe au lancement
const GOLD = "\x1b[38;2;255;205;90m";
const AMBER = "\x1b[38;2;250;190;60m";
const BRONZE = "\x1b[38;2;196;118;20m";
const RESET = "\x1b[0m";

if (!argv.includes("--silent") && process.stdout.isTTY && argv.length === 0) {
  process.stdout.write(
    `\n  ${GOLD}╭────────╮${RESET}  ${AMBER}★ PHANOS${RESET}\n` +
    `  ${GOLD}│ ✧    ✧ │${RESET}  ${BRONZE}Agent Terminal · Ambre & Or · Français${RESET}\n` +
    `  ${GOLD}│   ▽    │${RESET}  ${BRONZE}Tapez /help pour les commandes, /connect pour vos clés API${RESET}\n` +
    `  ${GOLD}╰─▀▀──▀▀─╯${RESET}\n\n`
  );
}

const passthrough = new Set([
  "run",
  "serve",
  "models",
  "providers",
  "auth",
  "agent",
  "session",
  "mcp",
  "stats",
  "debug",
  "attach",
  "completion",
  "upgrade",
  "export",
  "import",
]);

const args = passthrough.has(argv[0]) ? argv : [];
if (argv[0] === "web") {
  process.stderr.write("phanos : interface web non incluse pour l'instant\n");
  process.exit(1);
}

const child = spawn(engine, args, { stdio: "inherit" });
child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 0);
});
child.on("error", (err) => {
  process.stderr.write("phanos : " + err.message + "\n");
  process.exit(1);
});