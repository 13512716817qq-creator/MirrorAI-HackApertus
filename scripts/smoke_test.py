import json
import os
import urllib.request

BASE_URL = os.getenv("MIRROR_AI_URL", "http://127.0.0.1:8000")


def request_json(url: str, *, data: bytes | None = None) -> dict:
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"} if data else {},
        method="POST" if data else "GET",
    )
    with urllib.request.urlopen(request, timeout=10) as response:
        assert response.status == 200
        return json.loads(response.read().decode())


def main() -> None:
    health = request_json(f"{BASE_URL}/api/health")
    assert health["ok"] is True
    print("health:", json.dumps(health))

    payload = json.dumps({
        "message": "I want to buy a whole podcast studio equipment from China"
    }).encode()

    body = request_json(f"{BASE_URL}/api/chat", data=payload)
    assert body["intent"] == "buy_from_china"
    assert body["resources"]
    assert body["fields"]["product"] == "podcast studio equipment"
    print("chat:", json.dumps(body, indent=2))


if __name__ == "__main__":
    main()
