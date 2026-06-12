# TrustHire

Production-ready referral hiring platform built with Next.js 14, PostgreSQL, Prisma, and NextAuth.

## Stack

- **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (credentials, JWT, role-based access)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL` and `NEXTAUTH_SECRET` in `.env`.

4. Generate Prisma client and push schema:

```bash
node node_modules/prisma/build/index.js generate
node node_modules/prisma/build/index.js db push
node node_modules/tsx/dist/cli.mjs prisma/seed.ts
```

> **Windows note:** If your project folder path contains `&`, use the `node ...` commands above instead of `npm run` scripts.

Or on Unix / paths without special characters:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts (after seed)

| Role     | Email                   | Password      |
|----------|-------------------------|---------------|
| Admin    | admin@trusthire.com     | Password123!  |
| Employer | careers@acme.com        | Password123!  |
| Referrer | jane.doe@staffing.com   | Password123!  |

## Optional integrations

Configure in `.env` for full functionality:

- **SendGrid SMTP** — email notifications
- **Twilio** — WhatsApp alerts
- **Cloudinary** — resume uploads (signed URLs)

Without these, notifications log to console in development.

## Deploy to Vercel

Login **requires PostgreSQL** — SQLite does not work on Vercel serverless.

### 1. Create a PostgreSQL database

Use [Neon](https://neon.tech) (free), [Supabase](https://supabase.com), or Vercel Postgres.

**Quick path via Vercel CLI:**

```bash
npx vercel link --project trust-hire
# Accept terms in browser, then:
npx vercel integration add neon
# Connect database in Vercel → Storage tab
npx vercel env pull .env.production.local
npm run db:setup-production
```

Neon terms (one-time): https://vercel.com/vineshjm-3253s-projects/~/integrations/accept-terms/neon

### 2. Set Vercel environment variables

In **Vercel → Project → Settings → Environment Variables** (Production + Preview):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` (no trailing slash) |

### 3. Initialize the production database (one-time)

From your machine, with production `DATABASE_URL` in `.env`:

```bash
npm run db:push
npm run db:seed
```

### 4. Deploy

Push to GitHub — Vercel redeploys automatically. Test login with seeded demo accounts.

If login fails, check **Vercel → Deployments → Functions → Logs** for `[auth] authorize failed` errors.
