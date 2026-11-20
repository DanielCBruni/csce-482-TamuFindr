from datetime import datetime, timedelta

from models import ItemCondition, PrimaryColor
from scoring import calculate_match_score, normalize_tokens, token_similarity

from helpers import make_item, make_location


def test_normalization_removes_colors_generic_words_and_report_language():
    tokens = normalize_tokens(
        "Lost my BLUE water bottle at the library"
    )

    # "lost", "my", "blue", "water", "the", and "at" should not establish
    # object identity.
    assert "lost" not in tokens
    assert "blue" not in tokens
    assert "water" not in tokens
    assert "bottle" in tokens


def test_only_generic_words_do_not_create_title_similarity():
    """
    Regression case: shared vague words must not become strong evidence.
    """
    similarity = token_similarity("water blue", "black water bottle")

    # Depending on your normalizer, this should normally be None because
    # "water" and "blue"/"black" are removed as low-information/color words.
    assert similarity is None or similarity < 0.30


def test_same_location_and_date_cannot_create_match_without_identity_evidence():
    lost = make_item(
        title="blue",
        primary_color=PrimaryColor.BLUE,
        incident_date=datetime(2026, 10, 1, 12, 0, 0),
        location=make_location(30.6187, -96.3365),
    )

    found = make_item(
        title="black water bottle",
        primary_color=PrimaryColor.BLACK,
        incident_date=datetime(2026, 10, 1, 12, 0, 0),
        location=make_location(30.6187, -96.3365),
    )

    score, details = calculate_match_score(lost, found)

    assert details["scores"]["distance"] > 0.99
    assert details["scores"]["date_proximity"] > 0.99

    # Contextual similarity cannot override lack of object identity.
    assert details["eligible"] is False
    assert score < 0.68


def test_missing_description_is_unavailable_not_neutral_credit():
    lost = make_item(
        title="blue backpack",
        primary_color=PrimaryColor.BLUE,
    )
    found = make_item(
        title="blue backpack",
        primary_color=PrimaryColor.BLUE,
    )

    _, details = calculate_match_score(lost, found)

    assert details["scores"]["description"] is None


def test_missing_coordinates_are_unavailable_not_neutral_credit():
    lost = make_item(
        title="blue backpack",
        primary_color=PrimaryColor.BLUE,
        location=make_location(),
    )
    found = make_item(
        title="blue backpack",
        primary_color=PrimaryColor.BLUE,
        location=make_location(),
    )

    _, details = calculate_match_score(lost, found)

    assert details["scores"]["distance"] is None


def test_missing_condition_is_unavailable_not_neutral_credit():
    lost = make_item(
        title="blue backpack",
        primary_color=PrimaryColor.BLUE,
        condition=ItemCondition.UNKNOWN,
    )
    found = make_item(
        title="blue backpack",
        primary_color=PrimaryColor.BLUE,
        condition=ItemCondition.UNKNOWN,
    )

    _, details = calculate_match_score(lost, found)

    assert details["scores"]["condition"] is None


def test_exact_primary_color_match_is_positive_evidence():
    lost = make_item(
        title="blue backpack",
        primary_color=PrimaryColor.BLUE,
    )
    found = make_item(
        title="backpack",
        primary_color=PrimaryColor.BLUE,
    )

    _, details = calculate_match_score(lost, found)

    assert details["scores"]["color"] == 1.0


def test_secondary_color_overlap_is_partial_positive_evidence():
    lost = make_item(
        title="backpack",
        primary_color=PrimaryColor.BLACK,
        secondary_color=PrimaryColor.RED,
    )
    found = make_item(
        title="backpack",
        primary_color=PrimaryColor.RED,
    )

    _, details = calculate_match_score(lost, found)

    assert details["scores"]["color"] == 0.70


def test_known_color_conflict_creates_penalty():
    lost = make_item(
        title="metal bottle",
        primary_color=PrimaryColor.BLUE,
    )
    found = make_item(
        title="metal bottle",
        primary_color=PrimaryColor.BLACK,
    )

    _, details = calculate_match_score(lost, found)

    assert details["scores"]["color"] == 0.0
    assert details["contradictionPenalty"] > 0


def test_unknown_color_does_not_create_color_penalty():
    lost = make_item(
        title="metal bottle",
        primary_color=PrimaryColor.BLUE,
    )
    found = make_item(
        title="metal bottle",
        primary_color=PrimaryColor.OTHER,
    )

    _, details = calculate_match_score(lost, found)

    assert details["scores"]["color"] is None
    assert details["contradictionPenalty"] == 0


def test_same_brand_is_positive_evidence_case_insensitively():
    lost = make_item(
        title="blue bottle",
        brand="Hydro Flask",
        primary_color=PrimaryColor.BLUE,
    )
    found = make_item(
        title="blue bottle",
        brand="hydroflask",
        primary_color=PrimaryColor.BLUE,
    )

    _, details = calculate_match_score(lost, found)

    assert details["scores"]["brand"] == 1.0


def test_different_known_brands_create_penalty():
    lost = make_item(
        title="wireless headphones",
        brand="Sony",
        primary_color=PrimaryColor.BLACK,
    )
    found = make_item(
        title="wireless headphones",
        brand="Bose",
        primary_color=PrimaryColor.BLACK,
    )

    _, details = calculate_match_score(lost, found)

    assert details["scores"]["brand"] == 0.0
    assert details["contradictionPenalty"] > 0


def test_good_match_with_multiple_attributes_is_eligible():
    lost = make_item(
        title="Blue Hydro Flask bottle",
        description="Metal bottle with TAMU sticker and black lid",
        primary_color=PrimaryColor.BLUE,
        brand="Hydro Flask",
        condition=ItemCondition.GOOD,
        incident_date=datetime(2026, 10, 1, 10, 0, 0),
        location=make_location(30.6187, -96.3365),
    )

    found = make_item(
        title="Hydro Flask blue bottle",
        description="Metal bottle with TAMU sticker and black cap",
        primary_color=PrimaryColor.BLUE,
        brand="hydroflask",
        condition=ItemCondition.GOOD,
        incident_date=datetime(2026, 10, 1, 15, 0, 0),
        location=make_location(30.6188, -96.3366),
    )

    score, details = calculate_match_score(lost, found)

    assert details["eligible"] is True
    assert details["scores"]["title"] >= 0.60
    assert details["scores"]["brand"] == 1.0
    assert details["scores"]["color"] == 1.0
    assert details["contradictionPenalty"] == 0
    assert score >= 0.68


def test_typo_tolerance_for_meaningful_object_word():
    similarity = token_similarity(
        "black backpack",
        "black backpak",
    )

    assert similarity is not None
    assert similarity >= 0.60