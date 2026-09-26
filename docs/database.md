# Database Development

TAMUfindr uses PostgreSQL with Prisma.

## Initial Setup

The database must be migrated, the Prisma client generated, and reference data seeded before development.

### Docker

```bash
pnpm docker:db:migrate
pnpm docker:db:generate
pnpm docker:db:seed
```

### Manual

```bash
pnpm db:migrate
pnpm db:generate
pnpm db:seed
```

## Changing the Database Schema

When changing the database structure:

1. Edit `prisma/schema.prisma`.
2. Format and validate the schema.
3. Create a migration.
4. Generate the updated Prisma client.
5. Commit the schema and migration.

### Manual Development

```bash
pnpm db:format
pnpm db:validate
pnpm db:migrate -- --name describe_your_change
pnpm db:generate
```

Example:

```bash
pnpm db:migrate -- --name add_item_status
```

### Docker Development

Use the equivalent Docker database commands:

```bash
pnpm docker:db:migrate
pnpm docker:db:generate
```

When creating a migration, provide a descriptive migration name if supported by the project script.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `pnpm db:format` | Format `prisma/schema.prisma` |
| `pnpm db:validate` | Validate the Prisma schema |
| `pnpm db:generate` | Generate the Prisma client |
| `pnpm db:migrate` | Create/apply development migrations |
| `pnpm db:seed` | Seed development data |
| `pnpm prisma migrate status` | Check migration status |

## Troubleshooting

### Cannot reach PostgreSQL

```text
Can't reach database server at localhost:5432
```

Make sure PostgreSQL is running and verify the host and port in `DATABASE_URL`.

### Database does not exist

Create the database:

```bash
createdb tamufindr
```

### Database user does not have access

Check the username, password, host, port, and database name in `DATABASE_URL`.

Prisma uses the database credentials specified by `DATABASE_URL`, not your operating system username.

### Prisma Migrate cannot create the shadow database

`prisma migrate dev` uses a temporary shadow database to determine schema changes.

The PostgreSQL user specified in `DATABASE_URL` must have permission to create databases, or the project must be configured with a separate shadow database.

### Seed connects using the wrong database

Make sure the seed script loads environment variables and `.env` contains the expected `DATABASE_URL`.
