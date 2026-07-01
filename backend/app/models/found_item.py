"""Found item model for tracking found items."""

from datetime import datetime
from enum import Enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.database import Base


class FoundItemStatus(str, Enum):
    """Found item status enumeration."""
    FOUND = "found"
    CLAIMED = "claimed"
    RETURNED = "returned"
    ARCHIVED = "archived"


class FoundItem(Base):
    """Model for found items recorded by staff."""
    __tablename__ = "found_item"

    id = Column(String(36), primary_key=True, default=lambda: str(__import__('uuid').uuid4()))
    staff_id = Column(String(36), ForeignKey("user.id"), nullable=False, index=True)
    item_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(500), nullable=False)
    date_found = Column(DateTime, nullable=False)
    image_url = Column(String(500), nullable=True)
    
    # Embeddings for AI matching (pgvector)
    # image_embedding: 512-dim CLIP embeddings
    # text_embedding: 384-dim Sentence Transformers embeddings
    image_embedding = Column(Vector(512), nullable=True)
    text_embedding = Column(Vector(384), nullable=True)
    
    status = Column(String(20), default=FoundItemStatus.FOUND, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    staff = relationship("User", foreign_keys=[staff_id])
    matches = relationship("Match", back_populates="found_item", cascade="all, delete-orphan", foreign_keys="Match.found_item_id")
    claim_requests = relationship("ClaimRequest", back_populates="found_item", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<FoundItem(id={self.id}, item_name={self.item_name}, status={self.status})>"
