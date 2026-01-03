# Technical Specification: Authentication (R0)

> **Owner**: System Designer
> **Feature**: Authentication (Pre-Monorepo)

## 1. Architecture
- **Auth Strategy**: Session-based (HTTP-only Cookie).
- **Providers**: Local Strategy, Google OAuth Strategy.

## 2. Schema
- **users**: id, email, password_hash, provider, etc.
- **sessions**: token, user_id, expires_at.

## 3. API
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/google`
