from datetime import datetime

import pytest

from models import PrimaryColor
from scoring import calculate_match_score

from helpers import make_item, make_location
from scoring import calculate_match_score


@pytest.mark.parametrize(
    ("lost_title", "lost_kind", "found_title", "found_kind"),
    [
        ("water blue", None, "black water bottle", "water-bottle"),
        ("blue item", None, "blue backpack", "backpack"),
        ("black personal item", None, "black umbrella", "umbrella"),
        ("my red thing", None, "red laptop bag", "laptop-bag"),
    ],
)
def test_generic_vague_reports_do_not_auto_match(
    lost_title,
    lost_kind,
    found_title,
    found_kind,
):
    location = make_location(30.6187, -96.3365)

    lost = make_item(
        title=lost_title,
        item_kind_id=lost_kind,
        primary_color=PrimaryColor.BLUE,
        location=location,
        incident_date=datetime(2026, 10, 1),
    )
    found = make_item(
        title=found_title,
        item_kind_id=found_kind,
        primary_color=PrimaryColor.BLUE,
        location=location,
        incident_date=datetime(2026, 10, 1),
    )

    score, details = calculate_match_score(lost, found)

    assert details["eligible"] is False
    assert score < 0.68


@pytest.mark.parametrize(
    ("lost_title", "found_title", "item_kind", "brand"),
    [
        (
            "Blue Hydro Flask with TAMU sticker",
            "Hydro Flask blue bottle TAMU sticker",
            "water-bottle",
            "Hydro Flask",
        ),
        (
            "Black Jansport backpack with red keychain",
            "Jansport black backpack red key chain",
            "backpack",
            "Jansport",
        ),
        (
            "Silver Macbook Air laptop",
            "Apple MacBook Air silver laptop",
            "laptop",
            "Apple",
        ),
    ],
)
def test_high_quality_matches_remain_eligible(
    lost_title,
    found_title,
    item_kind,
    brand,
):
    lost = make_item(
        title=lost_title,
        item_kind_id=item_kind,
        brand=brand,
        primary_color=PrimaryColor.SILVER,
    )
    found = make_item(
        title=found_title,
        item_kind_id=item_kind,
        brand=brand.lower(),
        primary_color=PrimaryColor.SILVER,
    )

    score, details = calculate_match_score(lost, found)

    assert details["eligible"] is True
    assert score >= 0.68


def test_blue_bottle_and_black_bottle_are_not_as_good_as_same_color_bottles():
    """
    An exact color match should qualify.

    A known color conflict without distinctive corroborating evidence should
    not qualify as an automatic suggestion.
    """
    lost = make_item(
        title="hydro flask bottle",
        item_kind_id="water-bottle",
        brand="Hydro Flask",
        primary_color=PrimaryColor.BLUE,
    )

    same_color_found = make_item(
        title="hydro flask bottle",
        item_kind_id="water-bottle",
        brand="hydroflask",
        primary_color=PrimaryColor.BLUE,
    )

    different_color_found = make_item(
        title="hydro flask bottle",
        item_kind_id="water-bottle",
        brand="hydroflask",
        primary_color=PrimaryColor.BLACK,
    )

    same_score, same_details = calculate_match_score(lost, same_color_found)
    different_score, different_details = calculate_match_score(
        lost,
        different_color_found,
    )

    assert same_details["eligible"] is True

    assert different_details["eligible"] is False
    assert different_details["eligibilityReason"] == "unresolved_color_conflict"
    assert different_details["knownColorConflict"] is True

    assert same_score > different_score
    assert different_details["contradictionPenalty"] > 0

def test_correct_candidate_ranks_above_wrong_candidates():
    lost = make_item(
        item_id="lost-1",
        title="Blue Hydro Flask bottle with TAMU sticker",
        description="Metal bottle with black lid",
        item_kind_id="water-bottle",
        brand="Hydro Flask",
        primary_color=PrimaryColor.BLUE,
        location=make_location(30.6187, -96.3365),
    )

    correct_found = make_item(
        item_id="found-correct",
        title="Hydro Flask blue bottle TAMU sticker",
        description="Metal bottle with black cap",
        item_kind_id="water-bottle",
        brand="hydroflask",
        primary_color=PrimaryColor.BLUE,
        location=make_location(30.6188, -96.3366),
    )

    wrong_color_found = make_item(
        item_id="found-wrong-color",
        title="Hydro Flask bottle",
        description="Metal bottle",
        item_kind_id="water-bottle",
        brand="hydroflask",
        primary_color=PrimaryColor.BLACK,
        location=make_location(30.6188, -96.3366),
    )

    wrong_kind_found = make_item(
        item_id="found-wrong-kind",
        title="Blue Hydro Flask backpack",
        description="Blue bag",
        item_kind_id="backpack",
        brand="Hydro Flask",
        primary_color=PrimaryColor.BLUE,
        location=make_location(30.6188, -96.3366),
    )

    candidates = [
        correct_found,
        wrong_color_found,
        wrong_kind_found,
    ]

    ranked = sorted(
        [
            (
                candidate.id,
                *calculate_match_score(lost, candidate),
            )
            for candidate in candidates
        ],
        key=lambda result: result[1],  # score
        reverse=True,
    )

    top_candidate_id, top_score, top_details = ranked[0]

    assert top_candidate_id == "found-correct"
    assert top_details["eligible"] is True

    wrong_kind_entry = next(
        result for result in ranked
        if result[0] == "found-wrong-kind"
    )

    assert wrong_kind_entry[1] == 0.0
    assert wrong_kind_entry[2]["eligible"] is False