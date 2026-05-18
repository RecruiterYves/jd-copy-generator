"""Claude (Anthropic) LLM provider implementation."""

from anthropic import (
    AsyncAnthropic,
    AuthenticationError as AnthropicAuthError,
    RateLimitError as AnthropicRateLimitError,
)

from app.services.llm.base import (
    LLMConfig,
    LLMProvider,
    LLMResponse,
    AuthenticationError,
    ProviderError,
    RateLimitError,
)


class ClaudeProvider(LLMProvider):
    """LLM provider backed by Anthropic's Claude models."""

    @property
    def provider_name(self) -> str:
        return "claude"

    @property
    def default_model(self) -> str:
        return "claude-sonnet-4-5-20250929"

    def cost_estimate(self, input_tokens: int, output_tokens: int) -> float:
        """Sonnet pricing: $3 / 1M input tokens, $15 / 1M output tokens."""
        input_cost = (input_tokens / 1_000_000) * 3.0
        output_cost = (output_tokens / 1_000_000) * 15.0
        return round(input_cost + output_cost, 6)

    async def generate(
        self, system_prompt: str, user_prompt: str, config: LLMConfig
    ) -> LLMResponse:
        client = AsyncAnthropic(api_key=config.api_key)
        model = config.model or self.default_model

        try:
            response = await client.messages.create(
                model=model,
                max_tokens=config.max_tokens,
                temperature=config.temperature,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )
        except AnthropicAuthError as exc:
            raise AuthenticationError(str(exc)) from exc
        except AnthropicRateLimitError as exc:
            raise RateLimitError(str(exc)) from exc
        except Exception as exc:
            raise ProviderError(str(exc)) from exc

        # Extract the first text block from the content array.
        content_text = ""
        for block in response.content:
            if hasattr(block, "text"):
                content_text += block.text

        return LLMResponse(
            content=content_text,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
            model=response.model,
        )
