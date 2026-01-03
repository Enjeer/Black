from backend.services.intent_router import detect_intent
from backend.services.command_exec import execute_command

def handle_text(text: str, hf_api_key: str = None) -> str:
    intent_data = detect_intent(text, hf_api_key)

    intent = intent_data.get("intent", "unknown")

    # Всё остальное — payload
    payload = {k: v for k, v in intent_data.items() if k != "intent"}

    print(f"[ROUTER] intent={intent} payload={payload}")

    return execute_command(intent, payload)