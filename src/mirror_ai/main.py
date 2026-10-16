from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from .config import settings
from .database import init_db, list_leads, save_lead
from .llm import ApertusAdapter, LLMError
from .services import analyze_request

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title=settings.app_name, version="2.0.0")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
llm = ApertusAdapter(settings)

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=5000)
    history: list[dict] = Field(default_factory=list)

@app.on_event("startup")
def startup() -> None:
    init_db()

@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")

@app.get("/api/health")
def health():
    return {"ok": True, "mode": settings.llm_mode, "model": settings.llm_name}

@app.get("/api/mode")
def mode():
    return {
        "mode": settings.llm_mode,
        "model": settings.llm_name,
        "live_apertus": settings.llm_mode == "apertus",
    }

@app.post("/api/chat")
def chat(req: ChatRequest):
    analysis = analyze_request(req.message)
    if settings.llm_mode == "apertus":
        try:
            answer = llm.respond(req.message, analysis, req.history)
        except LLMError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc
    else:
        answer = analysis["demo_response"]

    lead_id = save_lead(req.message, analysis)
    return {
        "answer": answer,
        "intent": analysis["intent"],
        "confidence": analysis["confidence"],
        "fields": analysis["fields"],
        "missing_fields": analysis["missing_fields"],
        "resources": analysis["resources"],
        "lead_id": lead_id,
        "mode": settings.llm_mode,
        "model": settings.llm_name,
    }

@app.get("/api/leads")
def leads():
    return {"items": list_leads()}
