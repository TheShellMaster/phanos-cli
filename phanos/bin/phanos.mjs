#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
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
      process.stderr.write("phanos : config illisible, je ne la touche pas\n");
      return;
    }
  }
  if (cfg.theme === themeName) return;
  cfg.theme = themeName;
  mkdirSync(configDir, { recursive: true });
  writeFileSync(configFile, JSON.stringify(cfg, null, 2) + "\n");
}

const argv = process.argv.slice(2);

if (argv.includes("--version") || argv.includes("-v")) {
  process.stdout.write("phanos 0.0.1\n");
  process.exit(0);
}

const engine = which("opencode");

if (!engine) {
  process.stderr.write(
    "phanos : moteur introuvable.\n" +
      "installe le avec :  npm i -g opencode-ai\n",
  );
  process.exit(127);
}

installTheme();
useTheme();

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
  "uninstall",
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