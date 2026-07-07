"""Lost items CRUD API routes."""

import math
import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db_session
from app.models import LostItem, User
from app.dependencies import get_current_user
from app.schemas.lost_item import (
    LostItemCreateRequest,
    LostItemUpdateRequest,
    LostItemResponse,
    LostItemListResponse,
)

router = APIRouter(prefix="/lost-items", tags=["Lost Items"])


@router.post("/", response_model=LostItemResponse, status_code=status.HTTP_201_CREATED)
async def create_lost_item(
    request: LostItemCreateRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> LostItemResponse:
    """Report a new lost item."""
    item = LostItem(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        item_name=request.item_name,
        description=request.description,
        location=request.location,
        date_lost=request.date_lost.replace(tzinfo=None),
        status="lost",
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return LostItemResponse.model_validate(item)


@router.get("/", response_model=LostItemListResponse)
async def list_lost_items(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=100),
    status: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> LostItemListResponse:
    """List lost items. Users see their own; staff/admin see all."""
    query = select(LostItem)

    # Regular users only see their own items; staff/admin see all
    if current_user.role == "user":
        query = query.where(LostItem.user_id == current_user.id)

    if status:
        query = query.where(LostItem.status == status)

    # Count total
    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    # Paginate
    offset = (page - 1) * limit
    result = await db.execute(query.order_by(LostItem.created_at.desc()).offset(offset).limit(limit))
    items = result.scalars().all()

    return LostItemListResponse(
        items=[LostItemResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        limit=limit,
        pages=math.ceil(total / limit) if total > 0 else 0,
    )


@router.get("/{item_id}", response_model=LostItemResponse)
async def get_lost_item(
    item_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> LostItemResponse:
    """Get a single lost item by ID."""
    result = await db.execute(select(LostItem).where(LostItem.id == item_id))
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lost item not found")

    # Users can only view their own items; staff/admin can view all
    if current_user.role == "user" and item.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return LostItemResponse.model_validate(item)


@router.put("/{item_id}", response_model=LostItemResponse)
async def update_lost_item(
    item_id: str,
    request: LostItemUpdateRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> LostItemResponse:
    """Update a lost item."""
    result = await db.execute(select(LostItem).where(LostItem.id == item_id))
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lost item not found")

    if item.user_id != current_user.id and current_user.role not in ("staff", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    item.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(item)
    return LostItemResponse.model_validate(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lost_item(
    item_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> None:
    """Delete a lost item."""
    result = await db.execute(select(LostItem).where(LostItem.id == item_id))
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lost item not found")

    if item.user_id != current_user.id and current_user.role not in ("staff", "admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    await db.delete(item)
    await db.commit()
