# Phase 1 deploy — put the site + hidden studio online (Vercel)

Time needed: ~10 minutes. You need: this repo on GitHub (done —
github.com/BlakkAce/acevolumes) and a browser.

## 1. Create the Vercel account

- Go to vercel.com → **Sign Up** → **Continue with GitHub** → authorise.
- On the dashboard: **Add New… → Project** → find **acevolumes** → **Import**.
- Framework preset auto-detects **Next.js**. Don't change build settings.

## 2. Add the three secret env vars (before clicking Deploy)

On the same page, open **Environment Variables** and add exactly these
three (values also live in the project's `.env.local` on this machine —
store the passphrase in your password manager):

| Name | Value |
| --- | --- |
| `STUDIO_PATH` | `pine-onyx-36` |
| `STUDIO_PASSPHRASE` | `cobalt-amend-drift-cedar-91` |
| `SESSION_SECRET` | _(64-hex string in `.env.local` — copy it exactly)_ |

Add them for **Production** and **Preview**. Then click **Deploy**.
First build takes ~1 minute.

## 3. Verify (the Phase 1 exit test)

With your deployment URL `https://acevolumes-<x>.vercel.app`:

1. `https://…/` — the public site loads normally.
2. `https://…/pine-onyx-36` — login card ("Private access").
3. Log in with the passphrase → **Dashboard** ("You are in").
4. `https://…/admin` — hard 404 (and so is any wrong slug, including
   typos of the real one).
5. Bookmark `https://…/pine-onyx-36` in a private bookmarks folder.
   Nothing on the public site links to it; it is not in any sitemap.

## 4. Optional now, needed in Phase 2: the database

- Vercel dashboard → **Storage** → **Create Database → Postgres (Neon)**.
- Copy the `DATABASE_URL` it offers and add it as a fourth env var
  (Production + Preview).
- The schema ships with the repo (`src/lib/db/schema.ts`); when we start
  Phase 2 we push it with `npx drizzle-kit push` and the CRM tables exist.

## Security notes

- The passphrase is the only key to your client data — keep it strong and
  private. Logins are rate-limited (5 tries / 10 min) and sessions last 30
  days.
- To change the secret path later: change `STUDIO_PATH` in Vercel env vars
  and redeploy. Same for the passphrase (it logs everyone out).
- The studio sends `noindex` headers and is deliberately absent from
  robots.txt (that file is public — listing the path there would leak it).
