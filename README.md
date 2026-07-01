# AI Lost & Found System

ระบบจัดการของหาย-ของพบ พร้อม AI จับคู่อัตโนมัติจากรูปภาพและข้อความ

An AI-powered system for matching lost and found items using CLIP image embeddings and Sentence Transformer text embeddings.

## Overview

This system helps organizations (schools, universities, hotels, co-working spaces) automatically match lost items with found items using AI.

### Key Features

- **User Lost Item Reporting** — Submit lost item details with photos
- **Staff Found Item Recording** — Log found items with photos
- **AI Automatic Matching** — CLIP (512-dim) image embeddings + Sentence Transformers (384-dim) text embeddings stored in pgvector
- **Smart Notifications** — In-app notifications for matches
- **Claim Management** — Users claim found items, staff approves returns
- **Admin Dashboard** — Statistics and user management
- **JWT Authentication** — Secure login with access + refresh tokens

## Implementation Status

| Feature | Status |
|---|---|
| Docker infrastructure (frontend, backend, postgres, minio) | ✅ Complete |
| PostgreSQL + pgvector extension | ✅ Complete |
| Database schema (6 tables) | ✅ Complete |
| User authentication (register / login / refresh) | ✅ Complete |
| Lost items CRUD API | ✅ Complete |
| Found items CRUD API | 🔜 Planned |
| AI matching pipeline (CLIP + Sentence Transformers) | 🔜 Planned |
| Claim workflow API | 🔜 Planned |
| Notifications API | 🔜 Planned |
| Frontend pages (7 pages) | ✅ Complete |
| Frontend ↔ Backend integration | 🔄 In Progress |

## Tech Stack

### Frontend
- React 18 + TypeScript (strict mode)
- Vite 5
- PrimeReact 10 (UI components)
- Tailwind CSS 3
- TanStack React Query 5
- React Router v6
- Axios with JWT interceptor
- Tabler Icons

### Backend
- Python 3.11 + FastAPI 0.104
- SQLAlchemy 2.0 (async) + asyncpg
- PostgreSQL 15 + pgvector 0.5
- Pydantic V2
- JWT (python-jose + passlib/bcrypt)
- MinIO (S3-compatible image storage)
- CLIP + Sentence Transformers *(embeddings — planned)*

### Infrastructure
- Docker + Docker Compose
- 4-service orchestration on custom bridge network
- Multi-stage frontend build (Node 18-alpine)
- Health checks on postgres and minio

## Database Schema

| Table | Description |
|---|---|
| `user` | Accounts with roles (user / staff / admin) |
| `lost_item` | Lost items with pgvector embeddings |
| `found_item` | Found items recorded by staff |
| `match` | AI scores: image_score, text_score, combined_score |
| `claim_request` | Ownership claim workflow |
| `notification` | In-app notifications |

## API Endpoints

### Authentication
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT tokens |
| POST | `/api/auth/refresh` | Refresh access token |

### Lost Items
| Method | Path | Description |
|---|---|---|
| POST | `/api/lost-items/` | Report lost item |
| GET | `/api/lost-items/` | List (own items for users, all for staff/admin) |
| GET | `/api/lost-items/{id}` | Get item details |
| PUT | `/api/lost-items/{id}` | Update item |
| DELETE | `/api/lost-items/{id}` | Delete item |

Full interactive docs: **http://localhost:8000/docs**

## Project Structure

```
lostAndFound/
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout, ProtectedRoute, common UI
│   │   ├── pages/           # Dashboard, LostItems, FoundItems, Matches, Claims, Notifications, Admin
│   │   ├── hooks/           # useApi (React Query hooks)
│   │   ├── context/         # AuthContext (JWT + localStorage)
│   │   ├── services/        # api.ts (Axios client)
│   │   └── types/           # Shared TypeScript types
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── Dockerfile.frontend
│
├── backend/
│   ├── app/
│   │   ├── models/          # User, LostItem, FoundItem, Match, ClaimRequest, Notification
│   │   ├── schemas/         # Pydantic V2 request/response schemas
│   │   ├── routes/          # auth.py, lost_items.py
│   │   ├── services/        # auth.py (JWT, bcrypt)
│   │   ├── dependencies.py  # get_current_user, require_staff, require_admin
│   │   ├── main.py          # FastAPI app factory + startup
│   │   ├── config.py        # Pydantic Settings
│   │   └── database.py      # Async engine + init_db()
│   ├── alembic/
│   └── pyproject.toml
│
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── Dockerfile.postgres   # PostgreSQL 15 + pgvector built from source
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites
- Docker & Docker Compose

### Start with Docker

```bash
# 1. Clone and configure
git clone https://github.com/kiwabc123/LostAndFound.git
cd LostAndFound
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Access
# Frontend:   http://localhost:3000
# API:        http://localhost:8000
# API Docs:   http://localhost:8000/docs
# MinIO UI:   http://localhost:9001
```

### Demo Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin1234` |

> Register new users at `POST /api/auth/register` or through the login page.

## Local Development

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -e ".[dev]"
cp .env.example .env         # set DATABASE_URL to localhost
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env         # set VITE_API_BASE_URL=http://localhost:8000/api
npm run dev
```

## Environment Variables

Key variables (see `.env.example` for full list):

| Variable | Description |
|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://user:pass@postgres:5432/db` |
| `JWT_SECRET_KEY` | Secret key for signing JWT tokens (min 32 chars) |
| `MINIO_ENDPOINT` | MinIO URL (e.g. `http://minio:9000`) |
| `VITE_API_BASE_URL` | Frontend → Backend URL |

## User Roles

| Role | Permissions |
|---|---|
| **user** | Report lost items, browse found items, submit claims |
| **staff** | All user permissions + record found items, manage claims |
| **admin** | All permissions + user management, dashboard statistics |

## Docker Commands

```bash
docker-compose up -d                    # Start all services
docker-compose down                     # Stop all services
docker-compose up -d backend --build    # Rebuild and restart backend
docker-compose logs -f backend          # View backend logs
docker-compose exec -T postgres psql -U lostfound_user -d lostfound_db  # DB shell
```

## Testing

```bash
# Backend
cd backend && pytest tests/ --cov=app

# Frontend
cd frontend && npm run test
```

## Code Quality

```bash
# Backend
black app && ruff check app --fix && mypy app

# Frontend
npm run lint && npm run format
```

## License

MIT License

---

**Last Updated**: 2026-07-01
**Version**: 1.0.0-mvp
