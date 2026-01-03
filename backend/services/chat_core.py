from backend.services.intent_router import detect_intent
from backend.services.llama import stream_chat
from backend.services.voice_state import (
    get_state,
    set_state,
    VoiceState,
)


def handle_chat(messages, hf_api_key, model_name):
    """
    Generator:
    - блокирует повторные вызовы
    - определяет intent
    - либо отдаёт команду
    - либо стримит LLM
    """

    # ❌ если LLM уже думает — НИЧЕГО не делаем
    if get_state() == VoiceState.WAITING_LLM:
        print("[CHAT] blocked: LLM busy")
        yield ""
        return

    set_state(VoiceState.WAITING_LLM)

    last_user_message = messages[-1]["content"]

    intent = detect_intent(last_user_message, hf_api_key)

    # 🎯 Команда
    if intent["intent"] != "chat" and intent.get("confidence", 0) > 0.6:
        yield f"<command intent='{intent['intent']}'>"
        set_state(VoiceState.IDLE)
        return

    # 💬 Обычный чат
    try:
        yield from stream_chat(messages, hf_api_key, model_name)
    finally:
        set_state(VoiceState.IDLE)
