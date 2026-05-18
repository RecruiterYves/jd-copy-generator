"""Generate router — produces platform-specific copy from parsed job descriptions."""

from fastapi import APIRouter

from app.models.schemas import ErrorResponse, GenerateRequest, GenerateResponse
from app.services.generator import GeneratorService

router = APIRouter(prefix="/api", tags=["generate"])

# Single shared service instance (stateless, safe to reuse).
_generator = GeneratorService()


@router.post(
    "/generate",
    response_model=GenerateResponse,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
    },
)
async def generate_copy(request: GenerateRequest) -> GenerateResponse:
    """Generate platform-specific job ad copy from source texts.

    Supports three target platforms (tg, red, linkedin) and two LLM
    providers (claude, openai).  The caller must supply a valid API key
    for the chosen provider.
    """
    return await _generator.generate(request)
