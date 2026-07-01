"""Match model for storing AI matching results."""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base


class Match(Base):
    """Model for AI-generated matches between lost and found items."""
    __tablename__ = "match"

    id = Column(String(36), primary_key=True, default=lambda: str(__import__('uuid').uuid4()))
    lost_item_id = Column(String(36), ForeignKey("lost_item.id"), nullable=False, index=True)
    found_item_id = Column(String(36), ForeignKey("found_item.id"), nullable=False, index=True)
    
    # Similarity scores (0.0 to 1.0)
    image_score = Column(Float, nullable=True)  # CLIP image similarity
    text_score = Column(Float, nullable=True)   # Text description similarity
    combined_score = Column(Float, nullable=False)  # Weighted final score
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    lost_item = relationship("LostItem", back_populates="matches", foreign_keys=[lost_item_id])
    found_item = relationship("FoundItem", back_populates="matches", foreign_keys=[found_item_id])

    def __repr__(self) -> str:
        return f"<Match(id={self.id}, lost_item_id={self.lost_item_id}, found_item_id={self.found_item_id}, score={self.combined_score})>"
