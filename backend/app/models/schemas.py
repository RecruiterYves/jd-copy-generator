from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class ParsedDocument(BaseModel):
    """Result of parsing a single uploaded document."""
    filename: str
    text: str
    char_count: int
    parse_time_ms: float


class UploadResponse(BaseModel):
    """Response from the file upload endpoint."""
    results: List[ParsedDocument] = Field(default_factory=list)
    total_chars: int = 0
    errors: List[dict] = Field(default_factory=list)


class GenerateRequest(BaseModel):
    """Request to generate copy from parsed job descriptions."""
    platform: Literal["tg", "red", "linkedin"] = Field(
        ...,
        description="Target platform: tg (Telegram), red (Reddit/Xiaohongshu), linkedin (LinkedIn)",
    )
    texts: List[str] = Field(
        ...,
        min_length=1,
        description="List of source texts (parsed JDs) to generate copy from",
    )
    provider: Literal["claude", "openai", "deepseek"] = Field(
        ...,
        description="LLM provider to use for generation",
    )
    api_key: str = Field(
        ...,
        min_length=1,
        description="API key for the LLM provider",
    )
    model: Optional[str] = Field(
        default=None,
        description="Specific model name (e.g. claude-sonnet-4-20250514, gpt-4o). Provider default used if unset.",
    )
    temperature: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=2.0,
        description="Sampling temperature (0.0 to 2.0). Provider default used if unset.",
    )


class UsageInfo(BaseModel):
    """Token usage and cost estimate for a generation."""
    input_tokens: int = 0
    output_tokens: int = 0
    cost_estimate_usd: float = 0.0


class GenerateResponse(BaseModel):
    """Response from the generate endpoint."""
    platform: Literal["tg", "red", "linkedin"]
    content: str
    usage: UsageInfo = Field(default_factory=UsageInfo)
    model_used: str


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "ok"
    version: str = "0.1.0"


class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    error_code: Optional[str] = None
