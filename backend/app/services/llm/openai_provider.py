"""OpenAI LLM provider implementation."""

from openai import (
    AsyncOpenAI,
    APIError,
    AuthenticationError as OpenAIAuthError,
    RateLimitError as OpenAIRateLimitError,
)

from app.services.llm.base import (
    LLMConfig,
    LLMProvider,
    LLMResponse,
    AuthenticationError,
    ProviderError,
    RateLimitError,
)


class OpenAIProvider(LLMProvider):
    """LLM provider backed by OpenAI's models (GPT-4o, etc.)."""

    @property
    def provider_name(self) -> str:
        return "openai"

    @property
    def default_model(self) -> str:
        return "gpt-4o"

    def cost_estimate(self, input_tokens: int, output_tokens: int) -> float:
        """GPT-4o pricing: $2.50 / 1M input tokens, $10 / 1M output tokens."""
        input_cost = (input_tokens / 1_000_000) * 2.5
        output_cost = (output_tokens / 1_000_000) * 10.0
        return round(input_cost + output_cost, 6)

    async def generate(
        self, system_prompt: str, user_prompt: str, config: LLMConfig
    ) -> LLMResponse:
        client = AsyncOpenAI(api_key=config.api_key)
        model = config.model or self.default_model

        try:
            response = await client.chat.completions.create(
                model=model,
                max_tokens=config.max_tokens,
                temperature=config.temperature,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            )
        except OpenAIAuthError as exc:
            raise AuthenticationError(str(exc)) from exc
        except OpenAIRateLimitError as exc:
            raise RateLimitError(str(exc)) from exc
        except APIError as exc:
            raise ProviderError(str(exc)) from exc
        except Exception as exc:
            raise ProviderError(f"Provider network/unexpected error: {exc}") from exc

        choice = response.choices[0]
        return LLMResponse(
            content=choice.message.content or "",
            input_tokens=response.usage.prompt_tokens if response.usage else 0,
            output_tokens=response.usage.completion_tokens if response.usage else 0,
            model=response.model,
        )
