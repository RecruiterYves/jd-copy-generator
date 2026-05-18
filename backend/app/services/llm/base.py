"""LLM provider abstract base class and shared data types."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class LLMResponse:
    """Normalised response from any LLM provider."""

    content: str
    input_tokens: int
    output_tokens: int
    model: str


@dataclass
class LLMConfig:
    """Provider-agnostic configuration for an LLM call."""

    api_key: str
    model: Optional[str] = None
    temperature: float = 0.7
    max_tokens: int = 4096


class LLMProvider(ABC):
    """Abstract interface that every LLM provider must implement."""

    @abstractmethod
    async def generate(
        self, system_prompt: str, user_prompt: str, config: LLMConfig
    ) -> LLMResponse:
        """Generate a completion from the provider."""
        ...

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Human-readable provider identifier (e.g. 'claude', 'openai')."""
        ...

    @property
    @abstractmethod
    def default_model(self) -> str:
        """Model name used when config.model is None."""
        ...

    @abstractmethod
    def cost_estimate(self, input_tokens: int, output_tokens: int) -> float:
        """Estimated USD cost for the given token counts."""
        ...


class ProviderError(Exception):
    """Base exception for provider-related failures."""


class AuthenticationError(ProviderError):
    """API key is missing, expired, or invalid."""


class RateLimitError(ProviderError):
    """Provider rate limit has been exceeded."""
