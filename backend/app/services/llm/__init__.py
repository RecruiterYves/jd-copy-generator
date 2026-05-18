"""LLM provider abstraction layer.

Exposes the base types, concrete providers, and the factory function.
Provider imports are lazy so that a missing optional SDK (e.g. anthropic)
does not prevent other providers from being used.
"""

from app.services.llm.base import (
    LLMConfig,
    LLMProvider,
    LLMResponse,
    AuthenticationError,
    ProviderError,
    RateLimitError,
)
from app.services.llm.factory import create_provider

__all__ = [
    "LLMConfig",
    "LLMProvider",
    "LLMResponse",
    "AuthenticationError",
    "ProviderError",
    "RateLimitError",
    "create_provider",
]
