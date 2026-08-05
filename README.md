# SafeHer AI - Proactive Safety Monitoring Platform

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active%20Development-informational?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Python-3.10+-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Node.js-18+-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/React-18.3.1-61dafb?style=flat-square" />
  <img src="https://img.shields.io/badge/Django-5.x-green?style=flat-square" />
</div>

---


## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [Project Architecture](#project-architecture)
- [Features in Detail](#features-in-detail)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**SafeHer AI** is a full-stack proactive safety monitoring platform built with a React + Vite frontend and a Django REST backend. The system monitors live location context, calculates safety and risk scores, supports SOS workflows, detects emergency voice cues, and uses agentic automation to recommend or trigger protective actions.

**Live App**: [https://safeher-ai-five.vercel.app/](https://safeher-ai-five.vercel.app/)

This is a personal portfolio project built to showcase full-stack engineering ability, AI/ML integration, product thinking, and the potential to turn a real-world safety problem into a polished technical solution. It keeps the frontend, backend, and shared documentation separated so the architecture is clear, scalable, and easy to extend.

### Mission

Help users move with more confidence by combining live tracking, contextual risk analysis, safe-route intelligence, and fast emergency response workflows.

---

## Key Features

### Core Safety Monitoring

- **Safety Dashboard** - Live safety score, risk state, route context, and alert status.
- **Live Route Tracking** - User location updates, route visibility, and tracking session state.
- **Risk Engine Panel** - Real-time scoring based on time, area type, isolation, and manual SOS signals.
- **Emergency SOS** - Manual emergency activation with alert messaging and location context.
- **Trusted Contacts** - Contact storage for emergency communication workflows.

### AI and Intelligence

- **ML Risk Analysis** - Backend risk engine powered by scikit-learn, numpy, and pandas.
- **Agentic Safety Engine** - Autonomous defensive workflows based on risk thresholds.
- **Safe Route Intelligence** - Route ranking using distance to safe zones and contextual safety metrics.
- **Voice SOS Detection** - Transcript keyword detection for emergency phrases such as help, danger, SOS, and local-language cues.
- **Google Maps Integration** - Optional Google Maps API support for geocoding and nearby safe-place lookup.

### Emergency Response

- **Autonomous Alerts** - High-risk events can trigger automated safety responses.
- **SOS Dispatch Flow** - Emergency alert endpoints for trusted contact notification.
- **Alert History** - Backend models and endpoints for tracking generated alerts.
- **Fallback Safe Zones** - Mumbai-focused default safe zones when external map services are unavailable.

### Frontend Experience

- **Responsive React UI** - Vite, TypeScript, Tailwind CSS, and shadcn/ui components.
- **Authentication Screens** - Login and registration flows wired to the backend.
- **Map-Based Tracking** - Google Maps and Leaflet-ready dependencies for location visualization.
- **Voice SOS Indicator** - Frontend voice monitoring state and emergency UI feedback.
- **Charts and Status Cards** - Recharts and reusable UI primitives for clear safety summaries.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 5.4.19 | Build tool and dev server |
| **Tailwind CSS** | 3.4.17 | Styling |
| **shadcn/ui + Radix UI** | Latest package versions | Accessible UI primitives |
| **React Router** | 6.30.1 | Client-side routing |
| **TanStack Query** | 5.83.0 | Server-state management |
| **Recharts** | 2.15.4 | Data visualization |
| **Lucide React** | 0.462.0 | Icons |
| **Google Maps Loader** | 2.0.2 | Google Maps integration |
| **Vitest** | 3.2.4 | Frontend testing |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.10+ | Runtime |
| **Django** | 5.x | Web framework |
| **Django REST Framework** | 3.x | API framework |
| **Simple JWT** | 5.x | JWT authentication |
| **SQLite** | Built in | Local development database |
| **PostgreSQL** | Optional | Production-ready database via `DATABASE_URL` |
| **scikit-learn** | 1.x | ML risk classification |
| **numpy / pandas** | 1.x / 2.x | Data processing |
| **geopy** | 2.x | Geospatial distance calculations |
| **Gunicorn** | 22.x | Production WSGI server |

### Infrastructure and Deployment

- **Render** configuration through `render.yaml`
- **Vercel** frontend configuration through `frontend/vercel.json`
- **Gunicorn** for backend production serving
- **JWT Authentication** for protected user flows
- **CORS Headers** for local frontend-backend development

---

## Project Structure

```text
safeher-ai/
|-- backend/
|   |-- accounts/                 # User auth, profile, trusted contacts
|   |-- agents/                   # Agentic emergency workflow engine
|   |-- alerts/                   # SOS, alert dispatch, voice detection
|   |-- routes/                   # Safe route and nearby safe-place APIs
|   |-- tracking/                 # Live tracking, risk scoring, ML engine
|   |-- safeher_ai/               # Django settings and root routing
|   |-- utils/                    # Shared backend helpers
|   |-- manage.py                 # Django CLI entry point
|   |-- requirements.txt          # Backend dependencies
|   |-- start.sh                  # Deployment startup script
|   `-- README.md                 # Backend-specific notes
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- safeher/          # SafeHer-specific product UI
|   |   |   `-- ui/               # Reusable shadcn/ui primitives
|   |   |-- hooks/                # Shared React hooks
|   |   |-- lib/                  # API clients and utilities
|   |   |-- pages/                # Route-level screens
|   |   |-- test/                 # Vitest setup and tests
|   |   |-- App.tsx               # App shell and routes
|   |   |-- main.tsx              # React entry point
|   |   `-- index.css             # Global styles and theme tokens
|   |-- public/                   # Static assets
|   |-- package.json              # Frontend dependencies and scripts
|   |-- vite.config.ts            # Vite configuration and API proxy
|   |-- tailwind.config.ts        # Tailwind configuration
|   `-- vercel.json               # Vercel deployment config
|
|-- docs/
|   |-- API_REFERENCE.md          # Detailed API examples
|   |-- ARCHITECTURE.md           # System design notes
|   |-- DEVELOPMENT.md            # Development workflow
|   |-- SETUP.md                  # Setup notes
|   `-- CHANGES_SUMMARY.md        # Change history summary
|
|-- data/                         # Project data assets
|-- projects/                     # Project support material
|-- render.yaml                   # Render deployment config
|-- Procfile                      # Process declaration
|-- requirements.txt              # Root deployment dependency entry
|-- LICENSE                       # MIT license
`-- README.md                     # This file
```

---

## Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Python** 3.10 or higher
- **pip** 21.0 or higher
- **Git**
- **Google Maps API key** for full maps, geocoding, and nearby places support
- **PostgreSQL** optional for production-style local testing

SQLite is used by default for local development, so a separate database server is not required to get started.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/safeher-ai.git
cd safeher-ai
```

### 2. Backend Setup

#### Create and Activate a Virtual Environment

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.\.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Run Migrations

```bash
python manage.py makemigrations accounts tracking agents alerts routes
python manage.py migrate
```

#### Create an Admin User

```bash
python manage.py createsuperuser
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

---

## Configuration

### Backend Environment Variables

Create `backend/.env` for local overrides when needed.

```env
# Django
DJANGO_SECRET_KEY=replace-this-with-a-secure-secret
DJANGO_DEBUG=1

# Database
# Optional. If omitted, SQLite is used.
DATABASE_URL=postgres://user:password@localhost:5432/safeher_ai

# Email
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=1
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=no-reply@safeher.local

# Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Frontend Environment Variables

The Vite dev server proxies `/api` to `http://127.0.0.1:8000`, so local frontend calls can use relative API paths.

For browser-side Google Maps support, create `frontend/.env` if the app reads a Vite public key in your local branch:

```env
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## Running the Project

### Option 1: Manual Development Setup

#### Terminal 1 - Backend

```bash
cd backend
.\.venv\Scripts\activate
python manage.py runserver 8000
```

On macOS/Linux, replace the activation command with:

```bash
source .venv/bin/activate
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

The application will be available at:

- **Frontend**: `http://localhost:8080`
- **Backend API**: `http://localhost:8000/api`
- **Admin Panel**: `http://localhost:8000/admin`

### Option 2: Production Build Preview

```bash
cd frontend
npm run build
npm run preview
```

---

## API Documentation

### Base URL

```text
http://localhost:8000/api
```

During frontend development, requests to `/api` are proxied to the Django backend by Vite.

### Authentication

JWT endpoints are available for user flows. Include the access token on protected requests:

```text
Authorization: Bearer <access-token>
```

The current backend defaults to permissive API access so the hosted frontend and local development flow can run smoothly while the project evolves.

### Key Endpoints

#### Authentication and Profile

- `POST /api/register/` - Create a user account.
- `POST /api/login/` - Obtain JWT access and refresh tokens.
- `POST /api/logout/` - Logout and invalidate refresh tokens.
- `POST /api/token/refresh/` - Refresh an access token.
- `GET /api/profile/` - Fetch the active user profile.
- `GET /api/contacts/` - List trusted emergency contacts.
- `POST /api/contacts/` - Create an emergency contact.

#### Live Tracking and Risk

- `POST /api/start-tracking` - Start a tracking session.
- `POST /api/location` - Submit location updates for the current session.
- `GET /api/risk` - Fetch the current risk snapshot.
- `POST /api/location/update/` - Persist a location log.
- `GET /api/location/history/` - Fetch location history.
- `GET /api/location/safezones/` - Fetch configured safe zones.
- `POST /api/risk/analyze/` - Submit telemetry for ML risk analysis.
- `GET /api/risk/history/` - Fetch historical risk analysis records.

#### Agentic Safety Engine

- `POST /api/agent/trigger/` - Ask the agent engine to evaluate a risk score and choose defensive actions.
- `GET /api/agent/actions/` - List agent actions.

#### Alerts and SOS

- `POST /api/sos/activate/` - Trigger an SOS workflow.
- `POST /api/alerts/send/` - Send an alert payload.
- `GET /api/alerts/` - List generated alerts.
- `POST /api/voice/detect/` - Detect SOS intent from a speech transcript.

#### Routes and Safe Places

- `POST /api/routes/safest/` - Rank safest route options.
- `POST /api/routes/nearby-safe-places/` - Find nearby safe locations.
- `POST /api/routes/geocode/` - Geocode a location.
- `GET /api/routes/maps-status/` - Check Google Maps configuration status.

For complete examples, see [docs/API_REFERENCE.md](docs/API_REFERENCE.md).

---

## Database Setup

### SQLite

SQLite is the default development database. After installing backend dependencies, run:

```bash
cd backend
python manage.py migrate
```

This creates `backend/db.sqlite3`.

### PostgreSQL

For production-style local testing, set `DATABASE_URL`:

```env
DATABASE_URL=postgres://safeher_user:your_password@localhost:5432/safeher_ai
```

Example setup:

```bash
createdb safeher_ai
createuser safeher_user -P
psql -c "GRANT ALL PRIVILEGES ON DATABASE safeher_ai TO safeher_user;"
```

Then run:

```bash
cd backend
python manage.py migrate
```

### Main Django Apps

- **accounts** - Users and emergency contacts.
- **tracking** - Location logs, risk analysis, and ML scoring.
- **agents** - Autonomous safety decisions and action records.
- **alerts** - SOS dispatches, alert logs, and voice detection.
- **routes** - Safe route recommendations and safe-place lookup.

---

## Project Architecture

### System Architecture

```text
+------------------------------------------------------------------+
|                    FRONTEND (React + TypeScript)                 |
|            Vite | Tailwind CSS | shadcn/ui | Maps UI             |
+-------------------------------+----------------------------------+
                                |
                                | HTTP requests through /api proxy
                                v
+------------------------------------------------------------------+
|                 BACKEND API (Django REST Framework)              |
|          JWT Auth | CORS | Risk APIs | SOS APIs | Routes         |
+-------------------------------+----------------------------------+
                                |
        +-----------------------+-----------------------+
        |                       |                       |
        v                       v                       v
+---------------+       +---------------+       +----------------+
| Tracking App  |       | Agents App    |       | Alerts App     |
| ML Risk Score |       | Decisions     |       | SOS + Voice    |
+-------+-------+       +-------+-------+       +--------+-------+
        |                       |                        |
        +-----------------------+------------------------+
                                |
        +-----------------------+-----------------------+
        |                       |                       |
        v                       v                       v
+---------------+       +---------------+       +----------------+
| SQLite/Postgres|      | Google Maps   |       | Email Backend  |
| App Database  |       | Optional APIs |       | Console/SMTP   |
+---------------+       +---------------+       +----------------+
```

### Risk Workflow

```text
User starts tracking
        |
        v
Frontend sends location and context
        |
        v
Django tracking API validates telemetry
        |
        v
Risk engine calculates score and factors
        |
        +--> Low risk: continue monitoring
        +--> Medium risk: increase awareness
        +--> High risk: trigger agent recommendations
        +--> SOS: activate emergency workflow
        |
        v
Frontend updates safety dashboard and alert UI
```

### Agentic Response Thresholds

```text
risk_score >= 85  -> full emergency workflow
risk_score >= 70  -> high-risk response, location sharing, safe-route suggestions
risk_score >= 50  -> active monitoring and increased polling
risk_score < 50   -> standard monitoring
```

---

## Features in Detail

### 1. Safety Score

The frontend displays a user-friendly safety score while the backend computes a risk score from contextual inputs. Lower risk produces a higher safety score.

```text
safety_score = 100 - risk_score
```

Risk factors include:

- Time of day
- Area type
- Isolation level
- Location source
- SOS status
- Safe-zone proximity

### 2. ML Risk Analysis

The tracking app includes a `RiskMLEngine` that uses scikit-learn to classify risk from telemetry. It is self-contained and does not require an external model file, making it easier to run locally, deploy, and explain as part of the project architecture.

### 3. Voice SOS Detection

The alerts app can inspect speech transcripts for configured emergency keywords:

```text
help, save me, emergency, danger, sos, bachao, madad
```

When a keyword is detected, the frontend can surface emergency UI and the backend can create an alert workflow.

### 4. Safe Routes

The routes app ranks path options using safety-oriented heuristics such as:

- Distance to known safe zones
- Area isolation
- Time of day
- Nearby hospitals, police stations, stations, and public areas

### 5. Emergency Contacts

The accounts app supports trusted contact management so SOS and alert workflows can be extended to real notification delivery.

### 6. Simulation Controls

The app supports night-mode and isolated-area simulations. These controls make it easy to show changing risk levels without needing to physically move through different environments.

---

## Available Scripts

Run frontend scripts from `frontend/`.

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the Vite development server on port 8080 |
| `npm run build` | Create a production frontend build |
| `npm run build:dev` | Build using development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

Run backend commands from `backend/`.

| Command | Purpose |
|---------|---------|
| `python manage.py runserver 8000` | Start the Django development server |
| `python manage.py makemigrations` | Create migrations |
| `python manage.py migrate` | Apply migrations |
| `python manage.py createsuperuser` | Create an admin user |
| `python manage.py test` | Run Django tests |

---

## Contributing

Contributions are welcome. Please keep changes focused and update documentation when API behavior, routing, configuration, or architecture changes.

### Development Workflow

1. Fork or branch from the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes in the relevant layer.
4. Run tests and build checks.
5. Submit a pull request with a clear summary.

### Code Standards

- Keep frontend work inside `frontend/` unless API contracts or deployment config change.
- Keep backend work inside `backend/` unless shared docs need updates.
- Follow existing React, TypeScript, Django, and DRF patterns.
- Update [docs/API_REFERENCE.md](docs/API_REFERENCE.md) when endpoint behavior changes.
- Prefer small, reviewable changes over broad refactors.

### Testing

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm run test

# Frontend production build
cd frontend
npm run build
```

---

## Production Notes

- The backend uses SQLite by default and switches to PostgreSQL when `DATABASE_URL` is set.
- `ALLOWED_HOSTS` and CORS settings are permissive for development convenience and should be tightened before production release.
- The email backend defaults to console output unless SMTP credentials are provided.
- Google Maps features gracefully fall back to configured safe zones when API credentials are unavailable.
- The original tracking endpoints are still present because the frontend depends on them.

---

## Support and Documentation

- **Backend Notes**: [backend/README.md](backend/README.md)
- **API Reference**: [docs/API_REFERENCE.md](docs/API_REFERENCE.md)
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Setup Guide**: [docs/SETUP.md](docs/SETUP.md)
- **Development Guide**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

---

## Project Status

- Completed: React + Vite frontend shell
- Completed: Django REST backend structure
- Completed: Tracking session endpoints
- Completed: JWT auth endpoints
- Completed: ML risk analysis service
- Completed: Agentic action engine
- Completed: SOS and voice-detection endpoints
- Completed: Safe-route and safe-place endpoints
- In progress: Production hardening
- Planned: Persistent notification delivery
- Planned: Stronger auth enforcement across sensitive endpoints
- Planned: Mobile-first deployment flow

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <p><strong>Built as a personal full-stack AI project</strong></p>
  <p>Copyright 2026 SafeHer AI. All rights reserved.</p>
</div>
