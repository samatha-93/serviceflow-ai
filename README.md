# ServiceFlow AI

<div align="center">

**Less Admin. Better Business.**

An intelligent, portfolio-quality service business management platform engineered to automate enquiries, scheduling, customer communication, and routine administrative overhead.

[![License: MIT](https://img.shields.io/badge/License-MIT-176B67.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248.svg?logo=mongodb&logoColor=white)](https://mongoosejs.com/)

[Product Requirements](docs/requirements.md) • [System Architecture](docs/architecture.md) • [Repository](https://github.com/samatha-93/serviceflow-ai)

</div>

---

## 📌 Project Overview

Small and independent service providers frequently lose hours every week to manual paperwork, disjointed text messages, scheduling conflicts, and delayed follow-ups. **ServiceFlow AI** serves as the digital backbone for modern trade and service professionals, giving them a unified control center for customer records, bookings, and automated administrative operations.

### Supported Business Verticals
- **Outdoor & Property Services** — Landscaping, lawn care, tree maintenance, pressure washing.
- **Cleaning Services** — Residential, commercial, move-in/out, and post-construction.
- **Beauty & Wellness** — Mobile stylists, estheticians, massage therapists, personal trainers.
- **Home Maintenance** — Plumbing, electrical, HVAC, handyman repairs.
- **Independent Professionals** — Consultants, home inspectors, mobile notaries.

---

## 🎨 Design System

ServiceFlow AI utilizes a cohesive, accessible design system tailored for modern web applications:

| Token | Value | Preview | Role |
|---|---|---|---|
| **Primary Teal** | `#176B67` | ![#176B67](https://via.placeholder.com/15/176B67/000000?text=+) | Primary brand color, actions, badges |
| **Background** | `#F7F7F2` | ![#F7F7F2](https://via.placeholder.com/15/F7F7F2/000000?text=+) | Warm neutral page background |
| **Cards** | `#FFFFFF` | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/000000?text=+) | Elevational surfaces, modals, forms |
| **Primary Text** | `#242A2A` | ![#242A2A](https://via.placeholder.com/15/242A2A/000000?text=+) | High-contrast typography |
| **Secondary Text**| `#66716F` | ![#66716F](https://via.placeholder.com/15/66716F/000000?text=+) | Secondary labels, descriptions |
| **Typography** | Inter | Google Fonts | Crisp, legible geometric sans-serif |

---

## 🏗️ Architecture & Project Structure

The project is structured as a clean, modular monorepo:

```
Service-AI-Flow/
├── client/                     # Frontend Application (React + Vite + TS)
│   ├── public/                 # Static assets (favicon, icons)
│   ├── src/                    # Components, styles, and dashboard shell
│   ├── .env.example            # Client environment template
│   ├── package.json            # Client packages & scripts
│   └── vite.config.ts          # Vite build config with /api reverse proxy
│
├── server/                     # Backend API Service (Node.js + Express + TS)
│   ├── src/
│   │   ├── config/             # Environment & graceful database setup
│   │   ├── controllers/        # Request handlers & health checks
│   │   ├── routes/             # REST route declarations
│   │   ├── app.ts              # Express application & middleware
│   │   └── index.ts            # Server entrypoint & lifecycle management
│   ├── .env.example            # Server environment template
│   ├── package.json            # Server packages & scripts
│   └── tsconfig.json           # Server TypeScript compiler configuration
│
├── docs/                       # Project Documentation
│   ├── architecture.md         # Technical architecture specifications
│   └── requirements.md         # Product requirements document (PRD)
│
├── .env.example                # Root environment guide
├── .gitignore                  # Git ignore rules for node, dist, and secrets
├── package.json                # Monorepo workspaces & root execution scripts
└── README.md                   # This project guide
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**

### 1. Install Dependencies
Install dependencies for all workspaces from the project root:

```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment files for server and client:

```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration (optional for dev, Vite defaults to /api proxy)
cp client/.env.example client/.env
```

> **Note on Database:** During Phase 1, the backend automatically operates in non-blocking standby mode if local MongoDB is not running. Health checks and frontend interactions remain completely functional.

### 3. Start Development Servers
Run both client and server concurrently with one command:

```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🛠️ Monorepo Package Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts server and client concurrently with hot reloading |
| `npm run dev:client` | Starts only the Vite frontend dev server |
| `npm run dev:server` | Starts only the Express backend with `tsx watch` |
| `npm run build` | Compiles production builds for both client and server |
| `npm run build:client` | Runs TypeScript checks and builds the client bundle |
| `npm run build:server` | Compiles server TypeScript into CommonJS (`dist/`) |
| `npm run type-check` | Runs TypeScript validation across client and server |
| `npm run clean` | Cleans build artifacts (`dist/`) across workspaces |

---

## 🔒 Security & Git Hygiene

- **No Secrets in Repo:** All sensitive values, credentials, and API tokens are barred via `.gitignore`.
- **Environment Isolation:** Sample `.env.example` files document expected keys without exposing actual secrets.
- **Defensive API Standards:** `helmet` security headers, strict CORS origin controls, and sanitized error responses.

---

## 🗺️ Project Roadmap

- [x] **Phase 1: Project Foundation & Architecture** (Current)
  - Monorepo structure, Vite + React + TS, Express + TS, design system, and health checks.
- [ ] **Phase 2: Data Models & Core REST APIs**
  - Mongoose schemas for Enquiries, Bookings, Customers, and Services.
- [ ] **Phase 3: Interactive Dashboard UI**
  - Lead board, scheduling calendar, and customer directory.
- [ ] **Phase 4: AI Copilot & Automation Engine**
  - Automatic lead intake triage, AI quote drafting, and schedule suggestions.
- [ ] **Phase 5: Estimates, Invoices & Production Deployment**
  - PDF generation, digital signatures, and cloud infrastructure setup.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
