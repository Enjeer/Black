from ollamafreeapi import OllamaFreeAPI
from typing import Generator

client = OllamaFreeAPI()

def stream_chat(
    prompt: str,
    model: str = "llama3.3:70b"
) -> Generator[str, None, None]:
    """
    Stream response from Ollama
    """
    for chunk in client.stream_chat(model, prompt):
        yield chunk
