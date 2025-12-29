from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from services.ollama import stream_chat

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("")
def chat(data: dict):
    message = data.get("message", "")

    return StreamingResponse(
        stream_chat(message),
        media_type="text/plain"
    )
