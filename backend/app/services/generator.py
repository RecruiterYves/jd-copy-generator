"""LLM-based copy generation service.

Orchestrates provider selection, prompt assembly, LLM invocation,
and usage tracking for the three supported platforms.
"""

from fastapi import HTTPException

from app.models.schemas import GenerateRequest, GenerateResponse, UsageInfo
from app.services.llm import (
    LLMConfig,
    AuthenticationError,
    ProviderError,
    RateLimitError,
    create_provider,
)
from app.services.prompts import tg, red, linkedin

# ---------------------------------------------------------------------------
# Platform dispatch tables
# ---------------------------------------------------------------------------
_PROMPTS = {
    "tg": tg,
    "red": red,
    "linkedin": linkedin,
}


class GeneratorService:
    """Stateless service that generates platform-specific job-ad copy."""

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def generate(self, request: GenerateRequest) -> GenerateResponse:
        """Run the full generation pipeline for a single request.

        Raises:
            HTTPException: 400 on empty texts, 401 on bad auth, 429 on
                rate-limit, 502 on upstream provider errors.
        """
        self._validate_texts(request.texts)
        prompts = _PROMPTS[request.platform]
        provider = create_provider(request.provider)

        # Build prompts — Telegram supports multi-JD, others single-JD
        if request.platform == "tg":
            system = prompts.system_prompt()
            user = prompts.user_prompt(request.texts)
        else:
            # red / linkedin — use the first text (or iterate per-JD in future)
            system = prompts.system_prompt()
            user = prompts.user_prompt(request.texts[0])

        config = LLMConfig(
            api_key=request.api_key,
            model=request.model,
            temperature=request.temperature if request.temperature is not None else 0.7,
        )

        try:
            result = await provider.generate(system, user, config)
        except AuthenticationError as exc:
            raise HTTPException(
                status_code=401,
                detail=f"LLM authentication failed: {exc}",
            ) from exc
        except RateLimitError as exc:
            raise HTTPException(
                status_code=429,
                detail=f"LLM rate limit exceeded: {exc}",
            ) from exc
        except ProviderError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"LLM provider error: {exc}",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {exc}",
            ) from exc

        cost = provider.cost_estimate(result.input_tokens, result.output_tokens)

        return GenerateResponse(
            platform=request.platform,
            content=result.content,
            usage=UsageInfo(
                input_tokens=result.input_tokens,
                output_tokens=result.output_tokens,
                cost_estimate_usd=cost,
            ),
            model_used=result.model,
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _validate_texts(texts: list[str]) -> None:
        """Reject requests with empty or whitespace-only texts.

        Raises:
            HTTPException(400): If any text is empty or all-whitespace.
        """
        for i, text in enumerate(texts):
            if not text or not text.strip():
                raise HTTPException(
                    status_code=400,
                    detail=f"Text at index {i} is empty or contains only whitespace.",
                )
