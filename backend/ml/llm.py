from ollamafreeapi import OllamaFreeAPI

client = OllamaFreeAPI()

# Stream responses in real-time
for chunk in client.stream_chat('llama3.3:70b', 'Tell me a story:'):
    print(chunk, end='', flush=True)