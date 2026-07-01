"""Authentication service for user management and JWT tokens."""

from datetime import datetime, timedelta
from typing import Optional, Tuple
from passlib.context import CryptContext
from jose import JWTError, jwt
from app.config import settings
from app.models import User

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service for authentication operations."""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt."""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash."""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None) -> Tuple[str, int]:
        """
        Create JWT access token.
        
        Returns:
            Tuple of (token, expires_in_seconds)
        """
        if expires_delta is None:
            expires_delta = timedelta(hours=settings.jwt_expiration_hours)
        
        expire = datetime.utcnow() + expires_delta
        to_encode = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access"
        }
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm
        )
        
        expires_in = int(expires_delta.total_seconds())
        return encoded_jwt, expires_in
    
    @staticmethod
    def create_refresh_token(user_id: str, expires_delta: Optional[timedelta] = None) -> Tuple[str, int]:
        """
        Create JWT refresh token (longer expiration).
        
        Returns:
            Tuple of (token, expires_in_seconds)
        """
        if expires_delta is None:
            expires_delta = timedelta(days=7)  # 7 days for refresh token
        
        expire = datetime.utcnow() + expires_delta
        to_encode = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh"
        }
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm
        )
        
        expires_in = int(expires_delta.total_seconds())
        return encoded_jwt, expires_in
    
    @staticmethod
    def verify_token(token: str) -> Optional[str]:
        """
        Verify JWT token and return user_id.
        
        Returns:
            user_id if valid, None if invalid
        """
        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm]
            )
            user_id: str = payload.get("sub")
            if user_id is None:
                return None
            return user_id
        except JWTError:
            return None


# Create singleton instance
auth_service = AuthService()
