from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import DateTime, Integer, String, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

from .config import settings


class Base(DeclarativeBase):
    pass


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    intent: Mapped[str] = mapped_column(String(80), nullable=False)
    raw_text: Mapped[str] = mapped_column(Text, nullable=False)
    fields_json: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="new", nullable=False)


def _database_url() -> str:
    path = Path(settings.db_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{path}"


engine = create_engine(
    _database_url(),
    connect_args={"check_same_thread": False},
)


def init_db() -> None:
    Base.metadata.create_all(engine)


def _save_fields_lead(
    *,
    raw_text: str,
    intent: str,
    fields: dict,
    status: str = "new",
) -> int:
    with Session(engine) as session:
        lead = Lead(
            created_at=datetime.now(timezone.utc),
            intent=intent,
            raw_text=raw_text,
            fields_json=json.dumps(fields, ensure_ascii=False),
            status=status,
        )
        session.add(lead)
        session.commit()
        session.refresh(lead)
        return lead.id


def save_lead(raw_text: str, analysis: dict) -> int:
    return _save_fields_lead(
        raw_text=raw_text,
        intent=analysis["intent"],
        fields=analysis["fields"],
    )


def save_contact(
    *,
    name: str,
    email: str,
    phone: str,
    requirement: str,
    service: str,
    company: str = "",
    country: str = "",
    preferred_contact: str = "Either",
) -> int:
    fields = {
        "contact_name": name,
        "email": email,
        "phone": phone,
        "company": company,
        "country": country,
        "service": service,
        "preferred_contact": preferred_contact,
        "source": "website_contact_form",
    }
    return _save_fields_lead(
        raw_text=requirement,
        intent=service or "general_enquiry",
        fields=fields,
    )


def list_leads() -> list[dict]:
    with Session(engine) as session:
        rows = session.scalars(select(Lead).order_by(Lead.id.desc()).limit(50)).all()
        return [
            {
                "id": row.id,
                "created_at": row.created_at.isoformat(),
                "intent": row.intent,
                "raw_text": row.raw_text,
                "fields": json.loads(row.fields_json),
                "status": row.status,
            }
            for row in rows
        ]
