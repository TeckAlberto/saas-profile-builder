# Server

## Database and Drizzle workflow
- `server/src/db/schema.ts` is the source of truth for tables and types used by the app.
- `server/src/db/index.ts` exports the Drizzle client used at runtime.
- `server/drizzle/` contains generated SQL migrations created from the schema.

## Typical flow
1) Edit `server/src/db/schema.ts`.
2) Generate migrations:
   - `pnpm drizzle-kit generate`
3) Apply migrations:
   - `pnpm drizzle-kit migrate`
4) Reset local database (destructive):
   - `pnpm db:reset`

## Environment
Set `DATABASE_URL` for both runtime and Drizzle Kit, for example:
`postgres://profile_builder:password@localhost:5433/saas_profile_builder_dev`

## Troubleshooting
- `Cannot find name 'process'`: ensure `@types/node` is installed and Drizzle config is using Node types.
- Migrations out of sync: reset your local database and re-run `pnpm drizzle:migrate`.
- `ECONNREFUSED` or connection errors: verify Postgres is running and `DATABASE_URL` host/port match `docker-compose.yml`.
