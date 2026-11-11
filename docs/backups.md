# Database backups — how they work, how to restore

**What is backed up:** the production Neon database (CRM clients, interactions,
invoices, invoice items, pageviews). Every backup is a `pg_dump` in PostgreSQL
custom format, **encrypted with age** before it leaves the dump machine.

## Where backups live

1. **Google Drive → "AceVolumes Backups"** — the folder in the brand Gmail
   account. At least one encrypted dump is already there; add new ones by
   dropping `*.dump.age` files in.
2. **GitHub Actions artifacts** (automatic): the repo runs
   `.github/workflows/weekly-backup.yml` every Sunday 03:00 UTC (and on
   demand: repo → Actions → "Weekly database backup" → Run workflow).
   Each run produces artifact `db-backup-<id>` holding the encrypted dump,
   kept for 90 days.

> The GitHub run needs one secret: repo → Settings → Secrets and variables →
> Actions → New repository secret → Name `DATABASE_URL`, value = the Neon
> connection string (same one Vercel uses). One-time, 30 seconds.

## The encryption key (KEEP THIS SAFE)

Backups are encrypted to the age public key
`age1t08klhmx6atx747jgucyth5kr7d8xu4mv5u86dfwrxjkrj3rv39q2dzfkr`.

The **private key** was generated once and given to David (file
`acevolumes-backup-PRIVATE-key.txt`). Without it, **nobody — including any AI
assistant or cloud provider — can read these backups.** Store the private key
file somewhere offline (password manager, USB). If it is lost, the backups are
unreadable; rotate by generating a new keypair and updating the workflow's
`AGE_RECIPIENT`.

## Restoring (the whole point)

You need: the `*.dump.age` file, the private key file, and `age` +
`postgresql-client-18` installed (macOS: `brew install age postgresql@18`).

```bash
# 1. Decrypt
age -d -i acevolumes-backup-PRIVATE-key.txt -o restore.dump acevolumes-prod-YYYY-MM-DD.dump.age

# 2. Inspect contents (optional)
pg_restore --list restore.dump

# 3. Restore into a fresh database (target must be empty or you accept merges)
pg_restore --clean --if-exists --no-owner --dbname "<TARGET_CONNECTION_STRING>" restore.dump
```

Point `<TARGET_CONNECTION_STRING>` at a fresh Neon database (Neon console →
New project, or restore over the live one only if you know that is what you
want — `--clean` drops existing tables first).

## Test schedule

A backup is only real after a restore has proven it. Quarterly: download the
latest `*.dump.age`, run steps 1–2 above against a scratch Neon project, and
confirm the clients table row count matches the live CRM.
