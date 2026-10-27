# TAMUfindr

TAMUfindr is a centralized lost-and-found web application for Texas A&M University. It allows users to report lost and found items and provides campus lost-and-found staff with a shared system for managing those reports.

77.113.130.242

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
```

Configure the .env

```bash
cp .env.example .env
```

Generate a random db password and auth secret with `openssl rand -hex 32`

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

### Local authentication and roles

Sign in at `/login` using Google OAuth, including during local development. Configure
`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env` before signing in.
Application permissions come from the authenticated user's database role (`USER` or `ADMIN`).

### Future TAMU SAML handoff

SAML is not enabled yet. Reserve the Better Auth provider ID `tamu`. With the default
`/api/auth` base path, the future Entra ID Reply URL (ACS URL) will be:

```text
https://<deployment-host>/api/auth/sso/saml2/sp/acs/tamu
```

Replace `<deployment-host>` with the agreed deployment hostname before sending this
URL to TAMU IT. The local equivalent is
`http://localhost:3000/api/auth/sso/saml2/sp/acs/tamu`.
These URLs follow the [Better Auth SSO endpoint convention](https://better-auth.com/docs/plugins/sso);
they will accept SAML responses only after the server SSO plugin and TAMU provider are configured.
Entra ID will identify users; application permissions currently come from the database's
`USER` and `ADMIN` roles. Entra role mapping is deferred.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow and [docs/database.md](docs/database.md) for database development instructions.

## Contributors

Daniel Bruni, Hallie Pailes, Kevinn Tran, Jacob Kelly, and Giovan Ramirez-Rodarte
