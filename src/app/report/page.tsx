import { prisma } from '@/lib/prisma';
import ReportClientView from './report-client-view';

export default async function ReportPage() {
  const [categories, locations] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.location.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return <ReportClientView categories={categories} locations={locations} />;
}