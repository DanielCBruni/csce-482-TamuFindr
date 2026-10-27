# TAMUfindr

TAMUfindr is a centralized lost-and-found web application for Texas A&M University. It allows users to report lost and found items and provides campus lost-and-found staff with a shared system for managing those reports.

## Local Development

TAMUfindr runs PostgreSQL in Docker and the Next.js application locally.

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Ensure Docker Desktop is running before starting the database.

### Setup

#### 1. Clone the Repository

```sh
git clone https://github.com/DanielCBruni/csce-482-TamuFindr.git
cd csce-482-TamuFindr

pnpm install
```

#### 2. Configure Environment Variables

Copy the example environment file:

```sh
cp .env.example .env
```

Update `.env` with the following:

| Variable               | Configuration                                                |
| ---------------------- | ------------------------------------------------------------ |
| `POSTGRES_PASSWORD`    | Generate a random password.                                  |
| `DATABASE_URL`         | Replace the password with the generated `POSTGRES_PASSWORD`. |
| `BETTER_AUTH_SECRET`   | Generate a separate random secret.                           |
| `BETTER_AUTH_URL`      | Set to `http://localhost:3000`.                              |
| `GOOGLE_CLIENT_ID`     | Provided.                                                    |
| `GOOGLE_CLIENT_SECRET` | Provided.                                                    |

Generate each secret using:

```sh
openssl rand -hex 32
```

or

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

#### 3. Start the Database

Start PostgreSQL in Docker:

```sh
pnpm docker:db
```

Apply database migrations, generate the Prisma client, and seed the database:

```sh
pnpm db:migrate
pnpm db:generate
pnpm db:seed
```

#### 4. Start the Application

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

The database runs in Docker while the Next.js application runs locally.

#### 5. Grant Local Admin Access

New accounts receive the `USER` role by default. To enable admin features locally:

1. Sign in with Google at least once to create your user record.
2. Open Prisma Studio:

   ```sh
   pnpm exec prisma studio
   ```

3. Open the `user` table and locate your account by email.
4. Change the `role` field from `USER` to `ADMIN`.
5. Save the change and refresh the application. Sign in again if necessary.

## Development Resources

- [CONTRIBUTING.md](CONTRIBUTING.md) — Contribution workflow
- [docs/database.md](docs/database.md) — Database development instructions

## Contributors

Daniel Bruni, Hallie Pailes, Kevinn Tran, Jacob Kelly, and Giovan Ramirez-Rodarte
