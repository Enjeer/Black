from backend.services.intent_router import detect_intent
from backend.services.llama import stream_chat


def handle_chat(messages, hf_api_key, model_name):
    last_user_message = messages[-1]["content"]

    intent = detect_intent(last_user_message, hf_api_key)

    if intent["intent"] != "chat" and intent["confidence"] > 0.6:
        yield f"<command intent='{intent['intent']}'>"
        return

    yield from stream_chat(messages, hf_api_key, model_name)
