import threading
import time
import webview
import uvicorn


def start_api():
    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )


if __name__ == "__main__":
    api_thread = threading.Thread(target=start_api, daemon=True)
    api_thread.start()

    time.sleep(1)

    window = webview.create_window(
        "Black | Assistant",
        "http://localhost:5173",
        width=1200,
        height=800
    )

    webview.start(
        icon="./frontend/src/assets/img/Black_logo_white.png"
    )
