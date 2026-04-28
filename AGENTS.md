# AGENTS.md — Job Board Full Stack
# Read CLAUDE.md first, then this file.

---

## 1. Reading Order

Before starting any task:
1. Read `CLAUDE.md` (full project context, stack, patterns)
2. Read this file (agent workflow rules)
3. Read the relevant subfolder `AGENTS.md` if working in backend/ or frontend/

---

## 2. Quota-Efficient Behaviour (CRITICAL)

- **Read first, ask later** — explore the codebase before asking anything
- **Batch questions** — if you must ask, ask everything in one message, never one at a time
- **No confirmations** — never ask "shall I proceed?" — just proceed and report at the end
- **Reuse before creating** — always check for existing components, services, helpers first
- **Minimal intermediate output** — only output what changed, not full file contents

---

## 3. Daily Task Workflow

Follow this order strictly for every task:

1. Read CLAUDE.md and this file
2. Explore relevant existing files before writing anything
3. Map what exists vs what needs to be created
4. Implement the task
5. Run lint and type checks
6. Deliver a summary of every changed/created file

---

## 4. Backend Rules

- Controllers must be thin — extract data from request, call service, return response
- Never put business logic in controllers or routes
- Always validate request data with Zod before it reaches the controller
- Use Prisma for all DB operations — never raw SQL
- New endpoints must follow existing response shape: `{ success, data, message }`
- Never modify existing response shapes
- Never introduce new packages without listing them first
- Elasticsearch operations always go through `services/search.service.ts`

---

## 5. Frontend Rules

- Never call fetch/axios directly in a component — use `services/` layer
- All server state via React Query — no useState for API data
- All types defined in `types/` — never use `any`
- Forms via React Hook Form + Zod only
- Tailwind only for styling — no inline styles, no CSS modules
- Components must be under 150 lines — split if larger

---

## 6. Cross-Cutting Rules

- Never hardcode URLs, secrets, or env values
- Never commit .env files
- All new features need a corresponding type definition
- API contracts must match between frontend services/ and backend routes/
- Never push directly to main

---

## 7. Done Definition

- [ ] Feature works end-to-end
- [ ] TypeScript compiles with zero errors (`tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] Types defined for all new data shapes
- [ ] Summary of all changed files delivered
