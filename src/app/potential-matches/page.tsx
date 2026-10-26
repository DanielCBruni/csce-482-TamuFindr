import { prisma } from '@/lib/prisma';
import { requireCurrentUserId } from '@/lib/auth/current-user';
import PotentialMatchesClientView from './potential-matches-client-view';

export const dynamic = 'force-dynamic';

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Chicago',
  });

export default async function PotentialMatchesPage() {
  const userId = await requireCurrentUserId();
  const reports = await prisma.item.findMany({
    where: { userId, type: 'LOST', status: 'OPEN' },
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
