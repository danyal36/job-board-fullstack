# CLAUDE.md — Job Board Full Stack

## Project Overview
A full-stack job board application with advanced search powered by Elasticsearch.
Built to demonstrate senior-level engineering: clean architecture, typed APIs, search relevance tuning, and CI/CD.

---

## Stack

### Backend
- Runtime: Node.js (v20+)
- Framework: Express.js
- Language: TypeScript
- Database: PostgreSQL (primary data store)
- Search: Elasticsearch (job search + filtering)
- Auth: JWT (access + refresh tokens)
- ORM: Prisma
- Validation: Zod
- Testing: Jest + Supertest

### Frontend
- Framework: React 18
- Language: TypeScript
- Styling: Tailwind CSS
- State: Zustand
- Data Fetching: React Query (TanStack Query)
- Routing: React Router v6
- Forms: React Hook Form + Zod
- Testing: Vitest + React Testing Library

### DevOps
- CI/CD: GitHub Actions
- Containerisation: Docker + Docker Compose
- Environment: .env files (never committed)

---

## Project Structure

```
job-board-fullstack/
├── backend/
│   ├── src/
│   │   ├── config/         # DB, Elasticsearch, env config
│   │   ├── controllers/    # Route handlers (thin layer)
│   │   ├── services/       # Business logic lives here
│   │   ├── models/         # Prisma schema + types
│   │   ├── routes/         # Express route definitions
│   │   ├── middleware/      # Auth, error handling, validation
│   │   └── utils/          # Shared helpers
│   ├── migrations/         # Prisma migrations
│   └── prisma/
│       └── schema.prisma   # Database schema
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level page components
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API call functions
│       ├── types/          # Shared TypeScript interfaces
│       └── utils/          # Helper functions
├── .github/workflows/      # CI/CD pipelines
├── CLAUDE.md
├── AGENTS.md
└── docker-compose.yml
```

---

## Architecture Rules

### Backend
- Controllers are thin — only extract request data and call services
- All business logic lives in services
- Never write raw SQL — use Prisma
- All routes must go through validation middleware before hitting controllers
- Error handling via centralised middleware only — never try/catch in routes
- API response shape is always: `{ success: boolean, data: any, message: string }`
- Never expose passwords, tokens, or internal IDs in responses
- All env values via `process.env` — never hardcoded

### Frontend
- No direct fetch/axios calls in components — always go through `services/`
- All API types defined in `types/` — no `any`
- Use React Query for all server state
- Use Zustand for client-only state (auth, UI state)
- Forms always use React Hook Form + Zod validation
- Components should be small and single-responsibility

---

## Key Features (Build Order)
1. Auth (register, login, JWT refresh)
2. Job CRUD (post, edit, delete, view)
3. Elasticsearch indexing + search
4. Job filtering (location, salary, type, skills)
5. Applications (apply, track status)
6. Employer dashboard
7. Saved jobs
8. Email notifications (SendGrid)

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
ELASTICSEARCH_URL=http://localhost:9200
JWT_SECRET=...
JWT_REFRESH_SECRET=...
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Git Conventions
- Branch: `feature/`, `fix/`, `chore/`
- Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`
- Never commit .env files
- Never commit node_modules
