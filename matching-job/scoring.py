# scoring.py

from __future__ import annotations

import math
import re
from typing import Optional

from geopy.distance import geodesic
from rapidfuzz import fuzz
from config import SCORE_THRESHOLD


from config import (
    WEIGHTS,
    MIN_TITLE_SIMILARITY,
    MIN_DESCRIPTION_SIMILARITY,
    COLOR_CONTRADICTION_PENALTY,
    BRAND_CONTRADICTION_PENALTY,
)
from models import Item, ItemCondition, PrimaryColor


CONDITION_RANKS = {
    ItemCondition.NEW: 5,
    ItemCondition.LIKE_NEW: 4,
    ItemCondition.GOOD: 3,
    ItemCondition.FAIR: 2,
    ItemCondition.POOR: 1,
    ItemCondition.DAMAGED: 0,
}

# These words have little identity value. They should not create a match.
STOPWORDS = {
    "a", "an", "and", "at", "for", "from", "in", "is", "it", "my",
    "of", "on", "the", "to", "with",
    "lost", "found", "missing", "item", "thing", "belonging",
}

# Colors are compared through primaryColor / secondaryColor.
COLOR_WORDS = {
    "black", "white", "silver", "grey", "gray", "red", "blue", "green",
    "yellow", "brown", "purple", "pink", "orange", "beige", "navy",
    "teal", "gold", "bronze",
}

# These can be useful in natural-language descriptions, but should not alone
# establish object identity. Customize this list using real reports.
LOW_INFORMATION_WORDS = {
    "water",
    "personal",
    "small",
    "large",
    "new",
    "old",
    "nice",
    "unknown",
}

# Keep aliases conservative. Do not add broad semantic equivalences unless
# they are truly interchangeable for the category.
TOKEN_ALIASES = {
    "hydroflask": "hydroflask",
    "hydro-flask": "hydroflask",
    "airpod": "airpods",
    "earbud": "earbuds",
}

def qualifies_for_persistence(score: float, score_details: dict) -> bool:
    """
    A candidate may only become an ItemMatch when it passed identity gating
    and its final score exceeds the configured threshold.
    """
    return (
        score_details.get("eligible") is True
        and score >= SCORE_THRESHOLD
    )


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
    
def item_kind_compatible(lost, found) -> tuple[bool, float | None, str | None]:
    """
    exact item kind match is strong positive evidence.

    Parent/child compatibility can be added once the hierarchy is available
    in the Python worker.
    """
    lost_kind = getattr(lost, "itemKindId", None)
    found_kind = getattr(found, "itemKindId", None)

    if not lost_kind or not found_kind:
        return True, None, None

    if lost_kind == found_kind:
        return True, 1.0, None

    return False, 0.0, "incompatible_item_kind"


def normalize_brand(value: Optional[str]) -> Optional[str]:
    if not value:
        return None

    normalized = re.sub(r"[^a-z0-9]+", "", value.lower())
    return normalized or None


def normalize_tokens(text: Optional[str]) -> list[str]:
    """
    Normalize meaningful title/description tokens before comparison.
    """
    if not text:
        return []

    normalized_text = text.lower()

    # Normalize equivalent phrase/spelling forms before tokenization.
    #
    # Hydro Flask / Hydro-Flask / Hydroflask -> hydroflask
    # key chain / key-chain / keychain -> keychain
    normalized_text = re.sub(
        r"\bhydro[\s-]*flask\b",
        "hydroflask",
        normalized_text,
    )

    normalized_text = re.sub(
        r"\bkey[\s-]*chain\b",
        "keychain",
        normalized_text,
    )

    raw_tokens = re.findall(r"[a-z0-9]+", normalized_text)
    result: list[str] = []

    for token in raw_tokens:
        token = TOKEN_ALIASES.get(token, token)

        if (
            token in STOPWORDS
            or token in COLOR_WORDS
            or token in LOW_INFORMATION_WORDS
            or len(token) < 3
        ):
            continue

        if len(token) > 4 and token.endswith("s") and not token.endswith("ss"):
            token = token[:-1]

        result.append(token)

    return result


def token_similarity(
    left_text: Optional[str],
    right_text: Optional[str],
) -> Optional[float]:
    """
    Compare meaningful tokens while penalizing unmatched meaningful words.

    This handles typos such as:
      backpack <-> backpak

    But does not treat:
      water bottle <-> bottle

    as an exact match.
    """
    left_tokens = normalize_tokens(left_text)
    right_tokens = normalize_tokens(right_text)

    if not left_tokens or not right_tokens:
        return None

    left_set = set(left_tokens)
    right_set = set(right_tokens)

    # Each token can match at most one token on the other side.
    # A value around 0.85 allows minor typos but avoids broad semantic matches.
    MATCH_THRESHOLD = 0.85

    unmatched_right = set(right_set)
    matched_similarity_total = 0.0
    matched_count = 0

    for left_token in left_set:
        best_right_token = None
        best_similarity = 0.0

        for right_token in unmatched_right:
            similarity = fuzz.ratio(left_token, right_token) / 100.0

            if similarity > best_similarity:
                best_similarity = similarity
                best_right_token = right_token

        if best_right_token and best_similarity >= MATCH_THRESHOLD:
            matched_count += 1
            matched_similarity_total += best_similarity
            unmatched_right.remove(best_right_token)
    
    # Divide by the larger title token count rather than the set union.
    # This still penalizes unmatched meaningful words:
    #   "water bottle" vs "bottle" -> 1 matched token / 2 = 0.5
    #
    # But it does not double-penalize a fuzzy typo match:
    #   "backpack" vs "backpak" -> 0.9333 / 1 = 0.9333
    token_count_denominator = max(len(left_set), len(right_set))

    if token_count_denominator == 0:
        return None

    return round(
        matched_similarity_total / token_count_denominator,
        4,
    )


def color_similarity_and_penalty(lost: Item, found: Item) -> tuple[Optional[float], float]:
    """
    Returns (similarity, contradiction_penalty).

    None means no reliable color evidence. A known color disagreement gets a
    score of 0 and an explicit penalty.
    """
    lost_primary = lost.primaryColor
    found_primary = found.primaryColor

    # OTHER should not be treated as a known color match.
    if (
        lost_primary is None
        or found_primary is None
        or lost_primary == PrimaryColor.OTHER
        or found_primary == PrimaryColor.OTHER
    ):
        return None, 0.0

    if lost_primary == found_primary:
        return 1.0, 0.0

    lost_colors = {lost_primary}
    found_colors = {found_primary}

    if lost.secondaryColor:
        lost_colors.add(lost.secondaryColor)

    if found.secondaryColor:
        found_colors.add(found.secondaryColor)

    # A primary/secondary overlap is useful but less certain.
    if lost_colors & found_colors:
        return 0.70, 0.0

    # Known BLUE vs known BLACK is different from unknown vs unknown.
    return 0.0, COLOR_CONTRADICTION_PENALTY

def has_known_color_conflict(
    lost: Item,
    found: Item,
) -> bool:
    """
    True only when both reports provide meaningful colors and those colors
    do not overlap.

    UNKNOWN / OTHER values are not considered conflicts.
    """
    color_score, color_penalty = color_similarity_and_penalty(lost, found)

    return (
        color_score == 0.0
        and color_penalty > 0.0
    )

def brand_similarity_and_penalty(lost: Item, found: Item) -> tuple[Optional[float], float]:
    lost_brand = normalize_brand(lost.brand)
    found_brand = normalize_brand(found.brand)

    if not lost_brand or not found_brand:
        return None, 0.0

    if lost_brand == found_brand:
        return 1.0, 0.0

    return 0.0, BRAND_CONTRADICTION_PENALTY


def condition_similarity(lost: Item, found: Item) -> Optional[float]:
    if (
        lost.condition == ItemCondition.UNKNOWN
        or found.condition == ItemCondition.UNKNOWN
    ):
        return None

    lost_rank = CONDITION_RANKS[lost.condition]
    found_rank = CONDITION_RANKS[found.condition]
    return max(0.0, 1.0 - (abs(lost_rank - found_rank) / 5.0))


def distance_similarity(lost: Item, found: Item) -> Optional[float]:
    if not (
        has_valid_coordinates(lost.location)
        and has_valid_coordinates(found.location)
    ):
        return None

    distance_km = geodesic(
        (lost.location.latitude, lost.location.longitude),
        (found.location.latitude, found.location.longitude),
    ).km

    # Context signal only; it should not establish object identity.
    return max(0.0, math.exp(-distance_km / 0.8))


def date_similarity(lost: Item, found: Item) -> Optional[float]:
    if not lost.incidentDate or not found.incidentDate:
        return None

    days_diff = abs(
        (lost.incidentDate - found.incidentDate).total_seconds()
    ) / 86400

    return max(0.0, math.exp(-days_diff / 7.0))


def weighted_observed_score(
    feature_scores: dict[str, Optional[float]],
) -> tuple[float, float]:
    """
    Score only observed features.

    The second return value is the available evidence weight. It is stored for
    audit/debugging and is useful later when calibrating thresholds.
    """
    observed = {
        name: score
        for name, score in feature_scores.items()
        if score is not None
    }

    total_weight = sum(WEIGHTS[name] for name in observed)
    if total_weight == 0:
        return 0.0, 0.0

    score = sum(
        observed[name] * WEIGHTS[name]
        for name in observed
    ) / total_weight

    return score, total_weight


def passes_identity_gate(
    feature_scores: dict[str, Optional[float]],
    *,
    known_color_conflict: bool,
) -> tuple[bool, str]:
    """
    Require object-identity evidence before a pair can become a suggestion.

    Date and distance are contextual evidence only. They cannot establish
    identity by themselves.

    When colors explicitly conflict, require stronger non-color evidence
    before allowing the candidate to qualify.
    """
    item_kind = feature_scores.get("item_kind")
    title = feature_scores.get("title")
    description = feature_scores.get("description")
    brand = feature_scores.get("brand")
    color = feature_scores.get("color")

    exact_kind = item_kind == 1.0

    strong_title = (
        title is not None
        and title >= MIN_TITLE_SIMILARITY
    )

    strong_description = (
        description is not None
        and description >= MIN_DESCRIPTION_SIMILARITY
    )

    matching_brand = brand == 1.0

    matching_color = (
        color is not None
        and color >= 0.70
    )

    # A known BLUE-vs-GRAY conflict needs evidence that does not depend on
    # color, time, or location.
    #
    # Examples that can overcome a color conflict:
    # - same brand + strong object title
    # - strong matching description + strong title
    #
    # Same item kind alone is not enough because many unrelated items are
    # water bottles, backpacks, phones, etc.
    if known_color_conflict:
        if strong_title and strong_description and matching_brand:
            return True, "strong_distinctive_evidence_despite_color_conflict"

        return False, "unresolved_color_conflict"

    # Normal, no-conflict path:
    # Strong title must be corroborated by an independent attribute.
    if strong_title and (
        strong_description
        or matching_brand
        or matching_color
        or exact_kind
    ):
        return True, "strong_title_plus_attribute"

    # Sparse staff reports may have weak title text. Exact kind plus another
    # strong structured attribute is enough to remain eligible.
    if exact_kind and (
        matching_brand
        or matching_color
        or strong_description
    ):
        return True, "exact_kind_plus_attribute"

    return False, "insufficient_identity_evidence"

def calculate_match_score(lost: Item, found: Item) -> tuple[float, dict]:
    """
    Calculate a candidate rank score and explain the decision.

    Important:
    - Known incompatible item kinds are hard-rejected.
    - Missing fields are excluded from scoring.
    - Ineligible candidates are capped below SCORE_THRESHOLD, even if date,
      location, and color happen to look perfect.
    """
    color_score, color_penalty = color_similarity_and_penalty(lost, found)
    brand_score, brand_penalty = brand_similarity_and_penalty(lost, found)

    kind_is_compatible, kind_score, rejection_reason = item_kind_compatible(
        lost,
        found,
    )

    # Hard reject known conflicting kinds.
    #
    # Example:
    # backpack != umbrella
    # water-bottle != laptop
    if not kind_is_compatible:
        return 0.0, {
            "algorithmVersion": "v2-phase2",
            "eligible": False,
            "eligibilityReason": rejection_reason,
            "scores": {
                "item_kind": kind_score,
            },
            "weightsUsed": {
                "item_kind": WEIGHTS["item_kind"],
            },
            "evidenceWeight": round(WEIGHTS["item_kind"], 4),
            "contradictionPenalty": 0.0,
            "rawScore": 0.0,
        }

    # IMPORTANT: item_kind must be included here.
    scores: dict[str, Optional[float]] = {
        "item_kind": kind_score,
        "title": token_similarity(lost.title, found.title),
        "description": token_similarity(lost.description, found.description),
        "brand": brand_score,
        "color": color_score,
        "distance": distance_similarity(lost, found),
        "date_proximity": date_similarity(lost, found),
        "condition": condition_similarity(lost, found),
    }

    # eligible, eligibility_reason = passes_identity_gate(scores)
    known_color_conflict = has_known_color_conflict(lost, found)

    eligible, eligibility_reason = passes_identity_gate(
        scores,
        known_color_conflict=known_color_conflict,
    )

    raw_score, evidence_weight = weighted_observed_score(scores)

    contradiction_penalty = color_penalty + brand_penalty
    score_after_penalties = max(
        0.0,
        min(1.0, raw_score - contradiction_penalty),
    )

    # An ineligible candidate must never appear to meet the normal threshold.
    #
    # We preserve a capped rank score for diagnostics/ranking, but guarantee
    # that it cannot look like an auto-match. The matching batch must still
    # check `details["eligible"]`.
    if eligible:
        final_score = score_after_penalties
        capped_because_ineligible = False
    else:
        final_score = min(
            score_after_penalties,
            max(0.0, SCORE_THRESHOLD - 0.0001),
        )
        capped_because_ineligible = True

    score_details = {
        "algorithmVersion": "v2",
        "eligible": eligible,
        "eligibilityReason": eligibility_reason,
        "knownColorConflict": known_color_conflict,
        "scores": {
            name: None if value is None else round(value, 4)
            for name, value in scores.items()
        },
        "weightsUsed": {
            name: WEIGHTS[name]
            for name, value in scores.items()
            if value is not None
        },
        "evidenceWeight": round(evidence_weight, 4),
        "contradictionPenalty": round(contradiction_penalty, 4),
        "rawScore": round(raw_score, 4),
        "scoreCappedBecauseIneligible": capped_because_ineligible,
    }

    return round(final_score, 4), score_details