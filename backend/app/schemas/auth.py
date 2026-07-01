"""Authentication schemas for request/response validation."""

import datetime

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserRegisterRequest(BaseModel):
    """User registration request."""
    username: str = Field(..., min_length=3, max_length=50, description="Username")
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., min_length=8, description="Password (min 8 chars)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "john_doe",
                "email": "john@example.com",
                "password": "securepassword123"
            }
        }


class UserLoginRequest(BaseModel):
    """User login request."""
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="Password")
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "john_doe",
                "password": "securepassword123"
            }
        }


class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str = Field(..., description="Access token")
    refresh_token: str = Field(..., description="Refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration in seconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGc...",
                "refresh_token": "eyJhbGc...",
                "token_type": "bearer",
                "expires_in": 86400
            }
        }


class UserResponse(BaseModel):
    """User response (without password)."""
    id: str = Field(..., description="User ID")
    username: str = Field(..., description="Username")
    email: str = Field(..., description="Email")
    role: str = Field(..., description="User role")
    is_active: bool = Field(..., description="Is active")
    created_at: datetime.datetime = Field(..., description="Created at")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "username": "john_doe",
                "email": "john@example.com",
                "role": "user",
                "is_active": True,
                "created_at": "2026-06-23T10:00:00"
            }
        }


class LoginResponse(BaseModel):
    """Login response with token and user."""
    user: UserResponse = Field(..., description="User data")
    token: TokenResponse = Field(..., description="JWT tokens")
