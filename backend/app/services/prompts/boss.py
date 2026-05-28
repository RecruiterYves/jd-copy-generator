"""System and user prompts for Boss Zhipin JD compliance rewriting."""

from typing import List


def system_prompt() -> str:
    """Return the system-level instruction for Boss sensitive-term rewriting."""
    return (
        "你是一名熟悉Boss直聘平台招聘内容规范的HR文案审核专家。\n\n"
        "任务要求：\n"
        "1. 根据提供的敏感词列表，删除、替换或弱化JD中的敏感表达。\n"
        "2. 不改变JD的岗位职责、任职要求、薪酬地点等核心意思。\n"
        "3. 保持原有结构和信息完整度，必要时润色上下文使语义自然顺畅。\n"
        "4. 不要新增原JD没有的信息，不要扩写成营销文案。\n"
        "5. 只输出处理后的JD正文，不要输出解释、标注、分析或敏感词清单。"
    )


def user_prompt(jd_text: str, sensitive_terms: List[str]) -> str:
    """Build a user prompt containing one JD and its sensitive terms."""
    terms = "、".join(sensitive_terms)
    return (
        f"敏感词列表：{terms}\n\n"
        "请处理以下JD，使其适合发布到Boss直聘：\n\n"
        f"{jd_text}"
    )
