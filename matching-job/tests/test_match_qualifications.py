from config import SCORE_THRESHOLD
from scoring import qualifies_for_persistence


def test_eligible_score_above_threshold_is_persisted():
    assert qualifies_for_persistence(
        SCORE_THRESHOLD,
        {"eligible": True},
    ) is True


def test_eligible_score_below_threshold_is_not_persisted():
    assert qualifies_for_persistence(
        SCORE_THRESHOLD - 0.0001,
        {"eligible": True},
    ) is False


def test_ineligible_pair_is_never_persisted_even_with_high_score():
    """
    Important defensive test: bad identity evidence must not be overridden by
    an accidental high contextual score.
    """
    assert qualifies_for_persistence(
        0.99,
        {"eligible": False},
    ) is False


def test_missing_eligible_flag_is_not_persisted():
    """
    Defensive default for malformed/older scoreDetails.
    """
    assert qualifies_for_persistence(
        0.99,
        {},
    ) is False