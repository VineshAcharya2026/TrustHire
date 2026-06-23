#!/usr/bin/env node
/**
 * One-time production DB setup for Vercel.
 * Usage: DATABASE_URL="postgresql://..." node scripts/setup-production-db.mjs
 * Or:    npx vercel env pull .env.production.local && node scripts/setup-production-db.mjs
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(file) {
  const path = resolve(root, file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

loadEnvFile(".env.production.local");
loadEnvFile(".env.local");
loadEnvFile(".env");

// Prefer production-local values when present (loadEnvFile only fills unset keys).
function preferEnvFile(file) {
  const path = resolve(root, file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    const value = m[2].trim().replace(/^["']|["']$/g, "");
    if (value) process.env[key] = value;
  }
}
preferEnvFile(".env.production.local");

const url = process.env.DATABASE_URL;
if (!url || url.startsWith("file:")) {
  console.error(`
ERROR: DATABASE_URL must be a PostgreSQL connection string.

Setup steps:
1. Open https://vercel.com/vineshjm-3253s-projects/~/integrations/accept-terms/neon
2. Accept Neon terms, then run: npx vercel integration add neon
3. Connect a database to the trust-hire project in Vercel Storage tab
4. Run: npx vercel env pull .env.production.local
5. Re-run: node scripts/setup-production-db.mjs
`);
  process.exit(1);
}

const prisma = resolve(root, "node_modules/prisma/build/index.js");
const tsx = resolve(root, "node_modules/tsx/dist/cli.mjs");

console.log("Pushing schema to production database...");
execSync(`node "${prisma}" db push --accept-data-loss`, { stdio: "inherit", cwd: root, env: process.env });

console.log("Seeding demo accounts...");
execSync(`node "${tsx}" prisma/seed.ts`, { stdio: "inherit", cwd: root, env: process.env });

console.log("\nDone! Demo logins:");
console.log("  superadmin@trusthire.com / Password123!");
console.log("  mentor@trusthire.com / Password123!");
console.log("  mentee@trusthire.com / Password123!");
