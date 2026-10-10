# AGENTS.md

## Project

TAMUfindr is a lost-and-found web application for Texas A&M built with Next.js.

## Stack

- Next.js App Router
- TypeScript
- Prisma
- PostgreSQL
- pnpm

## Development Guidelines

- Prefer Server Components unless client-side interactivity is required.
- Use Server Actions for application mutations.
- Access Prisma only from server-side code.
- Determine the current user on the server; never trust a user ID supplied by the client.
- Reuse existing types, components, and utilities before creating new ones.
- Keep changes focused and avoid unrelated refactors.

## Validation

Before considering work complete, run:

```bash
pnpm check
```

For database changes, also run:

```bash
pnpm db:format
pnpm db:validate
pnpm db:generate
```

## Database

PostgreSQL runs locally through Docker.

Do not create or modify Prisma migrations unless the task requires a schema change.
