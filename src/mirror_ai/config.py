import os
from dataclasses import dataclass

@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "Mirror AI")
    llm_mode: str = os.getenv("LLM_MODE", "demo").lower()
    llm_name: str = os.getenv("LLM_NAME", "swiss-ai/Apertus-v1.5-8B")
    llm_base_url: str = os.getenv("LLM_BASE_URL", "").rstrip("/")
    llm_api_key: str = os.getenv("LLM_API_KEY", "")
    llm_timeout: int = int(os.getenv("LLM_TIMEOUT_SECONDS", "60"))
    db_path: str = os.getenv("DATABASE_PATH", "/app/runtime/mirror.db")
    fenix_password: str = os.getenv("FENIX_PASSWORD", "change-me-fenix")
    peter_password: str = os.getenv("PETER_PASSWORD", "change-me-peter")

settings = Settings()
