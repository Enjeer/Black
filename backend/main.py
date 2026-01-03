import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from backend.services.voice_input import (
    start_voice,
    enable_listen_once,
    voice_queue,
)
from backend.services.voice_state import state_queue
from backend.api.chat import router as chat_router
from backend.services.voice_input import llm_done


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
    threading.Thread(
        target=start_voice,
        daemon=True
    ).start()


@app.post("/enable-voice")
def enable_voice():
    ok = enable_listen_once()
    return {"status": "ok" if ok else "blocked"}

@app.post("/disable-voice")
def disable_voice():
    llm_done()  # переводим состояние в idle
    return {"status": "idle"}

@app.get("/stream-voice")
def stream_voice():
    def gen():
        while True:
            text = voice_queue.get()
            yield f"data: {text}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")


@app.get("/stream-voice-state")
def stream_voice_state():
    def gen():
        while True:
            state = state_queue.get()
            yield f"data: {state}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")
