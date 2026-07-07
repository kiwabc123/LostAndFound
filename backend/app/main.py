"""FastAPI application factory."""

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.exceptions import ApplicationException
from app.database import init_db
from app.routes import auth, lost_items, found_items, matches

# Configure logging
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="AI Lost & Found System Backend API",
        redirect_slashes=False,
    )

    # Normalize trailing slashes internally for API collection routes only.
    # Only applies to 2-segment paths like /api/lost-items, not detail paths like /api/lost-items/{id}
    @app.middleware("http")
    async def normalize_trailing_slash(request: Request, call_next):
        path = request.scope["path"]
        segments = [s for s in path.split("/") if s]  # non-empty segments
        is_collection = (
            len(segments) == 2          # e.g. ['api', 'lost-items']
            and not path.endswith("/")
            and segments[0] == "api"
            and segments[1] != "auth"   # auth routes have no trailing slash
        )
        if is_collection:
            request.scope["path"] = path + "/"
        return await call_next(request)

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
    app.include_router(found_items.router, prefix="/api")
    app.include_router(matches.router, prefix="/api")
    
    logger.info(f"FastAPI application '{settings.app_name}' initialized")
    return app

app = create_app()
