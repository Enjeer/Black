def execute_command(intent: str, text: str) -> str:
    print(f"[EXEC] intent={intent} text='{text}'")

    if intent == "launch":
        print("[EXEC] Launching application...")
        return "<launch />"

    if intent == "music":
        print("[EXEC] Music control...")
        return "<music />"

    return ""
