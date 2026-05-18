"""FastAPI application factory and CORS configuration."""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.models.schemas import HealthResponse
from app.routers import generate, upload

# Path to the frontend production build
FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"


def _format_validation_errors(detail: list) -> str:
    """Convert FastAPI validation error array to a single readable string."""
    parts = []
    for err in detail:
        loc = ".".join(str(p) for p in err.get("loc", []))
        msg = err.get("msg", "Validation error")
        parts.append(f"{loc}: {msg}" if loc else msg)
    return "; ".join(parts)


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="JD Copy Generator",
        description="Backend service that parses job descriptions and generates platform-specific job ad copy",
        version="0.1.0",
    )

    # Global exception handler: convert validation errors to string-format detail
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        _request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        errors = exc.errors()
        return JSONResponse(
            status_code=422,
            content={"detail": _format_validation_errors(errors)},
        )

    # Global exception handler: catch truly unexpected errors with full detail
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        _request: Request, exc: Exception
    ) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {exc}"},
        )

    # CORS — allow all origins during development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount routers
    app.include_router(upload.router)
    app.include_router(generate.router)

    # Health check
    @app.get("/api/health", response_model=HealthResponse)
    async def health_check() -> HealthResponse:
        """Return service health status."""
        return HealthResponse(status="ok", version="0.1.0")

    # Serve frontend static files in production
    if FRONTEND_DIST.exists():
        app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")

    return app


# Application instance for uvicorn
app = create_app()
