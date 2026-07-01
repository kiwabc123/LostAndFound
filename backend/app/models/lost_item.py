"""Lost item model for tracking lost items."""

from datetime import datetime
from enum import Enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.database import Base


class LostItemStatus(str, Enum):
    """Lost item status enumeration."""
    LOST = "lost"
    FOUND = "found"
    CLAIMED = "claimed"
    ARCHIVED = "archived"


class LostItem(Base):
    """Model for lost items reported by users."""
    __tablename__ = "lost_item"

    id = Column(String(36), primary_key=True, default=lambda: str(__import__('uuid').uuid4()))
    user_id = Column(String(36), ForeignKey("user.id"), nullable=False, index=True)
    item_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(500), nullable=False)
    date_lost = Column(DateTime, nullable=False)
    image_url = Column(String(500), nullable=True)
    
    # Embeddings for AI matching (pgvector)
    # image_embedding: 512-dim CLIP embeddings
    # text_embedding: 384-dim Sentence Transformers embeddings
    image_embedding = Column(Vector(512), nullable=True)
    text_embedding = Column(Vector(384), nullable=True)
    
    status = Column(String(20), default=LostItemStatus.LOST, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="lost_items")
    matches = relationship("Match", back_populates="lost_item", cascade="all, delete-orphan", foreign_keys="Match.lost_item_id")

    def __repr__(self) -> str:
        return f"<LostItem(id={self.id}, item_name={self.item_name}, status={self.status})>"
