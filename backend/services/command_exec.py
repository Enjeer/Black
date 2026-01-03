# command_exec.py

def execute_command(intent: str, payload: dict) -> str:
    print(f"[EXEC] intent={intent} payload={payload}")

    if intent == "launch":
        return launch_app(payload)

    if intent == "music":
        return music_control(payload)

    print("[EXEC] Unknown intent")
    return ""


def launch_app(payload: dict) -> str:
    app = payload.get("app")
    print(f"[EXEC] Launching app: {app}")
    return f"<launch app='{app}' />"


def music_control(payload: dict) -> str:
    action = payload.get("action", "play")
    print(f"[EXEC] Music action: {action}")
    return f"<music action='{action}' />"
