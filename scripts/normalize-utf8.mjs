import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = ["src", "docs", "supabase", "."];
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".sql",
  ".toml",
  ".ts",
  ".tsx",
]);
const ignored = new Set(["node_modules", "dist", ".output", ".vinxi", ".git"]);
const ignoredFiles = new Set(["bun.lock", "package-lock.json", "pnpm-lock.yaml"]);

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name) || ignoredFiles.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else if (textExtensions.has(extname(entry.name)) || entry.name.startsWith(".env")) files.push(full);
  }
  return files;
}

const seen = new Set();
for (const root of roots) {
  for (const file of await walk(root)) {
    if (seen.has(file)) continue;
    seen.add(file);
    const text = await readFile(file, "utf8");
    await writeFile(file, text, "utf8");
  }
}

console.log(`Normalized ${seen.size} text files as UTF-8.`);
