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

# Scoring Weights (Must sum to 1.0)
WEIGHTS = {
    "color": 0.15,
    "title": 0.25,
    "description": 0.20,
    "distance": 0.25,
    "date_proximity": 0.10,
    "condition": 0.05,
}

# Candidate Pre-filtering Rules
MAX_INCIDENT_DAYS_DIFF = 30  # Ignore pairs more than 30 days apart
SCORE_THRESHOLD = 0.40       # Minimum overall score to persist an ItemMatch