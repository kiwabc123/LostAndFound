from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    app_name: str = "Lost & Found API"
    app_version: str = "1.0.0"
    debug_mode: bool = False
    
    # Database
    database_url: str
    
    # JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    jwt_refresh_expiration_days: int = 7
    
    # MinIO
    minio_endpoint: str
    minio_access_key: str
    minio_secret_key: str
    
    # SMTP
    smtp_server: str
    smtp_port: int = 587
    smtp_user: str
    smtp_password: str
    smtp_from_email: str
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

settings = get_settings()
