# Job Board — Full Stack

A production-grade full-stack job board with Elasticsearch-powered search, JWT authentication, and employer/job seeker roles.

## Tech Stack

**Backend:** Node.js · Express · TypeScript · PostgreSQL · Prisma · Elasticsearch · JWT

**Frontend:** React 18 · TypeScript · Tailwind CSS · React Query · Zustand · React Hook Form

**DevOps:** Docker · GitHub Actions · CI/CD

## Features

- 🔍 Elasticsearch-powered job search with fuzzy matching and relevance scoring
- 🔐 JWT authentication with access + refresh tokens
- 👔 Employer dashboard — post, edit, manage jobs
- 🎯 Job seeker dashboard — search, apply, track applications
- 💼 Advanced filtering — location, salary, job type, skills, remote
- 📊 Application status tracking
- 🏢 Company profiles

## Getting Started

### Prerequisites
- Node.js 20+
- Docker Desktop

### 1. Clone and install
```bash
git clone https://github.com/danyal36/job-board-fullstack.git
cd job-board-fullstack
npm install
```

### 2. Start infrastructure
```bash
docker-compose up -d
```

### 3. Set up backend environment
```bash
cd backend
cp .env.example .env
# Fill in your values
npm run prisma:migrate
```

### 4. Start development servers
```bash
# From root
npm run dev
```

Backend runs on `http://localhost:5000`
Frontend runs on `http://localhost:5173`
Kibana (Elasticsearch UI) runs on `http://localhost:5601`

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | — |
| POST | /api/auth/login | Login | — |
| GET | /api/auth/me | Get current user | ✅ |
| GET | /api/jobs | List jobs (paginated) | — |
| GET | /api/jobs/search | Search jobs (Elasticsearch) | — |
| GET | /api/jobs/:id | Get job by ID | — |
| POST | /api/jobs | Create job | ✅ Employer |
| PUT | /api/jobs/:id | Update job | ✅ Employer |
| DELETE | /api/jobs/:id | Delete job | ✅ Employer |

## Project Structure

```
job-board-fullstack/
├── backend/
│   ├── src/
│   │   ├── config/         # DB + Elasticsearch setup
│   │   ├── controllers/    # Thin route handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # Express routes
│   │   └── middleware/     # Auth, error handling
│   └── prisma/
│       └── schema.prisma   # Database schema
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI
│       ├── pages/          # Route pages
│       ├── services/       # API layer
│       ├── store/          # Zustand state
│       └── types/          # TypeScript interfaces
├── docker-compose.yml
├── CLAUDE.md               # AI assistant context
└── AGENTS.md               # AI agent workflow rules
```

## Daily Development Log

| Day | Feature |
|-----|---------|
| 1 | Project scaffold, auth backend, Elasticsearch config, Prisma schema |
| 2 | Job CRUD + Elasticsearch indexing |
| 3 | Frontend scaffold + job listing UI |
| 4 | Search UI + filters |
| 5 | Applications feature |
| ... | ... |
