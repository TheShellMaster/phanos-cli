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

function uninstallPhanos() {
  process.stdout.write("\x1b[38;2;250;190;60m\n⚡ Désinstallation de Phanos en cours...\x1b[0m\n\n");

  // 1. Nettoyer le thème dans opencode.json
  if (existsSync(configFile)) {
    try {
      const cfg = JSON.parse(readFileSync(configFile, "utf8"));
      if (cfg.theme === themeName) {
        delete cfg.theme;
        writeFileSync(configFile, JSON.stringify(cfg, null, 2) + "\n");
        process.stdout.write("  ✓ Configuration ~/.config/opencode/opencode.json restaurée\n");
      }
    } catch {}
  }

  // 2. Supprimer le fichier thème phanos.json
  const installedTheme = join(themesDir, "phanos.json");
  if (existsSync(installedTheme)) {
    try {
      unlinkSync(installedTheme);
      process.stdout.write("  ✓ Fichier thème phanos.json supprimé\n");
    } catch {}
  }

  // 3. Instruction de dé-liaison npm
  process.stdout.write("  ✓ Nettoyage des fichiers locaux Phanos terminé\n\n");
  process.stdout.write("\x1b[1mPour retirer définitivement la commande 'phanos' de votre terminal :\x1b[0m\n");
  process.stdout.write("  \x1b[38;2;255;205;90mnpm -g uninstall @cypher/phanos\x1b[0m\n\n");
  process.stdout.write("Phanos a été proprement désactivé.\n");
  process.exit(0);
}

const argv = process.argv.slice(2);

// Commande de désinstallation
if (argv[0] === "uninstall" || argv[0] === "remove" || argv.includes("--uninstall")) {
  uninstallPhanos();
}

if (argv.includes("--version") || argv.includes("-v")) {
  process.stdout.write("phanos 0.0.1 (moteur OpenCode + thème & TUI Phanos ambre/or)\n");
  process.exit(0);
}

const engine = which("opencode");

if (!engine) {
  process.stderr.write(
    "phanos : moteur OpenCode introuvable sur votre système.\n" +
      "Installez-le avec : npm i -g opencode-ai\n",
  );
  process.exit(127);
}

// Installation et activation automatique du thème Phanos ambre/or
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