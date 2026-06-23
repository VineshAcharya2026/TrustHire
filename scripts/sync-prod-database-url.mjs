import { readFileSync, existsSync, writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";

function readEnv(file, key) {
  if (!existsSync(file)) return "";
  const m = readFileSync(file, "utf8").match(new RegExp(`^${key}=(.*)$`, "m"));
  return m?.[1]?.replace(/^["']|["']$/g, "") ?? "";
}

const devUrl = readEnv(".env.development.local", "DATABASE_URL");
if (!devUrl.startsWith("postgresql")) {
  console.error("Development DATABASE_URL not found.");
  process.exit(1);
}

const prodUrl = readEnv(".env.production.local", "DATABASE_URL");
if (prodUrl.startsWith("postgresql")) {
  console.log("Production DATABASE_URL already set.");
  process.exit(0);
}

console.log("Setting production DATABASE_URL on Vercel from development Neon database...");
const tmp = "scripts/.db-url.tmp";
writeFileSync(tmp, devUrl);
try {
  execSync(`npx vercel env add DATABASE_URL production --force`, {
    input: devUrl,
    stdio: ["pipe", "inherit", "inherit"],
  });
} catch {
  // fallback: pipe via shell
  execSync(`type "${tmp}" | npx vercel env add DATABASE_URL production --force`, {
    stdio: "inherit",
    shell: true,
  });
} finally {
  try {
    unlinkSync(tmp);
  } catch {}
}

console.log("Done. Redeploy or wait for next deploy for production to pick up the variable.");
