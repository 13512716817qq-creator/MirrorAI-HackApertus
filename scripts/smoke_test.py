import json
import os
import urllib.request

base = os.getenv("MIRROR_AI_URL", "http://127.0.0.1:8000")

with urllib.request.urlopen(f"{base}/api/health", timeout=10) as response:
    assert response.status == 200
    print("health:", response.read().decode())

payload = json.dumps({
    "message": "I want to buy a whole podcast studio equipment from China"
}).encode()

request = urllib.request.Request(
    f"{base}/api/chat",
    data=payload,
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(request, timeout=10) as response:
    body = json.loads(response.read().decode())
    assert body["intent"] == "buy_from_china"
    assert body["resources"]
    print("chat:", json.dumps(body, indent=2))
