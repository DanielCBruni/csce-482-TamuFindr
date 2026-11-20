import os
from dotenv import load_dotenv
from sqlalchemy.engine import URL

load_dotenv()

# Compose passes only database settings, rather than the web app's auth secrets.
# URL.create safely handles passwords containing reserved URL characters.
if os.getenv("POSTGRES_HOST"):
    DATABASE_URL = URL.create(
        "postgresql+psycopg",
        username=os.environ["POSTGRES_USER"],
        password=os.environ["POSTGRES_PASSWORD"],
        host=os.environ["POSTGRES_HOST"],
        port=int(os.getenv("POSTGRES_PORT", "5432")),
        database=os.environ["POSTGRES_DB"],
    )
else:
    DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise SystemExit("Set DATABASE_URL, or POSTGRES_HOST with the PostgreSQL credentials.")

# Missing features are excluded and the remaining weights are normalized.
WEIGHTS = {
    "item_kind": 0.28,
    "title": 0.26,
    "description": 0.12,
    "brand": 0.16,
    "color": 0.08,
    "distance": 0.06,
    "date_proximity": 0.03,
    "condition": 0.01,
}

MAX_INCIDENT_DAYS_DIFF = 30

# Persist only relatively high-confidence suggestions.
SCORE_THRESHOLD = 0.68

# Strong enough similarity after removing colors, stop words, and generic terms.
MIN_TITLE_SIMILARITY = 0.60
MIN_DESCRIPTION_SIMILARITY = 0.60

# A known mismatch should lower the result. Missing information should not.
COLOR_CONTRADICTION_PENALTY = 0.18
BRAND_CONTRADICTION_PENALTY = 0.25