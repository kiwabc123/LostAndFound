"""Claim request model for item ownership claims."""

from datetime import datetime
from enum import Enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class ClaimStatus(str, Enum):
    """Claim request status enumeration."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"


class ClaimRequest(Base):
    """Model for users to claim ownership of found items."""
    __tablename__ = "claim_request"

    id = Column(String(36), primary_key=True, default=lambda: str(__import__('uuid').uuid4()))
    user_id = Column(String(36), ForeignKey("user.id"), nullable=False, index=True)
    found_item_id = Column(String(36), ForeignKey("found_item.id"), nullable=False, index=True)
    
    status = Column(String(20), default=ClaimStatus.PENDING, nullable=False)
    reason = Column(Text, nullable=True)  # User's explanation for the claim
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="claim_requests")
    found_item = relationship("FoundItem", back_populates="claim_requests")

    def __repr__(self) -> str:
        return f"<ClaimRequest(id={self.id}, user_id={self.user_id}, found_item_id={self.found_item_id}, status={self.status})>"
