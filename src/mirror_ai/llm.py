import json
import httpx
from .config import Settings

class LLMError(RuntimeError):
    pass

SYSTEM_PROMPT = """You are Mirror AI, an international business routing assistant.
Your job is to turn an unstructured request into a useful, cautious next step.
Never invent suppliers, prices, availability, certifications, customer requirements,
or facts that were not provided. The application has already performed deterministic
intent classification and resource matching. Preserve that structure and ask only for
missing information needed to qualify the enquiry.
Be concise, professional, and practical. The human operator remains responsible for
final supplier, quotation, booking, medical, legal, and commercial decisions.
"""

class ApertusAdapter:
    def __init__(self, settings: Settings):
        self.settings = settings

    def respond(self, user_message: str, analysis: dict, history: list[dict]) -> str:
        if not self.settings.llm_base_url or not self.settings.llm_api_key:
            raise LLMError("LLM_MODE=apertus requires LLM_BASE_URL and LLM_API_KEY.")

        endpoint = f"{self.settings.llm_base_url}/chat/completions"
        context = {
            "intent": analysis["intent"],
            "confidence": analysis["confidence"],
            "explicit_fields": analysis["fields"],
            "matched_resources": analysis["resources"],
        }
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"User request:\n{user_message}\n\n"
                    f"Deterministic routing context:\n{json.dumps(context, ensure_ascii=False)}\n\n"
                    "Write the next assistant message. Do not add facts that are absent "
                    "from the request or routing context."
                ),
            },
        ]
        if history:
            messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history[-6:] + messages[1:]

        payload = {
            "model": self.settings.llm_name,
            "messages": messages,
            "temperature": 0.2,
            "max_tokens": 220,
            "stream": False,
        }

        try:
            with httpx.Client(timeout=self.settings.llm_timeout) as client:
                response = client.post(
                    endpoint,
                    headers={
                        "Authorization": f"Bearer {self.settings.llm_api_key}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                )
                response.raise_for_status()
                body = response.json()
        except (httpx.HTTPError, ValueError) as exc:
            raise LLMError(f"Apertus endpoint request failed: {exc}") from exc

        try:
            return body["choices"][0]["message"]["content"].strip()
        except (KeyError, IndexError, TypeError) as exc:
            raise LLMError("Apertus endpoint returned an unexpected response.") from exc
