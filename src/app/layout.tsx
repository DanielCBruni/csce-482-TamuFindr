import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/header/header';
import { getCurrentUser } from '@/lib/auth/current-user';
import Footer from '@/components/footer/footer';
import { UserRole } from '@/generated/prisma/enums';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TAMUFindr | Report and Recover Lost Items',
  description:
    'A Texas A&M lost-and-found platform for reporting, searching, and matching lost items.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header signedIn={Boolean(user)} isAdmin={user?.role === UserRole.ADMIN} />
        <div style={{ flex: 1 }}>{children}</div>
        <Footer signedIn={Boolean(user)} />
      </body>
    </html>
  );
}
