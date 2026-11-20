from models import PrimaryColor
from scoring import calculate_match_score

from helpers import make_item, make_location


def test_same_exact_item_kind_is_positive_evidence():
    lost = make_item(
        title="blue backpack",
        primary_color=PrimaryColor.BLUE,
        item_kind_id="backpack",
    )
    found = make_item(
        title="backpack blue",
        primary_color=PrimaryColor.BLUE,
        item_kind_id="backpack",
    )

    _, details = calculate_match_score(lost, found)

    assert details["scores"]["item_kind"] == 1.0


def test_conflicting_known_item_kinds_are_hard_rejected():
    """
    The main Phase 2 protection.

    Even with identical color, location, date, and similar generic language,
    a backpack should not match an umbrella.
    """
    location = make_location(30.6187, -96.3365)

    lost = make_item(
        title="blue backpack",
        primary_color=PrimaryColor.BLUE,
        item_kind_id="backpack",
        location=location,
    )
    found = make_item(
        title="blue umbrella",
        primary_color=PrimaryColor.BLUE,
        item_kind_id="umbrella",
        location=location,
    )

    score, details = calculate_match_score(lost, found)

    assert score == 0.0
    assert details["eligible"] is False
    assert details["eligibilityReason"] == "incompatible_item_kind"


def test_water_bottle_does_not_match_laptop_even_with_same_brand_color_and_location():
    location = make_location(30.6187, -96.3365)

    lost = make_item(
        title="black item",
        primary_color=PrimaryColor.BLACK,
        brand="Apple",
        item_kind_id="water-bottle",
        location=location,
    )
    found = make_item(
        title="black item",
        primary_color=PrimaryColor.BLACK,
        brand="Apple",
        item_kind_id="laptop",
        location=location,
    )

    score, details = calculate_match_score(lost, found)

    assert score == 0.0
    assert details["eligible"] is False
    assert details["eligibilityReason"] == "incompatible_item_kind"


def test_unknown_item_kind_does_not_hard_reject():
    """
    Sparse reports should remain matchable when one side has no selected kind.
    They still need to pass the normal identity gate.
    """
    lost = make_item(
        title="blue hydro flask bottle",
        primary_color=PrimaryColor.BLUE,
        brand="Hydro Flask",
        item_kind_id=None,
    )
    found = make_item(
        title="hydro flask blue bottle",
        primary_color=PrimaryColor.BLUE,
        brand="hydroflask",
        item_kind_id="water-bottle",
    )

    score, details = calculate_match_score(lost, found)

    assert details["eligibilityReason"] != "incompatible_item_kind"
    assert details["eligible"] is True
    assert score > 0


def test_same_item_kind_can_corrobate_sparse_title():
    """
    Staff-entered reports may have weak text, but a matching kind plus another
    identifying attribute can be sufficient.
    """
    lost = make_item(
        title="found item",
        primary_color=PrimaryColor.RED,
        item_kind_id="keys",
    )
    found = make_item(
        title="keys",
        primary_color=PrimaryColor.RED,
        item_kind_id="keys",
    )

    score, details = calculate_match_score(lost, found)

    # This expectation assumes your Phase 2 identity gate accepts:
    # exact item kind + matching structured attribute.
    assert details["scores"]["item_kind"] == 1.0
    assert details["scores"]["color"] == 1.0
    assert details["eligible"] is True
    assert score > 0


def test_same_category_but_different_item_kind_is_rejected():
    """
    Both may belong to an "Accessories" or "Personal Items" category.
    Category agreement is not enough when confident kinds conflict.
    """
    lost = make_item(
        title="black wallet",
        category_id="personal-items",
        item_kind_id="wallet",
        primary_color=PrimaryColor.BLACK,
    )
    found = make_item(
        title="black sunglasses",
        category_id="personal-items",
        item_kind_id="sunglasses",
        primary_color=PrimaryColor.BLACK,
    )

    score, details = calculate_match_score(lost, found)

    assert score == 0.0
    assert details["eligible"] is False
    assert details["eligibilityReason"] == "incompatible_item_kind"
    
