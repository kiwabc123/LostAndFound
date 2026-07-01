"""Authentication API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db_session
from app.models import User
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    LoginResponse,
    UserResponse,
    TokenResponse,
)
from app.services.auth import auth_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: UserRegisterRequest,
    db: AsyncSession = Depends(get_db_session),
) -> LoginResponse:
    """
    Register a new user.
    
    - **username**: Unique username (3-50 chars)
    - **email**: Unique email address
    - **password**: Password (min 8 chars)
    
    Returns user and JWT tokens.
    """
    
    # Check if username exists
    result = await db.execute(select(User).where(User.username == request.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered"
        )
    
    # Check if email exists
    result = await db.execute(select(User).where(User.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        username=request.username,
        email=request.email,
        password_hash=auth_service.hash_password(request.password),
        role="user",
        is_active=True,
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    logger.info(f"User registered: {user.username} ({user.email})")
    
    # Generate tokens
    access_token, expires_in = auth_service.create_access_token(user.id)
    refresh_token, _ = auth_service.create_refresh_token(user.id)
    
    return LoginResponse(
        user=UserResponse.model_validate(user),
        token=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in,
        )
    )


@router.post("/login", response_model=LoginResponse)
async def login(
    request: UserLoginRequest,
    db: AsyncSession = Depends(get_db_session),
) -> LoginResponse:
    """
    Login with username/email and password.
    
    Returns user and JWT tokens.
    """
    
    # Find user by username or email
    result = await db.execute(
        select(User).where(
            (User.username == request.username) | (User.email == request.username)
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not auth_service.verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    logger.info(f"User logged in: {user.username}")
    
    # Generate tokens
    access_token, expires_in = auth_service.create_access_token(user.id)
    refresh_token, _ = auth_service.create_refresh_token(user.id)
    
    return LoginResponse(
        user=UserResponse.model_validate(user),
        token=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in,
        )
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    refresh_token: str,
    db: AsyncSession = Depends(get_db_session),
) -> TokenResponse:
    """
    Refresh access token using refresh token.
    
    - **refresh_token**: Valid refresh token
    
    Returns new access token.
    """
    
    # Verify refresh token
    user_id = auth_service.verify_token(refresh_token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify user exists and is active
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate new access token
    access_token, expires_in = auth_service.create_access_token(user.id)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,  # Return same refresh token
        expires_in=expires_in,
    )
