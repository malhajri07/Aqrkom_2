# Project Brief: Aqarkom

## Overview

**Aqarkom (عقاركم)** is an Arabic-first Saudi Real Estate CRM combining:
- **Aqar.fm model:** Property listing marketplace
- **DealApp.sa model:** Request-matching (seekers post requests → brokers respond with offers)
- **Custom CRM:** Contact management, transaction pipelines, commission tracking

## Core Requirements

- Saudi Arabia–focused (RTL Arabic primary, English secondary)
- REGA ad licensing for all property listings
- Government integrations: Nafath (SSO), Ejar (rental contracts), ZATCA (e-invoicing)
- Data residency: GCP me-central1 (Dammam)

## Target Architecture (from .agents/skills/)

- **Backend:** Express/NestJS, PostgreSQL 16+, Drizzle/Prisma, Redis, BullMQ
- **Frontend:** React 18+, Vite, Tailwind, shadcn/ui, TanStack Query, react-i18next
- **Infra:** Terraform, Cloud Run, Cloud SQL, Memorystore
- **QA:** Vitest, Playwright E2E, k6 load tests

## Scope

Phase 1 MVP: Auth, properties, requests, contacts, transactions, dashboard, documents.
Phase 2: Saudi integrations (Nafath, REGA API, Ejar, ZATCA), infrastructure.
