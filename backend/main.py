import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from backend.services.voice_input import start_voice, enable_broadcast, voice_queue
from backend.api.chat import router as chat_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat_router)

@app.on_event("startup")
def startup_event():
    # стартуем поток распознавания
    threading.Thread(target=start_voice, daemon=True).start()

@app.post("/enable-voice")
def enable_voice_endpoint():
    enable_broadcast()
    return {"status": "broadcast enabled"}


@app.get("/stream-voice")
def stream_voice():
    """
    SSE endpoint: фронт подключается и получает поток распознанного текста
    """

    def event_generator():
        while True:
            text = voice_queue.get()  # блокирует до появления текста
            yield f"data: {text}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
