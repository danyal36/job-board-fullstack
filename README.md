# Job Board — Full Stack Application

## Overview

A full-stack job board application supporting employer and job seeker roles, built with React, Node.js, PostgreSQL, and OpenSearch. Employers can post and manage job listings; job seekers can search, filter, save, and apply to jobs.

## Tech Stack

| Layer      | Technology                                       |
|------------|--------------------------------------------------|
| Frontend   | React 18, TypeScript, Tailwind CSS, Vite         |
| Backend    | Node.js, Express, TypeScript                     |
| Database   | PostgreSQL via Prisma ORM                        |
| Search     | OpenSearch 3.x (Elasticsearch-compatible API)    |
| Auth       | JWT (access + refresh tokens), bcryptjs          |
| Validation | Zod (request validation on frontend and backend) |
| Testing    | Vitest + React Testing Library, Jest + Supertest |

## Features

| Employer                              | Job Seeker                              |
|---------------------------------------|-----------------------------------------|
| Register and log in as employer       | Register and log in as job seeker       |
| Create, edit, and delete job listings | Browse and search job listings          |
| View applicant count per job          | Full-text search with OpenSearch        |
| Employer dashboard with job table     | Filter by location, type, salary, skill |
| Post jobs with rich field support     | Save jobs for later review              |
|                                       | Apply to jobs with a cover letter       |
|                                       | Track application status in dashboard   |

## Architecture

The React frontend communicates with an Express REST API over JSON. API routes pass through thin controllers into a service layer that holds all business logic. Prisma ORM manages all PostgreSQL interactions — no raw SQL. OpenSearch sits alongside PostgreSQL for full-text job search with relevance tuning, fuzziness, and field boosting on title, description, skills, and company name.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (Docker Compose maps host port 5434 to container port 5432)
- OpenSearch 3.x (or Elasticsearch 8.x) — Docker Compose maps host port 9201

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd job-board-fullstack

# 2. Install backend dependencies
cd backend && npm install

# 3. Install frontend dependencies
cd ../frontend && npm install

# 4. Configure environment variables
cd ../backend && cp .env.example .env   # edit values as needed
cd ../frontend && cp .env.example .env  # edit values as needed

# 5. Run database migrations
cd backend && npx prisma migrate dev

# 6. (Optional) Seed sample data
npm run seed

# 7. Start the backend dev server
npm run dev

# 8. In a separate terminal, start the frontend dev server
cd ../frontend && npm run dev
```

The API runs on `http://localhost:5000` and the frontend on `http://localhost:5173` by default.

### Environment Variables

**backend/.env**

| Variable             | Description                          | Example                                    |
|----------------------|--------------------------------------|--------------------------------------------|
| `DATABASE_URL`       | PostgreSQL connection string         | `postgresql://user:pass@localhost:5434/db` |
| `ELASTICSEARCH_URL`  | OpenSearch / Elasticsearch endpoint  | `http://localhost:9201`                    |
| `JWT_SECRET`         | Secret for access token signing      | `a-long-random-string`                     |
| `JWT_REFRESH_SECRET` | Secret for refresh token signing     | `another-long-random-string`               |
| `PORT`               | Port for the Express server          | `5000`                                     |
| `CLIENT_URL`         | Allowed CORS origin                  | `http://localhost:5173`                    |

**frontend/.env**

| Variable       | Description          | Example                     |
|----------------|----------------------|-----------------------------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Running Tests

```bash
# Frontend (Vitest + React Testing Library)
cd frontend
npm test            # single run
npm run test:watch  # watch mode

# Backend (Jest + Supertest)
cd backend
npm test
```

## Project Structure

```
job-board-fullstack/
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI components and error boundaries
│       ├── pages/        # Route-level page components
│       ├── hooks/        # Custom React hooks (useDebounce, etc.)
│       ├── services/     # API call functions — all fetch logic lives here
│       ├── types/        # Shared TypeScript interfaces
│       └── utils/        # Helper functions
├── backend/
│   └── src/
│       ├── routes/       # Express route definitions
│       ├── controllers/  # Thin request handlers — extract data, call services
│       ├── services/     # Business logic and database operations
│       ├── middleware/   # Auth, error handling, not-found handler
│       ├── config/       # Database, OpenSearch, and env setup
│       └── validators/   # Zod schemas for request validation
└── docker-compose.yml    # PostgreSQL and OpenSearch containers
```

## Screenshots

> Screenshots coming soon — run locally to preview.
