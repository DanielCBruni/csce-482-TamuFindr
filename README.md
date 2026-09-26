# TAMUfindr

## Local Development

TAMUfindr runs the PostgreSQL database in Docker while the Next.js application runs locally.

### Prerequisites

Install:

- [pnpm](https://pnpm.io/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/DanielCBruni/csce-482-TamuFindr.git
cd csce-482-TamuFindr

pnpm install
cp .env.example .env
```

Start the PostgreSQL database:

```bash
pnpm docker:db
```

Set up the database and Prisma client:

```bash
pnpm db:migrate
pnpm db:generate
pnpm db:seed
```

Start the Next.js development server:

```bash
pnpm dev
```

The database will continue running in Docker while the Next.js application runs locally.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow and [docs/database.md](docs/database.md) for database development instructions.

## Contributors

Daniel Bruni, Hallie Pailes, Kevinn Tran, Jacob Kelly, and Giovan Ramirez-Rodarte
