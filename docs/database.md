# Database Development

TAMUfindr uses PostgreSQL with Prisma.

During development:

- PostgreSQL runs in Docker.
- The Next.js application runs locally.
- Prisma commands run locally and connect to the Docker PostgreSQL database through `DATABASE_URL`.

## Initial Setup

Start the PostgreSQL container:

```bash
pnpm docker:db
```

Then prepare the database:

```bash
pnpm db:migrate
pnpm db:generate
pnpm db:seed
```

Start the application normally:

```bash
pnpm dev
```

## Database Development Workflow

Most database development happens by editing:

```text
prisma/schema.prisma
```

### Changing the Prisma Schema

When you change the database structure:

1. Edit `prisma/schema.prisma`.
2. Format the schema.
3. Validate the schema.
4. Create and apply a migration.
5. Generate the updated Prisma client.
6. Commit both the schema and generated migration files.

```bash
pnpm db:format
pnpm db:validate
pnpm db:migrate -- --name describe_your_change
pnpm db:generate
```

For example:

```bash
pnpm db:migrate -- --name add_item_status
```

## Useful Commands

| Command | Purpose |
| --- | --- |
| `pnpm db:format` | Format `prisma/schema.prisma` |
| `pnpm db:validate` | Validate the Prisma schema |
| `pnpm db:generate` | Generate the Prisma client |
| `pnpm db:migrate` | Create/apply development migrations |
| `pnpm db:seed` | Seed development data |
| `pnpm prisma migrate status` | Check migration status |

## Pulling Database Changes

If another developer changes the database schema and commits a migration, after pulling their changes run:

```bash
pnpm db:migrate
pnpm db:generate
```

If their changes also modify required seed data, run:

```bash
pnpm db:seed
```

## Typical Workflows

### Starting Development

If the database container is not already running:

```bash
pnpm docker:db
```

Then start Next.js:

```bash
pnpm dev
```

### After Changing `schema.prisma`

```bash
pnpm db:format
pnpm db:validate
pnpm db:migrate -- --name describe_your_change
pnpm db:generate
```

### After Pulling Database Changes

```bash
pnpm db:migrate
pnpm db:generate
```

### After Changing Seed Data

```bash
pnpm db:seed
```
