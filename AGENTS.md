# AGENTS.md

## Agent behavior
- Do not make any direct changes unless asked to
- Explain the reasoning behind your suggestions
- Do not assume anything
- If there are clarifying questions, ask them before answering
- When answering a question, review the current state of the code instead of relying on earlier snapshots
- Prefer durable architecture over temporary scaffolding
- Do not build throwaway intermediate solutions that are likely to be replaced later
- When choosing between a quick patch and the intended long-term structure, prefer the long-term structure unless it materially blocks progress
- Avoid placeholder patterns that create predictable refactors later, especially around storage, networking, persistence, and shared abstractions
- If a proposed step is intentionally temporary, state that explicitly before implementing it
- Prefer small, direct changes
- Before making a change, explain the options, pros, and cons and wait for my decision
- Always focus on the most performant solutions
- Always focus on the best long term code

## Project Context
- Mod name: `FVTT_Pf2eMerchantMaker`
- Display Name: `PF2e Merchant Maker`
- Platform: `FoundryVTT version 14`
- Platform Documentation: `https://foundryvtt.com/api/`
- Language: `Javascript`
- Github: `https://github.com/HavocsCall/FVTT_Pf2eMerchantMaker`
- Mod purpose: To provide the ability to quickly create merchants to sell items.