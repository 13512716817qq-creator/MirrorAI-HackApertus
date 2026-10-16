# Mirror AI — Technical Report

## Abstract

Mirror AI is a human-in-the-loop international business routing system. It addresses a practical problem: global users can describe a need in natural language, but the correct local resource, supplier workflow, destination service or market-entry path is often unclear.

The prototype combines Apertus-compatible language-model integration with deterministic validation, synthetic resource matching and CRM persistence.

## What inspired the project

The project was inspired by real cross-border work where the difficult part is often not generating text, but turning an incomplete request into an actionable local workflow. A buyer may say "I need a podcast studio from China" without knowing what information a sourcing desk needs. A producer in Africa may know the commodity but not which Chinese buyer or import route is appropriate.

Mirror AI therefore treats AI as a routing and clarification layer rather than an autonomous authority.

## How it works

1. The user writes a natural-language request.
2. A deterministic classifier maps it to one of six workflows.
3. Explicitly stated requirements are extracted.
4. A resource layer returns relevant synthetic/local desks.
5. In demo mode, a deterministic response is returned for reproducibility.
6. In Apertus mode, an OpenAI-compatible Apertus endpoint generates the natural-language response.
7. The enquiry is persisted for human follow-up.

## Why the deterministic layer matters

A language model can be useful for interpretation, but commercial routing has a higher cost of hallucination. Mirror AI therefore separates interpretation, structured extraction, resource matching, response generation and human decision-making.

## Apertus integration

The application is configured for swiss-ai/Apertus-v1.5-8B through an OpenAI-compatible endpoint. Credentials are environment-only and are never committed to the public repository.

The local demo is explicitly labelled when LLM_MODE=demo; it must not be represented as live Apertus inference.

## Challenges

The main engineering challenge was maintaining a useful user experience when an inference endpoint is unavailable. The solution is a deterministic offline mode with the same structured routing interface, allowing the rest of the product to be demonstrated and tested independently.

A second challenge is preventing the assistant from inventing missing commercial requirements. The programmatic extraction layer records only explicit values, while the response layer is instructed to ask for missing information.

## Future work

- replace synthetic resource desks with verified provider records,
- add multilingual extraction,
- add consent-aware CRM workflows,
- connect supplier verification and quotation APIs,
- add evaluation datasets for extraction accuracy and hallucination resistance,
- support multiple approved Apertus-compatible endpoints.

## Reproducibility

The project can be run with Docker Compose and has no dependency on a local GPU for demo mode. Runtime state is stored in a Docker volume and excluded from version control.
