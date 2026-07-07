"""Matches API routes."""

import math
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db_session
from app.models import Match, User
from app.dependencies import get_current_user
from app.schemas.match import MatchResponse, MatchListResponse

router = APIRouter(prefix="/matches", tags=["Matches"])


@router.get("/", response_model=MatchListResponse)
async def list_matches(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=100),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> MatchListResponse:
    """List matches. Users see matches for their lost items; staff/admin see all."""
    from app.models import LostItem

    query = select(Match)

    if current_user.role == "user":
        # Only matches related to the user's lost items
        user_lost_ids = select(LostItem.id).where(LostItem.user_id == current_user.id)
        query = query.where(Match.lost_item_id.in_(user_lost_ids))

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    offset = (page - 1) * limit
    result = await db.execute(
        query.order_by(Match.combined_score.desc()).offset(offset).limit(limit)
    )
    matches = result.scalars().all()

    return MatchListResponse(
        items=[MatchResponse.model_validate(m) for m in matches],
        total=total,
        page=page,
        limit=limit,
        pages=math.ceil(total / limit) if total > 0 else 0,
    )


@router.get("/{match_id}", response_model=MatchResponse)
async def get_match(
    match_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> MatchResponse:
    """Get a specific match by ID."""
    from app.models import LostItem
    from fastapi import HTTPException, status

    result = await db.execute(select(Match).where(Match.id == match_id))
    match = result.scalar_one_or_none()

    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")

    # Users can only view matches for their own lost items
    if current_user.role == "user":
        lost_result = await db.execute(
            select(LostItem).where(
                LostItem.id == match.lost_item_id,
                LostItem.user_id == current_user.id,
            )
        )
        if not lost_result.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return MatchResponse.model_validate(match)
