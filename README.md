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

## Database setup

TAMU Findr uses Prisma with PostgreSQL. Install PostgreSQL locally, create a database named `tamufindr`, and copy the environment template:

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env` if your local PostgreSQL username, password, host, port, or database name differs. Then create the database tables and generate the typed client:

```bash
npm run db:migrate -- --name init
npm run db:generate
npm run db:seed
```

The seed command adds the initial categories and campus locations and can be run repeatedly without creating duplicates. Prisma schema changes should be formatted and checked with `npm run db:format` and `npm run db:validate` before creating a migration.

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
