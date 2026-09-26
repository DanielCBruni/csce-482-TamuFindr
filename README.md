# TAMUfindr

## Contributors:

Daniel Bruni, Hallie Pailes, Kevinn Tran, Jacob Kelly, and Giovan Ramirez-Rodarte

## Local Development

### Prerequisites

Install the following before starting:

* Node.js
* pnpm
* PostgreSQL

### Setup

Clone the repository and install the dependencies:

```bash
git clone https://github.com/DanielCBruni/csce-482-TamuFindr.git
cd csce-482-TamuFindr
pnpm install
```

Create your local environment file

```bash
cp .env.example .env
```

Configure `DATABASE_URL` in `.env` for your local PostgreSQL instance.

## Branch architecture:

      main     : Live branch, contains deployed code
       /\
     testing   : Integration branch, finished features get pushed here for testing/connecting, pushed up when all code is functional and clean
       /\
       wip     : Initial development branch, all individual features created here and pushed upward

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

| Command                     | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `npm run db:format`         | Format `prisma/schema.prisma`                       |
| `npm run db:validate`       | Validate the Prisma schema                          |
| `npm run db:generate`       | Generate the typed client in `src/generated/prisma` |
| `npx prisma migrate status` | Check whether local migrations are applied          |
| `npm run db:seed`           | Seed reference categories and locations             |
| `npm run db:migrate`        | Create/apply a development migration                |

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
