# AI Lost & Found System

ระบบจัดการของหาย-ของพบ พร้อม AI จับคู่อัตโนมัติจากรูปภาพและข้อความ

An AI-powered system for matching lost and found items with automatic image and text analysis.

## Overview

This system helps organizations (schools, universities, hotels, co-working spaces) automatically match lost items with found items using AI image embeddings (CLIP) and text embeddings (Sentence Transformers).

### Key Features

- **User Lost Item Reporting**: Upload item details and photos
- **Staff Found Item Recording**: Log found items with photos
- **AI Automatic Matching**: CLIP image embeddings + Sentence Transformers text embeddings
- **Smart Notifications**: Email + in-app notifications for matches
- **Claim Management**: Users claim found items, staff approves returns
- **Admin Dashboard**: Statistics and monitoring

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- PrimeReact
- Tailwind CSS
- React Query
- React Router

### Backend
- FastAPI
- SQLAlchemy + PostgreSQL
- pgvector (vector similarity search)
- Pydantic V2
- JWT Authentication
- MinIO (image storage)
- CLIP + Sentence Transformers (AI embeddings)

### Infrastructure
- Docker + Docker Compose
- PostgreSQL 15
- MinIO S3-compatible storage

## Project Structure

```
lost-and-found/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # Context API
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.example
│
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utilities
│   │   ├── tests/           # Unit tests
│   │   ├── main.py          # FastAPI app
│   │   ├── config.py        # Settings
│   │   ├── database.py      # DB setup
│   │   └── dependencies.py  # Dependency injection
│   ├── alembic/             # Database migrations
│   ├── pyproject.toml
│   └── .env.example
│
├── docker/                  # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── init-postgres.sql    # PostgreSQL init script
│
├── docker-compose.yml       # Docker Compose orchestration
├── .env.example             # Root environment template
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for backend development)

### Quick Start with Docker

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- MinIO: http://localhost:9001 (credentials in .env)
- API Docs: http://localhost:8000/docs
```

### Local Development

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"

# Copy environment file
cp .env.example .env

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start dev server
npm run dev
```

## API Documentation

Once the backend is running, view the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Database

### Migrations

Run Alembic migrations:

```bash
cd backend
alembic upgrade head
```

Create a new migration:

```bash
alembic revision --autogenerate -m "Description of changes"
```

## Testing

### Backend Tests

```bash
cd backend
pytest tests/ --cov=app --cov-report=term
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## Environment Variables

See `.env.example` files in root, `frontend/`, and `backend/` directories for all required environment variables.

### Key Variables

**Backend:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET_KEY`: Secret key for JWT tokens
- `MINIO_*`: MinIO configuration
- `SMTP_*`: Email configuration

**Frontend:**
- `VITE_API_BASE_URL`: Backend API URL

## User Roles

1. **User**: Report lost items, browse found items, claim found items
2. **Staff**: Record found items, manage claims, approve returns
3. **Admin**: User management, dashboard, statistics

## Development Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "Describe changes"`
3. Push to remote: `git push origin feature/feature-name`
4. Create Pull Request on GitHub
5. Get code review and merge

## Code Quality

### Frontend
- ESLint + Prettier
- TypeScript strict mode
- React component tests

### Backend
- Black code formatter
- Ruff linter
- mypy type checking
- Unit tests with pytest

## Deployment

See [Deployment Guide](./DEPLOYMENT.md) for production deployment instructions.

## Contributing

1. Follow code style guidelines (see above)
2. Write tests for new features
3. Update documentation
4. Create descriptive commit messages

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub Issue or contact the development team.

---

**Last Updated**: 2026-06-22
**MVP Version**: 1.0
