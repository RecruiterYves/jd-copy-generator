from typing import List, Literal, Optional

from pydantic import BaseModel, Field, model_validator


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
    platform: Literal["tg", "red", "linkedin", "boss"] = Field(
        ...,
        description="Target platform: tg, red, linkedin, or boss",
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
    sensitive_terms: Optional[List[str]] = Field(
        default=None,
        description="Boss compliance sensitive terms to detect and rewrite around.",
    )

    @model_validator(mode="after")
    def require_api_key_for_llm_platforms(self) -> "GenerateRequest":
        """Boss local scans may skip AI; other platforms always need a key."""
        if self.platform != "boss" and not self.api_key.strip():
            raise ValueError("API key is required for this platform.")
        return self


class UsageInfo(BaseModel):
    """Token usage and cost estimate for a generation."""
    input_tokens: int = 0
    output_tokens: int = 0
    cost_estimate_usd: float = 0.0


class SensitiveMatch(BaseModel):
    """Sensitive term match summary for Boss compliance mode."""
    term: str
    count: int


class GenerateResponse(BaseModel):
    """Response from the generate endpoint."""
    platform: Literal["tg", "red", "linkedin", "boss"]
    content: str
    usage: UsageInfo = Field(default_factory=UsageInfo)
    model_used: str
    sensitive_matches: List[SensitiveMatch] = Field(default_factory=list)
    original_text: Optional[str] = None


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "ok"
    version: str = "0.1.0"


class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    error_code: Optional[str] = None
