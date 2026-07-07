"""Schemas for found item requests and responses."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class FoundItemCreateRequest(BaseModel):
    """Request to create a found item (staff only)."""
    item_name: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=5)
    location: str = Field(..., min_length=2, max_length=500)
    date_found: datetime = Field(...)


class FoundItemUpdateRequest(BaseModel):
    """Request to update a found item."""
    item_name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, min_length=5)
    location: Optional[str] = Field(None, min_length=2, max_length=500)
    date_found: Optional[datetime] = None
    status: Optional[str] = None


class FoundItemResponse(BaseModel):
    """Found item response."""
    id: str
    staff_id: str
    item_name: str
    description: str
    location: str
    date_found: datetime
    image_url: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FoundItemListResponse(BaseModel):
    """Paginated list of found items."""
    items: List[FoundItemResponse]
    total: int
    page: int
    limit: int
    pages: int
