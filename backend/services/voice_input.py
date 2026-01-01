from queue import Queue
from RealtimeSTT import AudioToTextRecorder

broadcast_enabled = False
voice_queue = Queue()  # очередь для SSE

def enable_broadcast():
    global broadcast_enabled
    broadcast_enabled = True
    print("[VOICE] Broadcast enabled")

def on_voice_text(text: str):
    print("Recognized:", text)
    if broadcast_enabled:
        voice_queue.put(text)  # добавляем текст в очередь

def start_voice():
    recorder = AudioToTextRecorder(
        language="ru",
        model="small",
        compute_type="int8",
        device="cpu"
    )

    print("[VOICE] listening...")
    while True:
        recorder.text(on_voice_text)
