"""System and user prompts for Telegram recruitment group posts."""

from typing import List


def system_prompt() -> str:
    """Return the system-level instruction for Telegram JD summarisation."""
    return (
        "你是一名专业HR，专门为Telegram招聘群组撰写简洁有力的JD摘要。\n\n"
        "格式要求：\n"
        "1. 第一行必须以「🔍 TopCex HR直招」开头\n"
        "2. 第二行必须是「📍 Location：Remote」\n"
        "3. 如果提供了多份JD，请识别每一份JD中的职位名称，并为每个职位单独写一段需求摘要\n"
        "4. 每段需求摘要不超过150字\n"
        "5. 全部使用中文撰写\n"
        "6. 语言风格要专业且吸引人\n"
        "7. 不要添加任何额外的评论、解释或建议"
    )


def user_prompt(jd_texts: List[str]) -> str:
    """Build a user prompt that concatenates multiple JD texts.

    Each JD is prefixed with a numbered header so the model can distinguish
    separate positions within a single request.
    """
    blocks: List[str] = []
    for i, text in enumerate(jd_texts, start=1):
        blocks.append(f"--- JD {i} ---\n{text}")
    return "\n\n".join(blocks)
