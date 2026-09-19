# CSCE 482 - Tamu Lost And Found Project

## Contributors:
Daniel Bruni, Hallie Pailes, Kevinn Tran, Jacob Kelly, and Giovan Ramirez-Rodarte

## Branch architecture:
      main     : Live branch, contains deployed code
       /\
     testing   : Integration branch, finished features get pushed here for testing/connecting, pushed up when all code is functional and clean
       /\
     features  : Initial development branch, all individual features created here and pushed upward

## File Structure

frontend/
├── src/
│   ├── app/                         # App Router: paths directly determine website URLs
│   │   ├── layout.tsx               # Shared layout wrapper (global Navbar, Footer, etc.)
│   │   ├── page.tsx                 # Landing Page → www.tamufindr.com
│   │   ├── globals.css              # Global styling variables
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Login Page → www.tamufindr.com/auth/login
│   │   │   └── register/
│   │   │       └── page.tsx         # Register Page → www.tamufindr.com/auth/register
│   │   │
│   │   ├── admin/
│   │   │   └── page.tsx             # Admin Panel → www.tamufindr.com/admin
│   │   │
│   │   ├── home/
│   │   │   └── page.tsx             # Main Home Feed → www.tamufindr.com/home
│   │   │
│   │   ├── report/
│   │   │   ├── page.tsx             # Main Report Entry → www.tamufindr.com/report
│   │   │   ├── lost/
│   │   │   │   └── page.tsx         # Report Lost Item → www.tamufindr.com/report/lost
│   │   │   └── found/
│   │   │       └── page.tsx         # Report Found Item → www.tamufindr.com/report/found
│   │   │
│   │   ├── activity/
│   │   │   └── page.tsx             # Activity log/history → www.tamufindr.com/activity
│   │   │
│   │   └── help/
│   │       └── page.tsx             # Help & Support Center → www.tamufindr.com/help
│   │
│   └── components/                  # Reusable UI elements (custom buttons, cards, inputs)
│
├── public/                          # Static assets (images, logos, icons, fonts)
│
├── package.json                     # Project scripts and local frontend dependencies
└── tsconfig.json                    # Configuration for TypeScript compiler and strictness


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
