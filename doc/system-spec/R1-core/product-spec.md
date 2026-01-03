# Product Specification: Core Refactor (R1)

> **Owner**: Tech Lead
> **Feature**: Core Module & Monorepo Infrastructure
> **Status**: Completed

## 1. Overview
Establish the Monorepo structure (Nx), Core Modules (Domain/Infra), and CI/CD pipelines.

## 2. Features
- **Monorepo Setup**: Backend/Frontend in one repo.
- **Core Modules**: Shared Kernel (Config, Logger, DB).
- **Backend Scheduling**: Distributed Job Queue.
- **CI/CD**: Automated Build/Test/Lint.

## 3. User Stories
(Internal Technical Stories)
- Developer can run `nx run-many` to start all apps.
- CI pipeline runs on every push.
