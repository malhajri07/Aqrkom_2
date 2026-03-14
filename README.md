# عقاركم | Aqarkom

**Arabic-first Saudi Real Estate CRM** — Combining Aqar-style listings with DealApp request-matching and full broker CRM.

Based on [RealEstate_CRM_PRD_Saudi_Comprehensive.xlsx](./RealEstate_CRM_PRD_Saudi_Comprehensive.xlsx)

## Tech Stack (from PRD)

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Express, TypeScript
- **Database:** PostgreSQL
- **Deployment:** Docker, GCP Cloud Run, Terraform

## Project Structure

```
aqarkom/
├── apps/
│   ├── web/          # React frontend (Arabic RTL, bilingual)
│   └── api/          # Express API
├── packages/
│   └── shared/       # Shared types & constants
├── db/
│   └── migrations/   # PostgreSQL schema
└── RealEstate_CRM_PRD_Saudi_Comprehensive.xlsx
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development (web + api)
pnpm dev

# Or run separately:
pnpm dev:web   # http://localhost:5173
pnpm dev:api   # http://localhost:3000
```

## Phase 1 MVP Scope (from PRD)

- [x] Monorepo structure
- [x] Arabic RTL shell, bilingual UI
- [x] Navigation (Dashboard, Properties, Requests, Contacts, Transactions)
- [x] PostgreSQL schema (properties, contacts, requests, transactions, users)
- [ ] Auth (Nafath SSO + email/OTP)
- [ ] Property listing CRUD
- [ ] Request matching (DealApp-style)
- [ ] CRM contacts
- [ ] Transaction pipeline
- [ ] Map integration

## Saudi Compliance (PRD)

- **REGA:** Real estate ad licensing
- **Nafath:** Identity verification
- **Ejar:** Rental contracts (Phase 2)
- **ZATCA:** E-invoicing (Phase 2)
- **Data residency:** GCP me-central1 (Dammam)

## License

Private - Aqarkom Project
