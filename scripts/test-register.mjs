import { readFileSync } from "node:fs";

const body = {
  email: `test-${Date.now()}@example.com`,
  password: "Password123!",
  firstName: "Test",
  lastName: "User",
  role: "MENTEE",
  goals: "Learn React",
};

const res = await fetch("https://trust-hire-eight.vercel.app/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log(res.status, text);
