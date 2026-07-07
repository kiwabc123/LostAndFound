"""Found items CRUD API routes."""

import math
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db_session
from app.models import FoundItem, User
from app.dependencies import get_current_user, require_staff
from app.schemas.found_item import (
    FoundItemCreateRequest,
    FoundItemUpdateRequest,
    FoundItemResponse,
    FoundItemListResponse,
)

router = APIRouter(prefix="/found-items", tags=["Found Items"])


@router.post("/", response_model=FoundItemResponse, status_code=status.HTTP_201_CREATED)
async def create_found_item(
    request: FoundItemCreateRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_staff),
) -> FoundItemResponse:
    """Record a new found item (staff/admin only)."""
    item = FoundItem(
        id=str(uuid.uuid4()),
        staff_id=current_user.id,
        item_name=request.item_name,
        description=request.description,
        location=request.location,
        date_found=request.date_found.replace(tzinfo=None),
        status="found",
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return FoundItemResponse.model_validate(item)


@router.get("/", response_model=FoundItemListResponse)
async def list_found_items(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=100),
    status: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> FoundItemListResponse:
    """List all found items (visible to all authenticated users)."""
    query = select(FoundItem)

    if status:
        query = query.where(FoundItem.status == status)

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar_one()

    offset = (page - 1) * limit
    result = await db.execute(
        query.order_by(FoundItem.created_at.desc()).offset(offset).limit(limit)
    )
    items = result.scalars().all()

    return FoundItemListResponse(
        items=[FoundItemResponse.model_validate(i) for i in items],
        total=total,
        page=page,
        limit=limit,
        pages=math.ceil(total / limit) if total > 0 else 0,
    )


@router.get("/{item_id}", response_model=FoundItemResponse)
async def get_found_item(
    item_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> FoundItemResponse:
    """Get a specific found item by ID."""
    result = await db.execute(select(FoundItem).where(FoundItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Found item not found")
    return FoundItemResponse.model_validate(item)


@router.put("/{item_id}", response_model=FoundItemResponse)
async def update_found_item(
    item_id: str,
    request: FoundItemUpdateRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_staff),
) -> FoundItemResponse:
    """Update a found item (staff/admin only)."""
    result = await db.execute(select(FoundItem).where(FoundItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Found item not found")

    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    await db.commit()
    await db.refresh(item)
    return FoundItemResponse.model_validate(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_found_item(
    item_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(require_staff),
) -> None:
    """Delete a found item (staff/admin only)."""
    result = await db.execute(select(FoundItem).where(FoundItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Found item not found")

    await db.delete(item)
    await db.commit()
