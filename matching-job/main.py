import logging
import sys
import uuid
from datetime import datetime, timedelta, timezone
from time import monotonic

from sqlalchemy import create_engine, or_, select, text, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session, joinedload

from config import DATABASE_URL, MAX_INCIDENT_DAYS_DIFF, SCORE_THRESHOLD
from models import Item, ItemType, ItemStatus, ItemMatch, MatchStatus
from scoring import calculate_match_score

logger = logging.getLogger(__name__)
# A fixed, application-specific transaction lock also covers manual invocations.
MATCHING_LOCK_KEY = 0x54414D5546494E44


def run_matching_batch(batch_engine=None):
    if batch_engine is None:
        database_url = make_url(DATABASE_URL).set(drivername="postgresql+psycopg")
        database_url = database_url.difference_update_query(["schema"])
        batch_engine = create_engine(database_url, echo=False, hide_parameters=True)

    started = monotonic()
    upserted = 0
    expired = 0
    candidates_scored = 0
    # Prisma uses timestamp without time zone, with UTC values.
    now = datetime.now(timezone.utc).replace(tzinfo=None)

    # Commit everything together, or roll back on failure. The lock is released
    # automatically when this transaction ends, including on process termination.
    with Session(batch_engine) as session, session.begin():
        acquired = session.scalar(
            text("SELECT pg_try_advisory_xact_lock(:key)"),
            {"key": MATCHING_LOCK_KEY},
        )
        if not acquired:
            logger.info("Matching skipped: another batch is already running.")
            return

        lost_items = session.scalars(
            select(Item)
            .options(joinedload(Item.location))
            .where(Item.type == ItemType.LOST, Item.status == ItemStatus.OPEN)
        ).all()
        logger.info("Loaded %d OPEN lost items for processing.", len(lost_items))

        # Expire suggestions for reports that are no longer eligible, even when
        # there are no open lost reports. Keep staff decisions intact.
        open_lost_ids = select(Item.id).where(
            Item.type == ItemType.LOST, Item.status == ItemStatus.OPEN
        )
        open_found_ids = select(Item.id).where(
            Item.type == ItemType.FOUND, Item.status == ItemStatus.OPEN
        )
        result = session.execute(
            update(ItemMatch)
            .where(
                ItemMatch.status == MatchStatus.PENDING,
                or_(
                    ItemMatch.lostItemId.not_in(open_lost_ids),
                    ItemMatch.potentialMatchId.not_in(open_found_ids),
                ),
            )
            .values(status=MatchStatus.EXPIRED, updatedAt=now)
            .execution_options(synchronize_session=False)
        )
        expired += result.rowcount

        for lost in lost_items:
            min_date = lost.incidentDate - timedelta(days=MAX_INCIDENT_DAYS_DIFF)
            max_date = lost.incidentDate + timedelta(days=MAX_INCIDENT_DAYS_DIFF)
            candidates = session.scalars(
                select(Item)
                .options(joinedload(Item.location))
                .where(
                    Item.type == ItemType.FOUND,
                    Item.status == ItemStatus.OPEN,
                    Item.categoryId == lost.categoryId,
                    Item.incidentDate.between(min_date, max_date),
                )
            ).all()

            matches_to_upsert = []
            qualifying_ids = []
            candidates_scored += len(candidates)
            for found in candidates:
                final_score, details = calculate_match_score(lost, found)
                if final_score >= SCORE_THRESHOLD:
                    qualifying_ids.append(found.id)
                    matches_to_upsert.append({
                        "id": f"cuid_{uuid.uuid4().hex[:20]}",
                        "lostItemId": lost.id,
                        "potentialMatchId": found.id,
                        "score": final_score,
                        "scoreDetails": details,
                        "status": MatchStatus.PENDING,
                        "createdAt": now,
                        "updatedAt": now,
                    })

            # This covers score drops and changes to category/date filters.
            result = session.execute(
                update(ItemMatch)
                .where(
                    ItemMatch.lostItemId == lost.id,
                    ItemMatch.status == MatchStatus.PENDING,
                    ItemMatch.potentialMatchId.not_in(qualifying_ids),
                )
                .values(status=MatchStatus.EXPIRED, updatedAt=now)
                .execution_options(synchronize_session=False)
            )
            expired += result.rowcount

            if matches_to_upsert:
                stmt = insert(ItemMatch).values(matches_to_upsert)
                upsert_stmt = stmt.on_conflict_do_update(
                    index_elements=["lostItemId", "potentialMatchId"],
                    set_={
                        "score": stmt.excluded.score,
                        "scoreDetails": stmt.excluded.scoreDetails,
                        "status": stmt.excluded.status,
                        "updatedAt": stmt.excluded.updatedAt,
                    },
                    # Revive expired suggestions when they qualify again;
                    # never overwrite confirmed or rejected staff decisions.
                    where=ItemMatch.status.in_([
                        MatchStatus.PENDING, MatchStatus.EXPIRED,
                    ]),
                ).returning(ItemMatch.id)
                upserted += len(session.scalars(upsert_stmt).all())

    logger.info(
        "Matching completed: lost=%d candidates=%d upserted=%d expired=%d elapsed=%.2fs",
        len(lost_items), candidates_scored, upserted, expired, monotonic() - started,
    )


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        stream=sys.stdout,
    )
    try:
        run_matching_batch()
    except Exception:
        logger.exception("Matching failed; database changes rolled back.")
        sys.exit(1)
