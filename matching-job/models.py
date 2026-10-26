import enum
from datetime import datetime
from typing import Optional, Any
from sqlalchemy import (
    String, Float, DateTime, Enum, ForeignKey, UniqueConstraint, Index, JSON, func
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class PrimaryColor(str, enum.Enum):
    BLACK = "BLACK"
    WHITE = "WHITE"
    SILVER = "SILVER"
    GRAY = "GRAY"
    RED = "RED"
    BLUE = "BLUE"
    GREEN = "GREEN"
    YELLOW = "YELLOW"
    BROWN = "BROWN"
    PURPLE = "PURPLE"
    PINK = "PINK"
    ORANGE = "ORANGE"
    OTHER = "OTHER"

class ItemCondition(str, enum.Enum):
    UNKNOWN = "UNKNOWN"
    NEW = "NEW"
    LIKE_NEW = "LIKE_NEW"
    GOOD = "GOOD"
    FAIR = "FAIR"
    POOR = "POOR"
    DAMAGED = "DAMAGED"

class ItemType(str, enum.Enum):
    LOST = "LOST"
    FOUND = "FOUND"

class ItemStatus(str, enum.Enum):
    OPEN = "OPEN"
    RESOLVED = "RESOLVED"

class MatchStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"

class Location(Base):
    __tablename__ = "Location"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

class Item(Base):
    __tablename__ = "Item"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    userId: Mapped[str] = mapped_column(String)
    categoryId: Mapped[str] = mapped_column(String)
    type: Mapped[ItemType] = mapped_column(Enum(ItemType))
    status: Mapped[ItemStatus] = mapped_column(Enum(ItemStatus), default=ItemStatus.OPEN)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    primaryColor: Mapped[PrimaryColor] = mapped_column(Enum(PrimaryColor))
    secondaryColor: Mapped[Optional[PrimaryColor]] = mapped_column(Enum(PrimaryColor), nullable=True)
    brand: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    condition: Mapped[ItemCondition] = mapped_column(Enum(ItemCondition))

    locationId: Mapped[str] = mapped_column(String, ForeignKey("Location.id"))
    incidentDate: Mapped[datetime] = mapped_column(DateTime)

    # Relationships
    location: Mapped["Location"] = relationship("Location")

class ItemMatch(Base):
    __tablename__ = "ItemMatch"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    lostItemId: Mapped[str] = mapped_column(String, ForeignKey("Item.id"))
    potentialMatchId: Mapped[str] = mapped_column(String, ForeignKey("Item.id"))
    score: Mapped[float] = mapped_column(Float)
    scoreDetails: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
    status: Mapped[MatchStatus] = mapped_column(Enum(MatchStatus), default=MatchStatus.PENDING)
    createdAt: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updatedAt: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("lostItemId", "potentialMatchId", name="ItemMatch_lostItemId_potentialMatchId_key"),
    )