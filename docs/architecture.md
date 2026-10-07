# Architecture

## Overview

TAMUfindr is a full-stack web application built with Next.js.
The application uses React and TypeScript for the user interface,
Next.js Server Components and Server Actions for server-side logic,
Prisma for database access, and PostgreSQL for persistent storage.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Next.js 16 | Full-stack application framework and routing |
| React 19 | User interface |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Prisma 7 | Database access and schema management |
| PostgreSQL | Persistent application data |
| Docker | Local PostgreSQL development environment |
| pnpm | Package management and development scripts |

## System Architecture

```txt
Browser
    |
    v
Next.js Application
    |
    +-- Server Components
    |      |
    |      +-- Prisma Queries
    |
    +-- Client Components
    |      |
    |      +-- Server Actions
    |              |
    |              v
    +----------> Prisma
                   |
                   v
               PostgreSQL
```

Server Components retrieve application data and pass it to interactive
client components as props. Client components handle user interaction,
form state, modals, and feedback. Database mutations are performed on
the server through Server Actions.

## Project Structure

src/
├── app/          Routes and page composition
├── actions/      Server-side mutations
├── components/   Reusable user interface components
├── lib/          Shared server and application utilities
└── generated/    Generated Prisma client

prisma/
├── schema.prisma
├── migrations/
└── seed.ts

## Data Layer

Prisma provides the interface between the Next.js application and
PostgreSQL.

The primary application models include:

- User
- Item
- Category
- Location
- ItemImage

An Item represents either a lost or found report. Each item is
associated with a submitting user, category, and incident location.
Items may also reference a storage location, servicing user, and
associated images.

Item status is represented by:

- OPEN
- MATCHED
- RESOLVED
- CANCELLED

## Item Reporting Flow

The primary reporting workflow follows this path:

1. The `/report` server page retrieves available categories and locations.
2. The data is passed to the report client interface.
3. The user selects whether they are reporting a lost or found item.
4. A shared item form collects the report information.
5. Client-side validation provides immediate feedback.
6. The form invokes a Server Action.
7. The server validates the input and determines the current user.
8. Prisma creates the Item in PostgreSQL.
9. The result is returned to the client and a confirmation is displayed.

## User Identity

Iteration 1 does not yet include production authentication.

The application resolves the current user on the server using a
configured development user ID. Client requests do not provide the
user ID used to create records.

This allows the application to later replace the development-user
implementation with an authentication provider without changing the
general item-reporting workflow.

## Database Development

PostgreSQL runs locally through Docker while the Next.js application
runs directly on the developer machine.

Database schema changes are managed through Prisma migrations.

See [Database Development](database.md) for setup and database
development procedures.
