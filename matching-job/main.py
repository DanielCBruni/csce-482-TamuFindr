import uuid
from datetime import timedelta, timezone, datetime
from sqlalchemy import create_engine, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session, joinedload

from config import DATABASE_URL, MAX_INCIDENT_DAYS_DIFF, SCORE_THRESHOLD
from models import Item, ItemType, ItemStatus, ItemMatch, MatchStatus
from scoring import calculate_match_score

now = datetime.now()

database_url = make_url(DATABASE_URL)
database_url = database_url.set(drivername="postgresql+psycopg")
database_url = database_url.difference_update_query(["schema"])

engine = create_engine(database_url, echo=False)

def run_matching_batch():
    with Session(engine) as session:
        # Step 1: Fetch all OPEN LOST items
        lost_items = session.scalars(
            select(Item)
            .options(joinedload(Item.location))
            .where(Item.type == ItemType.LOST, Item.status == ItemStatus.OPEN)
        ).all()

        print(f"Loaded {len(lost_items)} OPEN lost items for processing.")

        for lost in lost_items:
            min_date = lost.incidentDate - timedelta(days=MAX_INCIDENT_DAYS_DIFF)
            max_date = lost.incidentDate + timedelta(days=MAX_INCIDENT_DAYS_DIFF)

            # Step 2: Hard-filter potential FOUND candidates via SQL
            candidates = session.scalars(
                select(Item)
                .options(joinedload(Item.location))
                .where(
                    Item.type == ItemType.FOUND,
                    Item.status == ItemStatus.OPEN,
                    Item.categoryId == lost.categoryId,  # Must match category
                    Item.incidentDate.between(min_date, max_date)
                )
            ).all()

            matches_to_upsert = []

            # Step 3: Compute detailed score per candidate
            for found in candidates:
                final_score, details = calculate_match_score(lost, found)

                if final_score >= SCORE_THRESHOLD:
                    matches_to_upsert.append({
                        "id": f"cuid_{uuid.uuid4().hex[:20]}",
                        "lostItemId": lost.id,
                        "potentialMatchId": found.id,
                        "score": final_score,
                        "scoreDetails": details,
                        "status": MatchStatus.PENDING.value,
                        "createdAt" : now,
                        "updatedAt" : now
                    })

            # Step 4: PostgreSQL Upsert (ON CONFLICT DO UPDATE)
            if matches_to_upsert:
                stmt = insert(ItemMatch).values(matches_to_upsert)
                upsert_stmt = stmt.on_conflict_do_update(
                    index_elements=["lostItemId", "potentialMatchId"],
                    set_={
                        "score": stmt.excluded.score,
                        "scoreDetails": stmt.excluded.scoreDetails,
                        "updatedAt": stmt.excluded.updatedAt,
                    }
                )
                session.execute(upsert_stmt)

        session.commit()
        print(f"Matching batch completed successfully. Items inserted {matches_to_upsert.__len__()}")

if __name__ == "__main__":
    run_matching_batch()