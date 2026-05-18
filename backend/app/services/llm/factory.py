"""Provider factory — returns the correct LLMProvider for a given name."""

from app.services.llm.base import LLMProvider


def create_provider(name: str) -> LLMProvider:
    """Return an LLMProvider instance for the given provider name.

    Args:
        name: One of "claude", "anthropic", "openai", or "deepseek" (case-insensitive).

    Returns:
        An LLMProvider subclass instance.

    Raises:
        ValueError: If the provider name is not recognised.
    """
    match name.lower():
        case "claude" | "anthropic":
            from app.services.llm.claude_provider import ClaudeProvider
            return ClaudeProvider()
        case "openai":
            from app.services.llm.openai_provider import OpenAIProvider
            return OpenAIProvider()
        case "deepseek":
            from app.services.llm.deepseek_provider import DeepSeekProvider
            return DeepSeekProvider()
        case _:
            raise ValueError(f"Unknown provider: {name}")
