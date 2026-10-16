from __future__ import annotations

import json
import re
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "synthetic_intents.json"

with DATA_PATH.open("r", encoding="utf-8") as fh:
    DATA = json.load(fh)

INTENTS = DATA["intents"]
RESOURCES = DATA["resources"]

def _score(text: str, keywords: list[str]) -> int:
    lower = text.lower()
    return sum(1 for keyword in keywords if keyword.lower() in lower)

def classify_intent(text: str) -> tuple[str, float]:
    scored = [(name, _score(text, item["keywords"])) for name, item in INTENTS.items()]
    scored.sort(key=lambda x: x[1], reverse=True)
    best_name, best_score = scored[0]
    if best_score == 0:
        return "buy_from_china", 0.35
    total = sum(score for _, score in scored)
    confidence = min(0.98, 0.45 + best_score / max(total, 1) * 0.5)
    return best_name, round(confidence, 2)

def extract_explicit_fields(text: str, intent: str) -> dict:
    lower = text.lower()
    fields: dict[str, str] = {}

    cities = [
        "beijing", "shanghai", "guangzhou", "shenzhen", "yiwu", "xi'an",
        "xian", "kunming", "hong kong", "hongkong",
    ]
    for city in cities:
        if city in lower:
            fields["destination"] = city.title()
            break

    quantity = re.search(
        r"\b(\d+(?:\.\d+)?)\s*(units?|pcs?|pieces?|sets?|containers?|cbm|kg|tons?|tonnes?)\b",
        lower,
    )
    if quantity:
        fields["quantity"] = quantity.group(0)

    money = re.search(
        r"(?:usd|\$|rmb|cny|¥)\s*[\d,.]+(?:\s*(?:k|m))?",
        lower,
        re.IGNORECASE,
    )
    if money:
        fields["budget"] = money.group(0)

    product_patterns = {
        "podcast": "podcast studio equipment",
        "solar": "solar equipment",
        "avocado": "avocado",
        "shea butter": "shea butter",
        "cocoa butter": "cocoa butter",
        "machinery": "machinery",
        "clothing": "clothing",
        "electronics": "electronics",
        "furniture": "furniture",
    }
    for needle, value in product_patterns.items():
        if needle in lower:
            fields["product"] = value
            break

    if intent == "africa_to_global":
        if "tanzania" in lower:
            fields["origin"] = "Tanzania"
        elif "kenya" in lower:
            fields["origin"] = "Kenya"
        if "china" in lower:
            fields["target market"] = "China"

    return fields

def resources_for(intent: str, text: str) -> list[dict]:
    lower = text.lower()
    candidates = [r for r in RESOURCES if intent in r["intents"]]
    if not candidates:
        candidates = RESOURCES[:2]

    if "solar" in lower:
        solar = [r for r in RESOURCES if r["name"] == "Solar Equipment Sourcing Desk"]
        if solar:
            return solar + [r for r in candidates if r["name"] != solar[0]["name"]][:1]

    if "beijing" in lower and intent in {"study_in_china", "travel_in_china"}:
        beijing = [r for r in RESOURCES if r["name"] == "Beijing Travel Resource Desk"]
        if beijing:
            return beijing + [r for r in candidates if r["name"] != beijing[0]["name"]][:2]

    return candidates[:3]

def missing_fields(intent: str, fields: dict) -> list[str]:
    required = {
        "buy_from_china": ["product", "quantity", "destination", "budget"],
        "africa_to_global": ["commodity", "origin", "target market", "volume"],
        "build_in_china": ["business type", "city", "budget", "timeline"],
        "travel_in_china": ["destination", "trip length", "services"],
        "healthcare_in_china": ["city", "treatment", "timing"],
        "study_in_china": ["destination", "study level", "subject"],
    }[intent]
    return [item for item in required if item not in fields]

def _demo_response(intent: str) -> str:
    responses = {
        "buy_from_china": "I can structure your China sourcing request. Please provide the product, quantity, destination and target budget.",
        "africa_to_global": "I can structure your Africa-to-global trade request. Please provide the commodity, origin, target market and expected volume.",
        "build_in_china": "I can structure your China setup request. Please provide the business type, preferred city, budget and timeline.",
        "travel_in_china": "I can match China destinations and local resources. Please tell me your destination, trip length and the services you need.",
        "healthcare_in_china": "I can structure a China healthcare request. Please provide the city, treatment type and preferred timing.",
        "study_in_china": "I can structure your China study request. Please provide the destination, study level and subject you want to pursue.",
    }
    return responses[intent]

def analyze_request(text: str) -> dict:
    intent, confidence = classify_intent(text)
    fields = extract_explicit_fields(text, intent)
    resources = resources_for(intent, text)
    return {
        "intent": intent,
        "confidence": confidence,
        "fields": fields,
        "missing_fields": missing_fields(intent, fields),
        "resources": resources,
        "demo_response": _demo_response(intent),
    }
