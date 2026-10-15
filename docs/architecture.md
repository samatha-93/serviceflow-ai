# ServiceFlow AI — System Architecture & Technical Design

> **Tagline:** Less Admin. Better Business.  
> **Repository:** [https://github.com/samatha-93/serviceflow-ai.git](https://github.com/samatha-93/serviceflow-ai.git)  
> **Status:** Phase 1 Foundation

---

## 1. System Topology Overview

ServiceFlow AI is structured as a maintainable, high-performance monorepo separating client presentation, server API services, and shared documentation.

```
+-------------------------------------------------------------------------+
|                              Client Layer                                |
|  React 18  *  TypeScript  *  Vite  *  Tailwind CSS  *  Inter Typography  |
|  (Port: 5173  *  Reverse Proxy: /api -> http://localhost:5000)          |
+------------------------------------+------------------------------------+
                                     |  HTTP / REST (JSON)
                                     v
+-------------------------------------------------------------------------+
|                              Backend Layer                              |
|  Node.js (>=18)  *  Express  *  TypeScript  *  Helmet  *  CORS          |
|  (Port: 5000  *  Layered Architecture: Config / Routes / Controllers)    |
+------------------------------------+------------------------------------+
                                     |  Mongoose ODM (Non-blocking)
                                     v
+-------------------------------------------------------------------------+
|                               Data Layer                                 |
|  MongoDB (Standby-resilient in Phase 1; schemas planned for Phase 2)     |
+-------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
Service-AI-Flow/
├── client/                     # Frontend Application (React + Vite + TS)
│   ├── public/                 # Static assets (favicon.svg, manifest)
│   ├── src/
│   │   ├── App.tsx             # Primary application dashboard shell
│   │   ├── index.css           # Tailwind directives & design system rules
│   │   └── main.tsx            # React DOM bootstrap
│   ├── .env.example            # Client environment variable template
│   ├── index.html              # HTML5 entry with Google Fonts (Inter) & SEO
│   ├── package.json            # Client dependencies & scripts
│   ├── postcss.config.js       # PostCSS Tailwind & Autoprefixer plugin config
│   ├── tailwind.config.js      # Design tokens (Colors, typography, shadows)
│   ├── tsconfig.json           # Client TypeScript configuration
│   └── vite.config.ts          # Vite build config with local API proxy
│
├── server/                     # Backend API Service (Node.js + Express + TS)
│   ├── src/
│   │   ├── config/             # System configuration
│   │   │   ├── database.ts     # MongoDB / Mongoose connection with standby fallback
│   │   │   └── env.ts          # Strongly typed environment configuration
│   │   ├── controllers/        # Request handlers
│   │   │   └── health.controller.ts # Health check controller
│   │   ├── routes/             # Express route declarations
│   │   │   ├── health.routes.ts # Health route endpoints
│   │   │   └── index.ts        # Centralized API router (/api)
│   │   ├── app.ts              # Express application configuration & middleware
│   │   └── index.ts            # Server entry point & process lifecycle
│   ├── .env.example            # Backend environment variable template
│   ├── package.json            # Server dependencies & scripts
│   └── tsconfig.json           # Server TypeScript configuration
│
├── docs/                       # Project Documentation
│   ├── architecture.md         # System design & technical architecture
│   └── requirements.md         # Product requirements document (PRD)
│
├── .env.example                # Root environment guide
├── .gitignore                  # Comprehensive Git exclusion rules
├── package.json                # Monorepo workspaces & concurrent scripts
└── README.md                   # Project overview, installation, & workflow guide
```

---

## 3. Frontend Architecture

### 3.1 Technology Stack
- **Framework:** React 18
- **Language:** TypeScript 5
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3
- **Iconography:** Lucide React

### 3.2 Design System Tokens
The user interface adheres to strict design system standards:

| Token Name | Hex Value | Semantic Role |
|---|---|---|
| **Primary Teal** | `#176B67` | Primary brand color, key actions, badges, active states |
| **Teal Light** | `#218E89` | Hover states, secondary accents |
| **Teal Dark** | `#104C49` | Deep gradients, text highlights |
| **Surface Background** | `#F7F7F2` | Warm neutral page background |
| **Surface Card** | `#FFFFFF` | Elevation cards, modals, content containers |
| **Primary Text** | `#242A2A` | High-contrast headings and body copy |
| **Secondary Text** | `#66716F` | Subtitles, helper text, and inactive states |
| **Typography** | Inter | Modern sans-serif via Google Fonts |

### 3.3 Component Design Principles
- **Predictable State Flow:** State is managed locally or through React Context where cross-component sharing is required.
- **Fail-Safe Health Polling:** The client gracefully handles backend connectivity states (Offline, Connecting, Operational) without unhandled promise rejections.
- **Tailwind Modularity:** Styles are organized through semantic Tailwind classes backed by curated tokens defined in `tailwind.config.js`.

---

## 4. Backend Architecture

### 4.1 Technology Stack
- **Runtime:** Node.js (v18+)
- **Framework:** Express 4
- **Language:** TypeScript 5
- **Database ODM:** Mongoose 8
- **Development Tooling:** TSX (watch mode)

### 4.2 Layered Architecture Pattern
The backend adheres to a clean separation of concerns:

1. **Config Layer (`src/config/`):** Isolates environment variable parsing (`env.ts`) and database lifecycle management (`database.ts`).
2. **Application Layer (`src/app.ts`):** Enforces security headers via `helmet`, controls cross-origin access with `cors`, logs incoming requests, and handles global 404 and 500 errors.
3. **Routing Layer (`src/routes/`):** Maps REST endpoints to corresponding controllers without mixing business logic.
4. **Controller Layer (`src/controllers/`):** Extracts request parameters, delegates to service logic, and returns formatted JSON responses.
5. **Data Layer (`src/models/` - Planned for Phase 2):** Encapsulates Mongoose schemas, indexes, and validation rules.

### 4.3 Resilience & Standby Mode
Phase 1 does not require an active MongoDB instance to complete health checks:
- The database connection is initiated asynchronously without blocking the Express listener.
- If MongoDB is unreachable, the system enters an informative **standby mode** rather than throwing fatal unhandled exceptions.
- The `/api/health` endpoint exposes real-time database connection status (`connected`, `connecting`, or `disconnected`).

---

## 5. Security & Environment Configuration

### 5.1 Zero-Secrets Policy
- No credentials, tokens, connection strings, or sensitive keys are committed to version control.
- Git excludes `.env`, `*.env`, and local variant files.
- Safe templates (`.env.example`) are provided at the root, client, and server levels.

### 5.2 Defensive Defaults
- `helmet()` automatically secures HTTP response headers against clickjacking, sniffing, and XSS.
- CORS is locked to `CLIENT_ORIGIN` (`http://localhost:5173` in development).
- Server gracefully captures `SIGINT` and `SIGTERM` signals, closing open socket connections and database handles cleanly.

---

## 6. Monorepo Scripts & Developer Experience

The root `package.json` uses npm workspaces to coordinate client and server tasks from a single command line:

```bash
# Run client and server concurrently in development
npm run dev

# Run only the client (Vite: http://localhost:5173)
npm run dev:client

# Run only the server (TSX watch: http://localhost:5000)
npm run dev:server

# Perform type checking across both workspaces
npm run type-check

# Compile production bundles for client and server
npm run build
```

---

## 7. Next Architectural Milestones (Phases 2-4)

1. **Phase 2 (Mongoose Schemas & Validation):** Define schemas for `Business`, `Customer`, `ServiceItem`, `Enquiry`, and `Booking`. Integrate `zod` for type-safe schema validation.
2. **Phase 3 (Dashboard Layout & State Management):** Implement reusable layout shells, navigation drawers, and data tables.
3. **Phase 4 (AI Engine Orchestration):** Integrate LLM adapter layer with prompt templates, structured output parsing, and rate-limiting safeguards.
