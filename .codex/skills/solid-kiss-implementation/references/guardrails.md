# SOLID And KISS Guardrails

Use this file when deciding whether code is too abstract, too coupled, or too broad.

## Ask Before Adding An Abstraction

1. Does this remove current duplication of a stable concept?
2. Does this protect a real boundary such as database, auth, storage, or external API?
3. Would the code become clearer to a new contributor after the abstraction exists?

If the answer is not clearly yes, keep the implementation concrete.

## Good Application Layer Shape

- One use case per user intent.
- Explicit input type.
- Explicit result type.
- Authorization and orchestration live here.
- Persistence and transport stay behind ports.

## Good Domain Layer Shape

- Enforce invariants.
- Express business language.
- Avoid framework imports.
- Avoid serialization concerns unless part of the domain.

## Good UI Layer Shape

- Gather input.
- Show state.
- Delegate mutations to use cases or server actions.
- Keep formatting and interaction local to the component tree.

## Smells

- `utils.ts` grows every sprint.
- Interfaces exist only to satisfy style, not a real boundary.
- A service constructor takes five unrelated dependencies.
- Tests require heavy mocking to reach simple behavior.
- A change request forces edits across UI, service, and repository for one business rule.
