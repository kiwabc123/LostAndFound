"""Schemas for lost item requests and responses."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class LostItemCreateRequest(BaseModel):
    """Request to create a lost item."""
    item_name: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=5)
    location: str = Field(..., min_length=2, max_length=500)
    date_lost: datetime = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "item_name": "Black leather wallet",
                "description": "Black leather bifold wallet with ID cards and credit cards inside",
                "location": "Central Park, near the fountain",
                "date_lost": "2026-07-01T10:00:00"
            }
        }


class LostItemUpdateRequest(BaseModel):
    """Request to update a lost item."""
    item_name: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, min_length=5)
    location: Optional[str] = Field(None, min_length=2, max_length=500)
    date_lost: Optional[datetime] = None
    status: Optional[str] = None


class LostItemResponse(BaseModel):
    """Lost item response."""
    id: str
    user_id: str
    item_name: str
    description: str
    location: str
    date_lost: datetime
    image_url: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LostItemListResponse(BaseModel):
    """Paginated list of lost items."""
    items: List[LostItemResponse]
    total: int
    page: int
    limit: int
    pages: int
