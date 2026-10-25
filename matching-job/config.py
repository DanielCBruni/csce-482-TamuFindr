import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL"
)

if DATABASE_URL is None:
    print("DATABASE_URL environment variable is not set. Exiting...")
    exit(1)

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