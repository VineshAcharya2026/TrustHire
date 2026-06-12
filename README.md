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
