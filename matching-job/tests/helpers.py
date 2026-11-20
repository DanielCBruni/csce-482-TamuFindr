from datetime import datetime
from types import SimpleNamespace

from models import ItemCondition, PrimaryColor


def make_location(latitude=None, longitude=None, **extra):
    """
    Lightweight location object for scorer tests.

    The scoring code only needs latitude and longitude in Phase 1.
    Extra values allow future building/floor/zone tests.
    """
    return SimpleNamespace(
        latitude=latitude,
        longitude=longitude,
        **extra,
    )


def make_item(
    *,
    item_id="item-1",
    title="",
    description=None,
    primary_color=PrimaryColor.OTHER,
    secondary_color=None,
    brand=None,
    condition=ItemCondition.UNKNOWN,
    incident_date=None,
    location=None,
    item_kind_id=None,
    category_id="category-personal-items",
    item_type=None,
    status=None,
):
    """
    Creates a minimal Item-like object.

    This avoids requiring a database for pure scoring tests. Add fields here
    as the matcher grows, such as serialNumberNormalized, model, etc.
    """
    return SimpleNamespace(
        id=item_id,
        title=title,
        description=description,
        primaryColor=primary_color,
        secondaryColor=secondary_color,
        brand=brand,
        condition=condition,
        incidentDate=incident_date or datetime(2026, 10, 1, 12, 0, 0),
        location=location or make_location(),
        itemKindId=item_kind_id,
        categoryId=category_id,
        type=item_type,
        status=status,
    )