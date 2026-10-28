export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth/guard';
import ReportClientView from './report-client-view';
import { PrimaryColor, ItemCondition } from '@/generated/prisma/enums';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Report | TAMUfindr',
  description: 'Submit details about a lost item so TAMUfindr can match it with found items across Texas A&M.',
};

export default async function ReportPage() {
  await requireUser();
  const [categories, locations] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.location.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const colors = Object.values(PrimaryColor);
  const conditions = Object.values(ItemCondition);

  return (
    <ReportClientView
      categories={categories}
      locations={locations}
      colors={colors}
      conditions={conditions}
    />
  );
}
