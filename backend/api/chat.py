from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from backend.services.chat_core import handle_chat
import os

hf_api = os.getenv("HF_API")

router = APIRouter(prefix="/chat", tags=["chat"])


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

    return StreamingResponse(
        handle_chat(messages, hf_api_key, model_name),
        media_type="text/plain"
    )
