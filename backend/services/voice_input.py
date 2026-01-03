from queue import Queue
from RealtimeSTT import AudioToTextRecorder

from backend.services.voice_state import (
    VoiceState,
    get_state,
    set_state,
)

WAKE_WORD = "привет, фин"

voice_queue = Queue()


def enable_listen_once():
    if get_state() != VoiceState.IDLE:
        print("[VOICE] enable rejected: busy")
        return False

    set_state(VoiceState.LISTENING)
    return True


def llm_done():
    set_state(VoiceState.IDLE)


def on_voice_text(text: str):
    text = text.strip().lower()
    state = get_state()

    # 💤 IDLE → ждём wake-word
    if state == VoiceState.IDLE:
        if WAKE_WORD in text:
            print("[VOICE] wake-word detected")
            set_state(VoiceState.LISTENING)
        return

    # 🎧 LISTENING → одна команда
    if state == VoiceState.LISTENING:
        if len(text) < 3:
            return

        print("[VOICE] command:", text)

        set_state(VoiceState.WAITING_LLM)
        voice_queue.put(text)


def start_voice():
    recorder = AudioToTextRecorder(
        language="ru",
        model="small",
        compute_type="int8",
        device="cpu"
    )

    print("[VOICE] listening thread started")

    while True:
        recorder.text(on_voice_text)
