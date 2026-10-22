export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import ReportClientView from './report-client-view';
import { PrimaryColor, ItemCondition } from '@/generated/prisma/enums';

export default async function ReportPage() {
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
