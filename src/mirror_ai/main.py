from pathlib import Path
import re
import secrets

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import FileResponse, Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from .config import settings
from .database import init_db, list_leads, save_contact, save_lead
from .llm import ApertusAdapter, LLMError
from .services import analyze_request

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title=settings.app_name, version="2.1.1")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
llm = ApertusAdapter(settings)
admin_security = HTTPBasic()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=5000)
    history: list[dict] = Field(default_factory=list)


class ContactRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=3, max_length=320)
    phone: str = Field(min_length=5, max_length=50)
    requirement: str = Field(min_length=10, max_length=5000)
    service: str = Field(min_length=1, max_length=80)
    company: str = Field(default="", max_length=160)
    country: str = Field(default="", max_length=100)
    preferred_contact: str = Field(default="Either", max_length=30)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.head("/")
def index_head():
    return Response(status_code=200)


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


def _valid_email(value: str) -> bool:
    return bool(re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", value.strip()))


@app.post("/api/contact")
def contact(req: ContactRequest):
    if not _valid_email(req.email):
        raise HTTPException(status_code=422, detail="Please enter a valid email address.")

    if len(re.sub(r"\D", "", req.phone)) < 5:
        raise HTTPException(status_code=422, detail="Please enter a valid phone number.")

    lead_id = save_contact(
        name=req.name.strip(),
        email=req.email.strip(),
        phone=req.phone.strip(),
        requirement=req.requirement.strip(),
        service=req.service.strip(),
        company=req.company.strip(),
        country=req.country.strip(),
        preferred_contact=req.preferred_contact.strip(),
    )
    return {
        "ok": True,
        "lead_id": lead_id,
        "message": "Thank you. Your enquiry has been recorded for the Mirror Global team.",
    }


def require_admin(credentials: HTTPBasicCredentials = Depends(admin_security)) -> None:
    username_ok = secrets.compare_digest(credentials.username, "fenix")
    password_ok = secrets.compare_digest(
        credentials.password,
        settings.fenix_password,
    )
    if not (username_ok and password_ok):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Basic"},
        )


@app.get("/api/leads")
def leads(_: None = Depends(require_admin)):
    return {"items": list_leads()}
