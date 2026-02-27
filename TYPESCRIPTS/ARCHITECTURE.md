# 🛠️ SIDECAR Technical Architecture & Pathing

This document outlines the internal logic and future roadmap for SIDECAR, providing a path for contributors to follow.

## 🧠 Core Architecture Concepts

### 1. Data Contract (The Source of Truth)
Everything in SIDECAR is driven by the types defined in `src/types/index.ts`. 
- **Rule**: If you change a data field in the backend, you MUST update the corresponding logic in the frontend modules. 
- **Pattern**: The API returns wrapped objects: `{ success: true, data: { key: [] } }`.

### 2. The Policy Engine (Pre-QA)
Located in `src/routes/orders.ts`, this is the heart of SIDECAR's automation. It runs 8 distinct checks:
- **JTRS Compliance**: Checks entitlements.
- **EAOS/Obliserv**: Validates service time vs RNLTD.
- **NEC Matching**: Compares sailor skills to billet requirements.
- **Medical Hold**: Blocks orders for non-deployable sailors.

### 3. Module System
The frontend is split into "Modules" in `js/modules/`:
- `home.js`: Dashboard statistics and critical alerts.
- `sailors.js`: Profile management and email integration.
- `billets.js`: Inventory and filling analytics.

## 🗺️ Implementation Roadmap

### Phase 1: Persistence (Current Priority)
- [ ] Replace `data/index.ts` with a **PostgreSQL** database.
- [ ] Implement **TypeORM** for database management.
- [ ] Add JWT-based authentication (replacing current session storage).

### Phase 2: Integration
- [ ] **MNA/NSIPS Sync**: Build ETL scripts to pull real sailor data from mock sources.
- [ ] **Email Intake**: Automate email-to-activity logging using IMAP integration.

### Phase 3: AI Augmentation
- [ ] **Billet Matcher**: Enhance the 0-100% match score using a more complex scoring algorithm.
- [ ] **Policy GPT**: Integrate an LLM to answer detailed MILPERSMAN questions via the "Agent" input on the dashboard.

## 🤝 Contribution Guidelines
1. **Branching**: Create a feature branch `feat/your-feature`.
2. **Linting**: Ensure `npm run typecheck` passes before committing.
3. **Mocking**: Add new demo data to `data/index.ts` to show your feature in action.

---
*Questions? Contact PERS-40 Development Team.*
