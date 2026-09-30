# Emperor Smart Solutions — Enterprise Employee & Internship Assessment Platform

An enterprise-grade, browser-based full-stack assessment and screening platform built for **Emperor Smart Solutions**. Designed for conducting college internship screening assessments and managing question banks, live 15-question test snapshots, server-side timer validation, and candidate evaluations via a dedicated Admin Panel.

---

## 🏗 Architecture Overview

```
                      EMPEROR SMART SOLUTIONS
                                │
             ┌──────────────────┴──────────────────┐
             │                                     │
      CANDIDATE PORTAL                        ADMIN PANEL
   (Next.js 14+ App Router)             (Next.js 14+ App Router)
             │                                     │
             └──────────────────┬──────────────────┘
                                │
                          REST API (JWT)
                                │
                          NestJS Backend
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
            AuthModule   AssessmentsModule  QuestionsModule
                 │              │              │
           CandidatesModule ResultsModule   AdminModule
                 │              │              │
                 └──────────────┼──────────────┘
                                │
                            Prisma ORM
                                │
                      PostgreSQL / SQLite
                                │
             ┌──────────────────┴──────────────────┐
             │                                     │
         Candidates                           Questions
             │                                     │
        Assessments                             Results
             │
          Answers
```

---

## 🌟 Key Platform Features

### 1. Candidate Assessment Portal
- **Sequential Registration**: Captures Personal and Academic details with strict 10-digit mobile number constraints and automated sequential enrollment numbers starting at `000101` (`000101`, `000102`, etc.).
- **Locked 15-Question Assessment Snapshot**: Each candidate attempt receives an immutable 15-question snapshot (5 Mathematics, 5 Logical Reasoning, 5 Developer/Technical) unaffected by subsequent question bank edits.
- **Server-Side Timer & Anti-Cheat**: 60s per-question countdown enforced by the backend (`Date.now() - questionStartedAt`), with tab-switch detection and strict forward-only progression (no skip, no back navigation).
- **1-Minute Word Typing Test**: High-precision wall-clock speed and accuracy test evaluating WPM and accuracy metrics.
- **Detailed Composite Scorecard**: Composite results displaying marks (out of 15), section performance bars, and typing metrics.

### 2. Administrator Panel
- **Executive Dashboard (`/admin`)**: Real-time KPI tiles, score tier distributions, active 15/15 question configuration status, and recent candidate attempts.
- **Centralized Question Bank (`/admin/questions`)**:
  - Interactive UI Form and Live JSON Editor creation modes.
  - Bulk JSON Import with schema validation.
  - Downloadable JSON Export (All, by Section, or Active Assessment).
  - Safe Archiving (soft delete `isActive = false` if referenced by historical attempts).
- **Active Assessment Configurator (`/admin/assessment`)**:
  - Enforces strict rule: **5 Mathematics + 5 Logical Reasoning + 5 Developer/Technical = Exactly 15 Questions**.
  - Creates new version snapshots for subsequent attempts.
- **Candidate Roster (`/admin/candidates`)**: Complete student registry, search, status filters, and individual academic profiles.
- **Detailed Results Breakdown (`/admin/results/[id]`)**: Question-by-question candidate answer vs official answer comparison with time spent audits.
- **Audit Logs (`/admin/settings`)**: Immutable administrative action trail.

---

## 🔑 Default Administrator Credentials

| Field | Value |
|---|---|
| **Login URL** | `http://localhost:3000/admin/login` |
| **Email** | `admin@emperorsmartsolutions.com` |
| **Password** | `Admin@123` |
| **Role** | `SUPER_ADMIN` |

---

## 🚀 Quick Start Guide

### 1. Start Frontend (Next.js)
```bash
# In project root
npm install
npm run dev
# Candidate portal available at: http://localhost:3000
# Admin panel available at: http://localhost:3000/admin
```

### 2. Start Backend (NestJS + Prisma)
```bash
cd backend
npm install

# Push database schema & generate Prisma Client
npx prisma db push
npx prisma generate

# Seed initial admin & 15 assessment questions
npm run prisma:seed

# Start NestJS backend API server
npm run start:dev
# API running at: http://localhost:5000/api
```

### 3. Run with Docker Compose
```bash
docker-compose up --build
```

---

## 📡 REST API Endpoints

### Authentication
- `POST /api/auth/login` — Admin login with JWT token generation
- `GET  /api/auth/me` — Retrieve current admin session profile
- `POST /api/auth/logout` — Invalidate admin session

### Candidates
- `POST /api/candidates` — Register new candidate
- `GET  /api/candidates/next-enrollment-number` — Fetch next sequential ID (`000101`, `000102`...)
- `GET  /api/candidates` — List candidates (paginated, search & filter)
- `GET  /api/candidates/:id` — Get candidate profile and attempt history
- `DELETE /api/candidates/:id` — Delete candidate record

### Question Bank
- `GET    /api/questions` — List questions (paginated with filters)
- `POST   /api/questions` — Create question (Form or JSON)
- `GET    /api/questions/:id` — Get question details
- `PATCH  /api/questions/:id` — Update question
- `DELETE /api/questions/:id` — Safe delete or archive question
- `POST   /api/questions/import` — Bulk JSON import with schema validation
- `GET    /api/questions/export` — Export questions as downloadable JSON
- `POST   /api/questions/:id/duplicate` — Duplicate existing question

### Assessment Engine
- `GET   /api/assessment/configuration` — Get active 15-question configuration
- `PATCH /api/assessment/configuration` — Publish new 15-question version (5/5/5)
- `POST  /api/assessment/start` — Start candidate attempt & lock 15-question snapshot
- `GET   /api/assessment/attempt/:attemptId` — Get attempt state & server remaining time
- `POST  /api/assessment/attempt/:attemptId/answer` — Submit answer with server timer & scoring
- `POST  /api/assessment/attempt/:attemptId/timeout` — Handle 00:00 timeout
- `POST  /api/assessment/attempt/:attemptId/complete` — Finalize attempt & record typing test metrics

### Results & Dashboard
- `GET /api/results` — List all completed candidate evaluations
- `GET /api/results/:attemptId` — Detailed question-by-question candidate scorecard
- `GET /api/admin/dashboard` — Live dashboard KPI metrics, score distributions, and recent attempts
- `GET /api/admin/audit-logs` — Administrative audit logs

---

## 🔒 Security & Data Integrity

1. **Server-Side Scoring**: Correct answers are stripped from candidate API responses and verified exclusively on the backend.
2. **Server-Side Timer**: Elapsed time is verified against wall-clock database timestamps (`Date.now() - questionStartedAt`).
3. **Attempt Versioning**: Changing question bank configurations never modifies in-progress or past candidate results.
4. **Historical Safety**: Questions referenced by past attempts cannot be hard-deleted and are safely archived (`isActive = false`).
