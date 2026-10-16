# Mirror AI — Hack Apertus

Mirror AI is an AI-powered bridge from global demand to the right local path.

It turns an unstructured request into:
1. a clear service intent,
2. only the requirements explicitly stated by the user,
3. relevant synthetic/local resource matches,
4. a qualified enquiry that can be handed to a human operator.

## Why it matters

International buyers and visitors often know what they want, but not which local supplier, business desk, or service route to use. Mirror AI reduces that gap without inventing suppliers, prices, availability, or customer requirements.

## Core workflows

- Buy from China
- Africa to Global
- Build in China
- Travel in China
- Healthcare in China
- Study in China

## Architecture

- FastAPI backend
- Deterministic requirement extraction and resource matching
- Optional Apertus 1.5 OpenAI-compatible adapter
- SQLite/SQLAlchemy CRM persistence
- Vanilla HTML/CSS/JavaScript frontend
- Docker / Docker Compose deployment
- Offline demo mode for reproducible judging

The demo mode is explicitly labelled and does **not** claim to be live Apertus inference.

## Run locally

```bash
cp .env.example .env
docker compose build
docker compose up -d
open http://localhost:8000
```

For a local demo, keep:

```env
LLM_MODE=demo
```

For an OpenAI-compatible Apertus endpoint:

```env
LLM_MODE=apertus
LLM_NAME=swiss-ai/Apertus-v1.5-8B
LLM_BASE_URL=https://YOUR-AUTHORIZED-ENDPOINT/v1
LLM_API_KEY=YOUR_SECRET
```

Never commit `.env`, API keys, passwords, databases, or runtime data.

## API

- `GET /api/health`
- `GET /api/mode`
- `POST /api/chat`
- `GET /api/leads`

Example:

```json
{
  "message": "I want to buy a whole podcast studio equipment from China"
}
```

The system identifies a China sourcing workflow, preserves only explicit information, asks for missing commercial requirements, and returns matching resource desks.

## Hack Apertus positioning

Mirror AI is designed around a simple principle:

> AI should structure uncertainty, not manufacture certainty.

The AI layer can turn natural language into a structured request, while a deterministic validation and matching layer controls what the system is allowed to claim. Human operators remain in the loop for qualified enquiries.

## Security

Secrets are environment-only. Public source code contains no credentials, tokens, passwords, customer database, or runtime database.

## License

Apache-2.0.
