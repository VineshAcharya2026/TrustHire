import { readFileSync, existsSync } from "node:fs";

for (const file of [".env.production.local", ".env.development.local"]) {
  if (!existsSync(file)) {
    console.log(`${file}: missing`);
    continue;
  }
  const m = readFileSync(file, "utf8").match(/^DATABASE_URL=(.*)$/m);
  const v = m?.[1]?.replace(/^["']|["']$/g, "") ?? "";
  console.log(`${file}: ${v.startsWith("postgresql") ? "postgresql set" : v ? "invalid" : "EMPTY"}`);
}
