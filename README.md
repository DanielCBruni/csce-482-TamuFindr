# TAMUfindr

## Local Development

**Prerequisites**

Clone the repository and create your local environment file:

```bash
git clone https://github.com/DanielCBruni/csce-482-TamuFindr.git
cd csce-482-TamuFindr
cp .env.example .env
```

### Docker (recommended)

Install:

* Docker Desktop
* pnpm

Start the development environment:

```bash
pnpm docker:dev
```

Setup the database:

```bash
pnpm docker:db:migrate
pnpm docker:db:generate
pnpm docker:db:seed
```

Open:

```
http://localhost:3000
```

### Manual Setup

Install:

* Node.js
* pnpm
* PostgreSQL

Insall dependencies:

```bash
pnpm install
```

Create a local PostgreSQL database named `tamufindr` and configure DATABASE_URL in .env.

Example:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/tamufindr?schema=public"
```

Setup the database:

```bash
pnpm db:migrate
pnpm db:generate
pnpm db:seed
```

Start the application:

```bash
pnpm dev
```

Open:

```
http://localhost:3000
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

## Contributors:

Daniel Bruni, Hallie Pailes, Kevinn Tran, Jacob Kelly, and Giovan Ramirez-Rodarte
