import math
from geopy.distance import geodesic
from rapidfuzz import fuzz
from config import WEIGHTS
from models import Item, ItemCondition

CONDITION_RANKS = {
    ItemCondition.NEW: 5,
    ItemCondition.LIKE_NEW: 4,
    ItemCondition.GOOD: 3,
    ItemCondition.FAIR: 2,
    ItemCondition.POOR: 1,
    ItemCondition.DAMAGED: 0,
}

def has_valid_coordinates(location) -> bool:
    return (
        location is not None
        and location.latitude is not None
        and location.longitude is not None
        and math.isfinite(location.latitude)
        and math.isfinite(location.longitude)
        and -90 <= location.latitude <= 90
        and -180 <= location.longitude <= 180
    )


def calculate_match_score(lost: Item, found: Item) -> tuple[float, dict]:
    scores = {}

    # 1. Primary/Secondary Color Match
    if lost.primaryColor == found.primaryColor:
        scores["color"] = 1.0
    elif (
        (lost.secondaryColor and lost.secondaryColor == found.primaryColor) or
        (found.secondaryColor and lost.primaryColor == found.secondaryColor)
    ):
        scores["color"] = 0.7
    else:
        scores["color"] = 0.0

    # 2. Title Fuzzy Match
    scores["title"] = fuzz.token_set_ratio(lost.title, found.title) / 100.0

    lost_desc = (lost.description or "").strip()
    found_desc = (found.description or "").strip()

    # 3. Description Similarity
    if lost_desc and found_desc:
        scores["description"] = fuzz.token_set_ratio(lost_desc, found_desc) / 100.0
    elif not lost_desc and not found_desc:
        # Both missing descriptions: neutral score
        scores["description"] = 0.5
    else:
        # Only one item has a description: minor penalty
        scores["description"] = 0.2

    # 4. Geodesic Distance Score (0.8 km exponential decay scale)
    lost_loc, found_loc = lost.location, found.location
    if has_valid_coordinates(lost_loc) and has_valid_coordinates(found_loc):
        dist_km = geodesic(
            (lost_loc.latitude, lost_loc.longitude),
            (found_loc.latitude, found_loc.longitude)
        ).km
        scores["distance"] = max(0.0, math.exp(-dist_km / 0.8))
    else:
        scores["distance"] = 0.5  # Neutral default when location coordinates are missing

    # 5. Incident Date Proximity Score (7-day exponential decay)
    days_diff = abs((lost.incidentDate - found.incidentDate).total_seconds()) / 86400
    scores["date_proximity"] = max(0.0, math.exp(-days_diff / 7.0))

    # 6. Condition Scale Distance Score (This is just for UNKNOWN)
    if lost.condition == ItemCondition.UNKNOWN or found.condition == ItemCondition.UNKNOWN:
        scores["condition"] = 0.5  # Missing condition is neutral, not a known match.
    else:
        lost_cond = CONDITION_RANKS[lost.condition]
        found_cond = CONDITION_RANKS[found.condition]
        cond_diff = abs(lost_cond - found_cond)
        scores["condition"] = max(0.0, 1.0 - (cond_diff / 5.0))

    # Weighted Sum Aggregation
    total_score = sum(scores[attr] * WEIGHTS[attr] for attr in WEIGHTS)
    
    score_details = {
        "scores": {k: round(v, 4) for k, v in scores.items()},
        "weights": WEIGHTS,
    }

    return round(total_score, 4), score_details