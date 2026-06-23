#!/usr/bin/env node
/**
 * Migrate production DB from referral schema to mentorship schema without force-reset.
 * Clears legacy data, then runs prisma db push --accept-data-loss and seed.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(file, override = false) {
  const path = resolve(root, file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    const value = m[2].trim().replace(/^["']|["']$/g, "");
    if (override || !process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.production.local");
loadEnvFile(".env.local");
loadEnvFile(".env");
loadEnvFile(".env.production.local", true);

const url = process.env.DATABASE_URL;
if (!url || url.startsWith("file:")) {
  console.error("ERROR: DATABASE_URL must be a PostgreSQL connection string.");
  process.exit(1);
}

const prisma = new PrismaClient();
const prismaCli = resolve(root, "node_modules/prisma/build/index.js");
const tsx = resolve(root, "node_modules/tsx/dist/cli.mjs");

async function clearLegacyData() {
  console.log("Dropping legacy schema...");
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS public CASCADE`);
  await prisma.$executeRawUnsafe(`CREATE SCHEMA public`);
  await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO public`);
}

try {
  await clearLegacyData();
} finally {
  await prisma.$disconnect();
}

console.log("Pushing mentorship schema...");
execSync(`node "${prismaCli}" db push --accept-data-loss`, {
  stdio: "inherit",
  cwd: root,
  env: process.env,
});

console.log("Seeding demo accounts...");
execSync(`node "${tsx}" prisma/seed.ts`, { stdio: "inherit", cwd: root, env: process.env });

console.log("\nDone! Demo logins:");
console.log("  superadmin@trusthire.com / Password123!");
console.log("  mentor@trusthire.com / Password123!");
console.log("  mentee@trusthire.com / Password123!");
