# ServiceFlow AI — Product Requirements Document (PRD)

> **Tagline:** Less Admin. Better Business.  
> **Repository:** [https://github.com/samatha-93/serviceflow-ai.git](https://github.com/samatha-93/serviceflow-ai.git)  
> **Status:** Phase 1 Foundation

---

## 1. Executive Summary & Vision

Small and independent service businesses spend an estimated 30–40% of their working hours on routine administrative overhead: responding to repetitive enquiries, scheduling and rescheduling appointments, tracking down client details, sending quote follow-ups, and handling invoices.

**ServiceFlow AI** is an AI-assisted service management platform engineered to automate and streamline these operational burdens. By centralizing customer interactions, booking logistics, and operational workflows into a unified, intelligent system, ServiceFlow AI allows business owners to focus on their core trade and customer relationships.

---

## 2. Target Business Categories

ServiceFlow AI is purpose-built with flexible workflow configurations tailored to five primary service industries:

1. **Outdoor and Property Services**
   - *Sub-sectors:* Lawn care, landscaping, tree surgery, pressure washing, snow removal, gutter cleaning.
   - *Key Needs:* On-site estimations, weather-dependent rescheduling, service address geo-clustering.

2. **Cleaning Services**
   - *Sub-sectors:* Residential home cleaning, commercial office cleaning, post-construction cleaning, turnover/vacation rentals.
   - *Key Needs:* Recurring schedule frequencies (weekly, bi-weekly), square-footage-based pricing, checklist verification.

3. **Beauty and Wellness**
   - *Sub-sectors:* Mobile stylists, massage therapists, estheticians, personal fitness trainers.
   - *Key Needs:* Appointment slot booking, buffer times between clients, intake forms, deposit collection.

4. **Home Maintenance**
   - *Sub-sectors:* Handyman services, plumbing, electrical, HVAC repairs, appliance installation.
   - *Key Needs:* Emergency inquiry tagging, job-hazard notes, parts tracking, job status transitions.

5. **Independent Professionals**
   - *Sub-sectors:* Consultants, mobile notaries, home inspectors, acoustic assessors.
   - *Key Needs:* Milestone tracking, consultation calendars, client document collection.

---

## 3. User Personas

| Persona | Role | Key Frustrations | Primary Goal |
|---|---|---|---|
| **Solo Operator (Alex)** | Owner & Technician | Answering calls while on a job, losing track of inquiries on SMS/WhatsApp, forgotten invoices | Instant automated responses, mobile booking link, zero admin on weekends |
| **Crew Manager (Maria)** | Operator with 3-5 workers | Double bookings, dispatch confusion, manual route coordination | Clear daily dispatch schedule, team assignment, centralized customer history |
| **Office Coordinator (David)**| Part-time Administrative Assistant | Repetitive customer queries, chasing unpaid deposits | AI drafted email responses, automated reminders, organized pipeline |

---

## 4. Functional Requirements

### 4.1 Module 1: Enquiries & Lead Management
- **FR-1.1:** Web-based enquiry intake form customizable by business vertical.
- **FR-1.2:** Unified enquiry inbox showing lead status (`New`, `Contacted`, `Quoted`, `Booked`, `Archived`).
- **FR-1.3:** Extraction of key inquiry attributes: requested service, urgency, location, preferred time window.
- **FR-1.4:** Quick conversion of an approved enquiry into a confirmed booking or estimate.

### 4.2 Module 2: Bookings & Smart Scheduling
- **FR-2.1:** Interactive calendar view supporting Day, Week, and Month visualizations.
- **FR-2.2:** Service catalog definition (service name, description, duration, buffer times, base price).
- **FR-2.3:** Business operating hours and availability blackout windows.
- **FR-2.4:** Booking status lifecycle: `Pending`, `Confirmed`, `In-Progress`, `Completed`, `Cancelled`.
- **FR-2.5:** Rescheduling workflow with automated notification trigger.

### 4.3 Module 3: Customer Management (CRM) & Job Records
- **FR-3.1:** Customer profile records (name, email, phone, billing address, service locations, internal notes).
- **FR-3.2:** Complete historical timeline of customer interactions, past bookings, and invoices.
- **FR-3.3:** Customer tagging (e.g., `VIP`, `Recurring`, `Commercial`, `Delinquent`).
- **FR-3.4:** Quick customer search and filter by phone number, name, or address.

### 4.4 Module 4: AI-Assisted Administrative Automation *(Planned for Phases 3-4)*
- **FR-4.1:** AI-assisted triage: automatically categorize inquiries by sentiment and urgency.
- **FR-4.2:** Contextual response generation: draft polite, accurate quote and availability emails for one-click approval.
- **FR-4.3:** Smart schedule optimization: recommend booking slots that minimize travel time and avoid scheduling conflicts.
- **FR-4.4:** Proactive follow-up prompts for stalled quotes or overdue invoices.

### 4.5 Module 5: Estimates & Invoicing *(Planned for Phase 5)*
- **FR-5.1:** Professional PDF quote generation with line items, tax, and terms.
- **FR-5.2:** Digital quote acceptance with client signature/approval.
- **FR-5.3:** Conversion of completed jobs into payment-ready invoices.

---

## 5. Non-Functional Requirements (NFRs)

### 5.1 Performance
- **NFR-1.1:** Frontend initial load time must remain under 1.5 seconds on 4G connections.
- **NFR-1.2:** API endpoints must respond within 200ms under standard operational loads.
- **NFR-1.3:** Type-safe builds and production bundles optimized via Vite code splitting.

### 5.2 Security & Compliance
- **NFR-2.1:** Adherence to zero-secret repository commits; all credentials isolated in `.env` files.
- **NFR-2.2:** HTTP security headers enforced through `helmet` middleware.
- **NFR-2.3:** Strict CORS configuration restricting unauthorized external origins.
- **NFR-2.4:** Input validation and parameter sanitization on all incoming request payloads.

### 5.3 Reliability & Availability
- **NFR-3.1:** Stateless Express server architecture allowing containerization and zero-downtime restarts.
- **NFR-3.2:** Non-blocking database connections with graceful degradation (e.g. Phase 1 health endpoints operate even in offline database mode).
- **NFR-3.3:** Graceful process shutdown handling `SIGTERM` and `SIGINT` signals.

### 5.4 Usability & Accessibility
- **NFR-4.1:** Responsive design adapting to mobile handsets, tablets, and desktop workstations.
- **NFR-4.2:** Modern, accessible UI meeting WCAG 2.1 AA standards for color contrast and focus states.
- **NFR-4.3:** Adherence to the ServiceFlow AI Design System:
  - Primary Teal: `#176B67`
  - Background: `#F7F7F2`
  - Cards: `#FFFFFF`
  - Primary Text: `#242A2A`
  - Secondary Text: `#66716F`
  - Font: Inter

---

## 6. Phased Implementation Roadmap

- [x] **Phase 1: Project Foundation & Architecture** (Current)
  - Monorepo structure (`client/`, `server/`, `docs/`)
  - React + TypeScript + Vite + Tailwind CSS frontend
  - Node.js + Express + TypeScript backend
  - Root scripts and Git configuration
  - System health probe and documentation
- [ ] **Phase 2: Database Modeling & Core REST APIs**
  - Mongoose models for Customer, Service, Enquiry, and Booking
  - CRUD controllers and validation middleware (Zod)
  - Seed scripts for mock service business data
- [ ] **Phase 3: Interactive Dashboard & Operations UI**
  - Responsive layout with sidebar navigation
  - Enquiry management board & booking calendar
  - Customer directory and job detail views
- [ ] **Phase 4: AI Copilot & Automation Engine**
  - Inquiry classification pipeline
  - Smart reply drafting and schedule suggestions
  - Audit logging and human-in-the-loop approvals
- [ ] **Phase 5: Financial Operations & Polish**
  - Quotes, estimates, and invoice generation
  - Export capabilities (CSV, PDF)
  - Production deployment configuration
