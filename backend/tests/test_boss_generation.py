import pytest

from app.models.schemas import GenerateRequest
from app.services.generator import GeneratorService
from app.services.llm.base import LLMResponse


@pytest.mark.asyncio
async def test_boss_without_matches_returns_original_without_provider(monkeypatch):
    def fail_create_provider(_name: str):
        raise AssertionError("Provider should not be created when Boss has no matches")

    monkeypatch.setattr("app.services.generator.create_provider", fail_create_provider)

    service = GeneratorService()
    response = await service.generate(
        GenerateRequest(
            platform="boss",
            texts=["负责后端服务开发，优化接口性能。"],
            provider="openai",
            api_key="",
            sensitive_terms=["USDT", "交易所"],
        )
    )

    assert response.content == "负责后端服务开发，优化接口性能。"
    assert response.model_used == "local-scan"
    assert response.usage.input_tokens == 0
    assert response.usage.output_tokens == 0
    assert response.sensitive_matches == []
    assert response.original_text == "负责后端服务开发，优化接口性能。"


@pytest.mark.asyncio
async def test_boss_with_matches_rewrites_with_provider(monkeypatch):
    captured = {}

    class FakeProvider:
        async def generate(self, system_prompt, user_prompt, config):
            captured["system_prompt"] = system_prompt
            captured["user_prompt"] = user_prompt
            captured["model"] = config.model
            return LLMResponse(
                content="负责业务平台服务开发，优化系统稳定性。",
                input_tokens=12,
                output_tokens=8,
                model="fake-model",
            )

        def cost_estimate(self, input_tokens, output_tokens):
            return 0.001

    monkeypatch.setattr("app.services.generator.create_provider", lambda _name: FakeProvider())

    service = GeneratorService()
    response = await service.generate(
        GenerateRequest(
            platform="boss",
            texts=["负责Crypto交易所后端服务开发，支持USDT相关业务。"],
            provider="openai",
            api_key="test-key",
            model="fake-model",
            sensitive_terms=["交易所", "USDT", "Crypto"],
        )
    )

    assert response.content == "负责业务平台服务开发，优化系统稳定性。"
    assert response.model_used == "fake-model"
    assert response.usage.cost_estimate_usd == 0.001
    assert [(m.term, m.count) for m in response.sensitive_matches] == [
        ("交易所", 1),
        ("USDT", 1),
        ("Crypto", 1),
    ]
    assert response.original_text == "负责Crypto交易所后端服务开发，支持USDT相关业务。"
    assert "交易所、USDT、Crypto" in captured["user_prompt"]
