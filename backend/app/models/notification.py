"""Notification model for user notifications."""

from datetime import datetime
from enum import Enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class NotificationType(str, Enum):
    """Notification type enumeration."""
    MATCH_FOUND = "match_found"
    CLAIM_APPROVED = "claim_approved"
    CLAIM_REJECTED = "claim_rejected"
    ITEM_RETURNED = "item_returned"
    SYSTEM_MESSAGE = "system_message"


class Notification(Base):
    """Model for in-app notifications."""
    __tablename__ = "notification"

    id = Column(String(36), primary_key=True, default=lambda: str(__import__('uuid').uuid4()))
    user_id = Column(String(36), ForeignKey("user.id"), nullable=False, index=True)
    
    notification_type = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    read_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="notifications")

    def __repr__(self) -> str:
        return f"<Notification(id={self.id}, user_id={self.user_id}, type={self.notification_type}, read={self.is_read})>"
