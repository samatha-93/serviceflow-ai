# ServiceFlow AI — Product Requirements Document (PRD)

> **Tagline:** Less Admin. Better Business.  
> **Repository:** [https://github.com/samatha-93/serviceflow-ai](https://github.com/samatha-93/serviceflow-ai)  
> **Status:** Active Development (Core Operations Implemented)  
> **Author:** Samatha Reddy

---

## 1. Executive Summary & Vision

Small and independent trade and service businesses (such as landscapers, residential cleaners, handymen, and mobile wellness practitioners) face significant operational overhead when juggling customer communications, job requests, and appointment schedules across disparate channels (SMS, email, messaging apps, and paper notes).

**ServiceFlow AI** is an independently developed full-stack web application designed to centralize and streamline operational administration. The system provides a unified workspace where service operators can triage customer inquiries, inspect job details, transition inquiry states, convert inquiries directly into confirmed bookings, and maintain business-isolated operational records.

---

## 2. Target Business Categories

ServiceFlow AI is modeled around workflows common across primary service sectors:

1. **Outdoor and Property Services** (e.g., landscaping, lawn mowing, tree trimming, pressure washing).
2. **Cleaning Services** (e.g., residential home cleaning, commercial office turnover, post-construction cleaning).
3. **Home Maintenance & Repairs** (e.g., plumbing, electrical inspection, handyman services).
4. **Beauty & Mobile Wellness** (e.g., mobile stylists, massage therapy, personal fitness trainers).
5. **Independent Trade Professionals** (e.g., mobile notaries, home inspectors, consulting specialists).

*Note: Target user categories represent design and domain modeling personas; market validation and commercial metrics have not been conducted.*

---

## 3. User Personas

| Persona | Role | Key Operational Challenge | Platform Solution |
|---|---|---|---|
| **Solo Operator** | Business owner & technician | Missing inquiries while on job sites; disorganized scheduling | Centralized enquiry inbox and one-click booking conversion |
| **Small Crew Lead** | Owner with 2–5 technicians | Confusion regarding assignment, timeslots, and job notes | Unified booking board with assignee tracking and address records |
| **Prospective Client** | End customer | Slow response times and lack of clear service specifications | Structured inquiry intake and contextual response drafting |

---

## 4. Functional Requirements & Implementation Status

### 4.1 Module 1: Authentication & Business Isolation
- **PRD-1.1 (Implemented):** Business owner registration with name, business name, email, and password.
- **PRD-1.2 (Implemented):** Secure password hashing using `bcryptjs` and session issuance via JWT stored in an `HttpOnly`, `SameSite` cookie.
- **PRD-1.3 (Implemented):** Tenant partitioning: Every registered business is assigned a unique UUID `businessId`. All created records (enquiries, bookings, profiles) are stamped and strictly scoped to this identifier.
- **PRD-1.4 (Implemented):** Public Demo Mode: Unauthenticated visitors can inspect pre-seeded demo records (`DEMO_TENANT_ID`) without accessing private tenant data or executing database writes.

### 4.2 Module 2: Enquiry Management & Triage
- **PRD-2.1 (Implemented):** Centralized Enquiry Workspace displaying customer name, contact location, service category, urgency, status, and received timestamp.
- **PRD-2.2 (Implemented):** Multi-dimensional filtering by search query, status (`Awaiting Review`, `Quoted`, `Booked`, `Archived`), service category, and urgency level (`Urgent`, `High`, `Standard`, `Flexible`).
- **PRD-2.3 (Implemented):** Real-time metric counters summarizing total inquiries, pending reviews, sent quotes, and confirmed conversions.
- **PRD-2.4 (Implemented):** Detailed inspection modal displaying full message text, AI response preview, and status mutation actions.
- **PRD-2.5 (Implemented):** RESTful endpoints for enquiry retrieval, creation, and status transitions with MongoDB persistence via Mongoose.

### 4.3 Module 3: Booking Management & Enquiry Conversion
- **PRD-3.1 (Implemented):** Dedicated Bookings board displaying confirmed, pending, completed, and cancelled service appointments.
- **PRD-3.2 (Implemented):** Enquiry-to-Booking conversion workflow: Users can convert an incoming enquiry directly into a scheduled booking from the detail modal, specifying date, time, duration, assignee, and notes.
- **PRD-3.3 (Implemented):** State consistency & compensation: Converting an enquiry marks its status as `Booked`. If status synchronization fails during creation, a compensating rollback deletes the newly created booking to prevent orphan records.
- **PRD-3.4 (Implemented):** Duplicate prevention: Prevents re-converting an enquiry that has already been converted into an existing booking (HTTP 409 Conflict).
- **PRD-3.5 (Implemented):** Booking status updates with ownership verification.

### 4.4 Module 4: Business Profile Management
- **PRD-4.1 (Backend Implemented):** Backend models, repository, and REST endpoints (`GET`, `PUT`, `PATCH /api/business-profile`) for business details, tagline, description, contact details, operating location, and service categories.
- **PRD-4.2 (Backend Implemented):** Public business profile retrieval endpoint (`GET /api/business-profile/public/:businessId`).
- **PRD-4.3 (Planned / In Progress):** Client-side profile configuration settings view and public business showcase page.

### 4.5 Module 5: AI-Assisted Administrative Automation
- **PRD-5.1 (Partially Implemented / Simulated):** Contextual response drafts and urgency categorization displayed in UI and mock/seed payloads.
- **PRD-5.2 (Planned):** Direct integration with LLM providers (e.g. OpenAI or Anthropic API) for dynamic prompt generation, automated email draft generation, and inquiry triage.

### 4.6 Module 6: Customer CRM & Invoicing
- **PRD-6.1 (Planned):** Dedicated customer database with historical timeline of visits, lifetime value, and notes.
- **PRD-6.2 (Planned):** Digital estimate and invoice generation with exportable PDF documents.

---

## 5. Non-Functional Requirements (NFRs)

### 5.1 System Reliability & Fault Tolerance
- **NFR-1.1 (Graceful Degradation):** The Express API starts and serves health checks and public demo data even if local MongoDB is offline, reporting database status via headers and JSON responses.
- **NFR-1.2 (Process Lifecycle):** Clean handling of `SIGTERM` and `SIGINT` signals with graceful teardown of HTTP servers and database handles.

### 5.2 Security & Data Privacy
- **NFR-2.1 (Credential Hygiene):** Zero-secrets policy. All configuration parameters are managed through environment variables and documented via `.env.example` templates.
- **NFR-2.2 (HTTP Security Headers):** Secure HTTP header baseline enforced through `helmet`.
- **NFR-2.3 (CORS Whitelisting):** Cross-Origin Resource Sharing strictly limited to verified client origins.
- **NFR-2.4 (Cookie Protections):** Authentication tokens transmitted via `HttpOnly`, `SameSite=lax` cookies.

### 5.3 Code Quality & Typing
- **NFR-3.1 (Full-Stack TypeScript):** End-to-end static typing across both `client` and `server` packages with strict TypeScript compiler configurations.
- **NFR-3.2 (Repository Pattern):** Clean separation of concerns isolating HTTP controllers from Mongoose query logic via strongly-typed repository classes.

---

## 6. Implementation Status Summary

| Phase | Scope | Status | Notes |
|---|---|---|---|
| **Phase 1** | Monorepo setup, React + Express foundation, Design System | **Completed** | Clean build pipeline, health probe, design tokens |
| **Phase 2** | MongoDB persistence, Enquiry CRUD, Seeding | **Completed** | Mongoose models, repository abstraction, idempotent seeders |
| **Phase 3** | Authentication & Business Isolation | **Completed** | JWT auth, HttpOnly cookies, multi-tenant UUID scoping |
| **Phase 4** | Booking Management & Enquiry Conversion | **Completed** | Bookings view, conversion workflow, compensating rollback |
| **Phase 5** | Business Profile Backend | **Completed (Backend)** | Endpoints and models ready; frontend UI in progress |
| **Phase 6** | Business Profile Frontend & Showcase | **Planned** | Settings dashboard and public landing page |
| **Phase 7** | LLM Integration & Production Automated Tests | **Planned** | Real AI completion pipelines and Vitest/Jest suite |
