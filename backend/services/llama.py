import os
from openai import OpenAI
from typing import List, Dict, Generator
import re
from dotenv import load_dotenv

load_dotenv()
hf_key = os.getenv("HF_API")


def clean_think_tags(text: str) -> str:
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)
    text = re.sub(r"\**\*", "", text, flags=re.DOTALL)
    return text.strip()


def stream_chat(
    messages: List[Dict],
    hf_api_key: str = None,
    model_name: str = "HuggingFaceTB/SmolLM3-3B:hf-inference"
) -> Generator[str, None, None]:

    if hf_api_key is None:
        hf_api_key = hf_key
        if hf_api_key is None:
            yield "HF API key не задан"
            return

    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=hf_api_key
    )

    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=0.7
        )

        text = completion.choices[0].message.content
        text = clean_think_tags(text)

    except Exception as e:
        yield f"Ошибка соединения с Hugging Face API: {e}"
        return

    yield text
