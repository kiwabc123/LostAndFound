"""User model for authentication and account management."""

from datetime import datetime
from enum import Enum
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class UserRole(str, Enum):
    """User role enumeration."""
    USER = "user"
    STAFF = "staff"
    ADMIN = "admin"


class User(Base):
    """User account model."""
    __tablename__ = "user"

    id = Column(String(36), primary_key=True, default=lambda: str(__import__('uuid').uuid4()))
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    lost_items = relationship("LostItem", back_populates="user", cascade="all, delete-orphan")
    claim_requests = relationship("ClaimRequest", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User(id={self.id}, username={self.username}, role={self.role})>"
