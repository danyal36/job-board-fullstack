# Daily Claude Code Prompt — Job Board

## Instructions
Replace [TODAY'S TASK] with the task from the Daily Build Plan below.
Paste the entire prompt into Claude Code each day.

---

## Prompt Template

```
## Setup — Read First (Mandatory)

Before writing any code, read these files in order:
1. CLAUDE.md
2. AGENTS.md

Do not proceed until you have read and understood both.

---

## Today's Task

[TODAY'S TASK]

---

## Rules

- Explore existing files before creating anything new
- Backend: controllers are thin, all logic in services
- Frontend: no direct API calls in components, always use services/
- All types defined in types/index.ts — never use `any`
- Follow existing response shape: { success, data, message }
- Never hardcode env values
- Never push or commit — implement only

## Done Checklist

- [ ] Feature works end-to-end
- [ ] TypeScript compiles: run `tsc --noEmit` in backend/ and frontend/
- [ ] Summary of every file created or changed
```

---

## Daily Build Plan

| Day | Task to paste |
|-----|--------------|
| 1 | ✅ Done — Scaffold, auth backend, Prisma schema, Elasticsearch config |
| 2 | Build the complete Job CRUD backend: service + controller. Add Elasticsearch indexing on create/update/delete. Test all endpoints with a seed script in backend/src/utils/seed.ts |
| 3 | Scaffold the React frontend with Vite + Tailwind. Build the Jobs listing page at /jobs showing paginated job cards. Each card shows title, company, location, salary range, job type badge, and remote badge. Use React Query to fetch from GET /api/jobs |
| 4 | Build the job search UI. Add a search bar + filter sidebar (location, job type, remote toggle, salary range slider, skills multi-select). Wire up to GET /api/jobs/search Elasticsearch endpoint. Show result count and loading/empty states |
| 5 | Build the Job Detail page at /jobs/:id. Show full job description, requirements, skills tags, company info, and an Apply button. Build the Application modal with a cover letter textarea and form validation using React Hook Form + Zod |
| 6 | Build the Auth flow — Register and Login pages with React Hook Form + Zod validation. Wire to backend. Protect routes. Show user name in navbar when logged in |
| 7 | Build the Employer dashboard at /dashboard. Show the employer's posted jobs in a table with status badges, applicant count, and edit/delete actions. Add a Post New Job form |
| 8 | Build the Job Seeker dashboard at /my-applications. Show all applications with status badges (Pending, Reviewing, Shortlisted, Rejected, Accepted). Add Saved Jobs tab |
| 9 | Polish: add loading skeletons, error boundaries, empty states, and 404 page. Add pagination component. Make the UI fully responsive for mobile |
| 10 | Write Jest tests for auth.service.ts and job.service.ts. Write Vitest tests for the JobCard and SearchBar components |
