# monorepo-auth-fullstack

## Overview

This repository hosts a full-stack authentication playground built as a monorepo. It combines a SvelteKit frontend with a NestJS backend scaffold powered by Drizzle ORM on PostgreSQL, providing a cohesive environment for experimenting with modern web authentication flows, shared data contracts, and developer experience optimizations.

## Tech Stack

- Frontend: Svelte 5, SvelteKit, Tailwind CSS 4, Bits UI component primitives
- Backend: NestJS 10 (TypeScript), Drizzle ORM, JWT-based auth
- Database: PostgreSQL 16 (Dockerized)
- Tooling: Docker Compose for multi-service orchestration, ESLint/Prettier, TypeScript across the stack

## Current Features

- Responsive landing page plus dedicated login and signup routes (`frontend/src/routes`)
- Reusable auth forms built on the shared UI library (`frontend/src/lib/components`)
- Centralized HTTP client with token-aware request helpers (`frontend/src/lib/api/httpClient.ts`)
- NestJS REST endpoint scaffolding ready for a custom auth flow (`backend/src/auth`)
- Drizzle ORM and migration tooling prepared for your schema definitions (`backend/src/db`, `backend/drizzle`)
- Swagger UI available at `/api/docs` once the backend is running (NestJS + Swagger)

> The backend ships as a learning sandbox: authentication services are intentionally left unimplemented so you can build them from scratch.

## Repository Structure

- `frontend/` – SvelteKit app, UI components, API helpers, and stores
- `backend/` – NestJS service with modular architecture (`src/`), Drizzle schema, and migrations (`drizzle/`)
- `doc/` – Architecture notes and developer runbooks (`frontend-architect.md`, `how-to-start-dev-env.md`)
- `docker-compose.yml` – Spins up frontend, backend, and PostgreSQL for local development

## Getting Started

Step-by-step instructions for launching the development environment (Docker Compose, frontend-only, backend-only) live in `doc/how-to-start-dev-env.md`. The short version:

```bash
cp backend/.env.example backend/.env   # first time only
docker compose up --build              # run everything
```

The frontend is available at `http://localhost:5173`, the backend API at `http://localhost:3333`, and Postgres at `localhost:5432`.

## Additional Documentation

- Svelte architecture overview: `doc/frontend-architect.md`
- Development environment guide: `doc/how-to-start-dev-env.md`

Use these documents alongside this README to understand the design decisions and daily workflows in this project.
