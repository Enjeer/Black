from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import os

from backend.services.chat_core import handle_chat
from backend.services.voice_input import llm_done


hf_api = os.getenv("HF_API")

router = APIRouter(prefix="/chat", tags=["chat"])


def stream_with_unlock(generator):
    for chunk in generator:
        if chunk:
            yield chunk


@router.post("/")
async def chat(request: Request):
    data = await request.json()

    messages = data.get("messages", [])
    hf_api_key = data.get("api_key", hf_api)
    model_name = data.get(
        "model_name",
        "HuggingFaceTB/SmolLM3-3B:hf-inference"
    )

    if not messages:
        return StreamingResponse(iter([""]), media_type="text/plain")

    gen = handle_chat(messages, hf_api_key, model_name)

    return StreamingResponse(
        stream_with_unlock(gen),
        media_type="text/plain"
    )
