"""Schemas for match responses."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class MatchResponse(BaseModel):
    """Match response schema."""
    id: str
    lost_item_id: str
    found_item_id: str
    image_score: Optional[float] = None
    text_score: Optional[float] = None
    combined_score: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MatchListResponse(BaseModel):
    """Paginated list of matches."""
    items: List[MatchResponse]
    total: int
    page: int
    limit: int
    pages: int
