import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { AuthorizationError, requireAdmin } from '@/lib/auth/guard';
import PotentialMatchesClientView from './potential-matches-client-view';

export const metadata: Metadata = {
  title: 'Potential Matches | TAMUfindr',
  description:
    'Review algorithm-generated matches between lost and found item reports on TAMUfindr.',
};

export const dynamic = 'force-dynamic';

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Chicago',
  });

export default async function PotentialMatchesPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (!(error instanceof AuthorizationError)) throw error;
    return (
      <section className="mx-auto mt-16 max-w-6xl px-6 text-primary-dark">
        <h1 className="text-3xl font-bold text-primary">Access denied</h1>
        <p className="mt-3">Administrator access is required to view this page.</p>
      </section>
    );
  }

  const reports = await prisma.item.findMany({
    where: { type: 'LOST', status: 'OPEN' },
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    select: {
      id: true,
      title: true,
      createdAt: true,
      lostMatches: {
        // Keep aligned with SCORE_THRESHOLD in matching-job/config.py.
        where: {
          status: 'PENDING',
          score: { gte: 0.4 },
          potentialMatch: { type: 'FOUND', status: 'OPEN' },
        },
        orderBy: [{ score: 'desc' }, { potentialMatchId: 'asc' }],
        take: 5,
        select: {
          id: true,
          score: true,
          potentialMatch: {
            select: {
              id: true,
              title: true,
              description: true,
              incidentDate: true,
              createdAt: true,
              locationExtra: true,
              location: { select: { name: true } },
              category: { select: { name: true } },
            },
          },
        },
      },
    },
  });
  return (
    <PotentialMatchesClientView
      reports={reports.map((report) => ({
        id: report.id,
        title: report.title,
        reportedDate: formatDate(report.createdAt),
        matches: report.lostMatches.map((match) => ({
          id: match.id,
          score: match.score,
          incidentDate: formatDate(match.potentialMatch.incidentDate),
          item: {
            itemId: match.potentialMatch.id,
            title: match.potentialMatch.title,
            description: match.potentialMatch.description,
            category: 'Found item',
            status: 'open' as const,
            statusLabel: 'Open',
            reportedDate: `Reported ${formatDate(match.potentialMatch.createdAt)}`,
            location: [match.potentialMatch.location.name, match.potentialMatch.locationExtra]
              .filter(Boolean)
              .join(' · '),
            itemType: match.potentialMatch.category.name,
          },
        })),
      }))}
    />
  );
}
