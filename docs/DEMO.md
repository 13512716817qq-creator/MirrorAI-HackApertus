# Demo Guide

Mirror AI is easiest to evaluate with these three requests.

## 1. China sourcing

`I want to buy a whole podcast studio equipment from China`

Expected:
- intent: `buy_from_china`
- explicit product: podcast studio equipment
- relevant sourcing resources
- missing commercial fields requested

## 2. Africa to Global

`We produce shea butter in Tanzania and want Chinese buyers.`

Expected:
- intent: `africa_to_global`
- explicit commodity and origin preserved
- relevant trade resource
- missing target market and volume requested

## 3. Study in China

`I want to study in China in Beijing.`

Expected:
- intent: `study_in_china`
- Beijing preserved as the destination
- missing study level and subject requested

## Demo versus live Apertus

With `LLM_MODE=demo`, responses are deterministic and local.

With `LLM_MODE=apertus`, the same structured routing context is passed to the configured OpenAI-compatible Apertus endpoint. The UI explicitly changes its status label to indicate live Apertus mode.
