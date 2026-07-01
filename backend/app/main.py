"""FastAPI application factory."""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.exceptions import ApplicationException
from app.database import init_db
from app.routes import auth, lost_items

# Configure logging
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="AI Lost & Found System Backend API",
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if settings.debug_mode else ["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Exception handlers
    @app.exception_handler(ApplicationException)
    async def application_exception_handler(request, exc: ApplicationException):
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)},
        )
    
    # Startup event
    @app.on_event("startup")
    async def startup_event():
        """Initialize database on startup."""
        logger.info("Initializing database schema...")
        await init_db()
        logger.info("Database schema initialized successfully")
    
    # Health check endpoint
    @app.get("/health", tags=["Health"])
    async def health_check():
        """Health check endpoint."""
        return {
            "status": "healthy",
            "app": settings.app_name,
            "version": settings.app_version,
        }
    
    # Include API routes
    app.include_router(auth.router, prefix="/api")
    app.include_router(lost_items.router, prefix="/api")
    
    logger.info(f"FastAPI application '{settings.app_name}' initialized")
    return app

app = create_app()
