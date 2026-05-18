"""Platform-specific prompt templates.

Each module exposes a ``system_prompt()`` function (returns the
system-level instruction string) and a ``user_prompt(jd_text|jd_texts)``
function (builds the user-content prompt from one or more JD texts).
"""

from app.services.prompts import tg, red, linkedin

__all__ = ["tg", "red", "linkedin"]
