# Mirror AI architecture

## Request flow

User message → intent classification → explicit-field extraction → resource matching → optional Apertus response → lead persistence → human handoff.

## Classification

The deterministic layer scores the six supported workflows against explicit keywords. This gives the application a stable routing boundary even when the language model is unavailable.

## Requirement extraction

The extractor only records fields whose values are explicitly present in the user's text. It does not infer quantities, budgets, destinations, certifications, or commercial commitments.

## Resource matching

Resources are synthetic/local routing desks. They are not presented as verified live suppliers. This keeps the demo reproducible and prevents fabricated availability.

## Apertus adapter

When LLM_MODE=apertus, the application calls an OpenAI-compatible /chat/completions endpoint. The deterministic analysis is included as context so the model can improve the natural-language response without becoming the source of truth for structured fields.

## Human handoff / CRM

Every enquiry is persisted to SQLite in the runtime volume. The stored record contains the original request, classified intent and explicit fields. The human operator can inspect /api/leads.

## Safety boundary

The model is not allowed to manufacture supplier identity, prices, stock, availability, certifications or user requirements. The system is designed to structure uncertainty and route a qualified enquiry to a human operator.
