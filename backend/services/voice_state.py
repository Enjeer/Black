from enum import Enum
from threading import Lock
from queue import Queue


class VoiceState(Enum):
    IDLE = "idle"
    LISTENING = "listening"
    WAITING_LLM = "waiting"


_state = VoiceState.IDLE
_lock = Lock()

state_queue = Queue()


def get_state():
    with _lock:
        return _state


def set_state(new_state: VoiceState):
    global _state
    with _lock:
        if _state == new_state:
            return

        _state = new_state
        print(f"[VOICE STATE] -> {_state.value}")
        state_queue.put(_state.value)
