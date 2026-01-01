import os
import json
import re
from openai import OpenAI
from dotenv import load_dotenv
from typing import Optional, Dict

load_dotenv()
hf_key = os.getenv("HF_API")

# ⚡ Реально маленькая и быстрая модель
INTENT_MODEL = "katanemo/Arch-Router-1.5B"


# ---------- 1. RULE-BASED FAST CHECK ----------
def fast_intent_check(text: str) -> Optional[Dict]:
    t = text.lower().strip()

    # Application launch
    if re.search(r"\b(открой|запусти|включи)\b", t):
        applications = {
            "browser": ["браузер", "chrome", "firefox", "edge"],
            "telegram": ["телеграм", "telegram"],
            "discord": ["дискорд", "discord"],
            "explorer": ["проводник", "файлы"],
            "settings": ["настройки", "параметры"],
        }

        for app, keywords in applications.items():
            if any(keyword in t for keyword in keywords):
                return {
                    "intent": "launch",
                    "app": app,
                    "confidence": 0.98,
                }

        return {
            "intent": "launch",
            "confidence": 0.85,
        }

    # Browser tab control
    if re.search(r"\b(вкладк|tab|страниц)\b", t):
        if re.search(r"\b(нов|созд)\b", t):
            return {"intent": "browser_tab", "action": "new", "confidence": 0.95}
        if re.search(r"\b(закр)\b", t):
            return {"intent": "browser_tab", "action": "close", "confidence": 0.95}
        if re.search(r"\b(след)\b", t):
            return {"intent": "browser_tab", "action": "next", "confidence": 0.90}
        if re.search(r"\b(пред)\b", t):
            return {"intent": "browser_tab", "action": "prev", "confidence": 0.90}

    # Media control
    if re.search(r"\b(музык|песн|трек|плейлист)\b", t):
        if re.search(r"\b(включ|play)\b", t):
            return {"intent": "music", "action": "play", "confidence": 0.95}
        if re.search(r"\b(пауза|pause)\b", t):
            return {"intent": "music", "action": "pause", "confidence": 0.95}
        if re.search(r"\b(след|next)\b", t):
            return {"intent": "music", "action": "next", "confidence": 0.90}
        if re.search(r"\b(пред|previous)\b", t):
            return {"intent": "music", "action": "prev", "confidence": 0.90}

        return {
            "intent": "music",
            "confidence": 0.85,
        }

    # System volume control
    if re.search(r"\b(громче|тише|звук|volume)\b", t):
        if "громче" in t:
            return {"intent": "volume", "action": "up", "confidence": 0.95}
        if "тише" in t:
            return {"intent": "volume", "action": "down", "confidence": 0.95}
        if re.search(r"\b(выкл|mute)\b", t):
            return {"intent": "volume", "action": "mute", "confidence": 0.95}

    # Screen brightness control
    if re.search(r"\b(яркост|экран)\b", t):
        if re.search(r"\b(увелич|выше)\b", t):
            return {"intent": "brightness", "action": "up", "confidence": 0.95}
        if re.search(r"\b(уменьш|ниже)\b", t):
            return {"intent": "brightness", "action": "down", "confidence": 0.95}

    return None


# ---------- 2. TINY LLM CLASSIFIER ----------
def llm_intent_check(text: str, hf_api_key: str) -> dict:
    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=hf_api_key
    )

    completion = client.chat.completions.create(
        model=INTENT_MODEL,
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": """
Ты классификатор команд.
Верни ТОЛЬКО JSON без пояснений.

Формат:
{"intent":"chat|launch|music|unknown","confidence":0.0}
"""
            },
            {"role": "user", "content": text}
        ]
    )

    return json.loads(completion.choices[0].message.content)


# ---------- MAIN ENTRY ----------
def detect_intent(text: str, hf_api_key: str = None) -> dict:
    print(f"[INTENT] incoming: {text}")

    # 1️⃣ Супер быстрый чек
    fast = fast_intent_check(text)
    if fast:
        print(f"[INTENT] fast matched: {fast}")
        return fast

    # 2️⃣ LLM чек
    if hf_api_key is None:
        return {"intent": "chat", "confidence": 0.0}

    try:
        result = llm_intent_check(text, hf_api_key)
        print(f"[INTENT] llm result: {result}")
        return result
    except Exception as e:
        print("[INTENT] error:", e)
        return {"intent": "chat", "confidence": 0.0}
