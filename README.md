# CSCE 482 - Tamu Lost And Found Project

# Contributors:

Daniel Bruni, Hallie Pailes, Kevinn Tran, Jacob Kelly, and Giovan Ramirez-Rodarte

# Branch architecture:

      main     : Live branch, contains deployed code
       /\
     testing   : Integration branch, finished features get pushed here for testing/connecting, pushed up when all code is functional and clean
       /\
       wip     : Initial development branch, all individual features created here and pushed upward

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prisma and PostgreSQL

TAMU Findr uses Prisma 7 with PostgreSQL. Run all commands in this section from the repository root:

```bash
cd csce-482-TamuFindr
```

### Prerequisites

Install PostgreSQL and make sure the server is running. On macOS with Homebrew:

```bash
brew install postgresql@16
brew services start postgresql@16
```

Create the local database once:

```bash
createdb tamufindr
```

### Environment setup

Copy the environment template:

```bash
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to match your PostgreSQL user and database. A common local configuration is:

```env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/tamufindr?schema=public"
```

Do not commit `.env`. It may contain database credentials. The committed `.env.example` is only a configuration template.

### First-time setup

Install dependencies, apply the existing migration, generate the typed Prisma Client, and add the reference categories and locations:

```bash
npm install
npm run db:migrate
npm run db:generate
npm run db:seed
```

The seed is safe to run more than once. It uses `upsert` and will not duplicate the initial categories or campus locations.

### Useful commands

| Command | Purpose |
| --- | --- |
| `npm run db:format` | Format `prisma/schema.prisma` |
| `npm run db:validate` | Validate the Prisma schema |
| `npm run db:generate` | Generate the typed client in `src/generated/prisma` |
| `npx prisma migrate status` | Check whether local migrations are applied |
| `npm run db:seed` | Seed reference categories and locations |
| `npm run db:migrate` | Create/apply a development migration |

### Changing the schema

After editing `prisma/schema.prisma`, format and validate it, then create a named migration:

```bash
npm run db:format
npm run db:validate
npm run db:migrate -- --name describe_your_change
npm run db:generate
```

Commit the schema and the new directory under `prisma/migrations/`. Do not commit `src/generated/prisma`; it is generated from the schema.

### Troubleshooting

- `Could not read package.json`: change into `csce-482-TamuFindr` before running npm commands.
- `Can't reach database server at localhost:5432`: start PostgreSQL and retry.
- `Database does not exist`: create it with `createdb tamufindr`.
- `User was denied access`: check the username, password, host, port, and database name in `DATABASE_URL`.
- Seed connects to a database named after your Mac username: make sure `prisma/seed.ts` imports `dotenv/config` and that `.env` contains the expected `DATABASE_URL`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
