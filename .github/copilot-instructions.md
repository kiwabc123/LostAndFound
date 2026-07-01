# AI Lost & Found System - Copilot Instructions

## Project Overview

AI Lost & Found System is a comprehensive platform for matching lost and found items using AI embeddings (CLIP for images, Sentence Transformers for text).

**Tech Stack:**
- Frontend: React + TypeScript + Vite + PrimeReact + Tailwind CSS
- Backend: FastAPI + SQLAlchemy + PostgreSQL + pgvector
- Storage: MinIO
- AI: CLIP + Sentence Transformers
- Deployment: Docker + Docker Compose

## Coding Standards

### Frontend (React + TypeScript)

- **Language & Framework**: React 18+, TypeScript strict mode
- **Build Tool**: Vite
- **UI Library**: PrimeReact (NO Bootstrap, NO Material UI)
- **Icons**: Tabler Icons
- **Styling**: Tailwind CSS (NO inline styles)
- **State Management**: React Context API + React Query
- **Type Safety**: All components must have typed props interfaces
- **Component Pattern**:
  ```typescript
  interface ComponentProps {
    title: string;
    isLoading?: boolean;
  }
  
  const Component: React.FC<ComponentProps> = ({ title, isLoading }) => (
    <div className="rounded-xl shadow-sm border border-gray-200 bg-white p-6">
      {/* Content */}
    </div>
  );
  ```
- **API Integration**: Use React Query with custom hooks
- **File Naming**: PascalCase for components, camelCase for utilities
- **No Inline Styles**: All styling via Tailwind classes

### Backend (FastAPI + Python)

- **Language & Framework**: Python 3.11+ with FastAPI
- **Type Hints**: Required for all functions and variables
- **ORM**: SQLAlchemy with async support
- **Validation**: Pydantic V2
- **Authentication**: JWT with Passlib + python-jose
- **Code Format**: Black (2-space indent)
- **Linting**: Ruff
- **Type Checking**: mypy
- **Function Pattern**:
  ```python
  from typing import List
  from fastapi import APIRouter, Depends
  
  router = APIRouter(prefix="/items", tags=["items"])
  
  @router.get("/", response_model=List[ItemSchema])
  async def get_items(
      db: Session = Depends(get_db),
      current_user: User = Depends(get_current_user),
  ) -> List[ItemSchema]:
      """Retrieve all lost items for current user."""
      items = db.query(LostItem).filter(LostItem.user_id == current_user.id).all()
      return items
  ```
- **Error Handling**: Use specific HTTP status codes + Pydantic validation
- **Testing**: pytest with async support

## Design System

### Theme
- **Background**: White (#FFFFFF)
- **Primary Color**: Blue (Tailwind blue-600 #2563EB)
- **Text**: Dark gray (gray-900 for primary, gray-600 for secondary)
- **Border Radius**: 12px (rounded-lg) or 16px (rounded-xl)

### Component Patterns
- **Cards**: `rounded-xl shadow-sm border border-gray-200 bg-white p-6`
- **Tables**: PrimeReact DataTable with Tailwind grid
- **Icons**: Always from Tabler Icons
- **Forms**: PrimeReact inputs with Tailwind spacing
- **Responsive**: Mobile-first (1 col → 2 col → 3 col breakpoints)

### Inspiration
- Linear.app (clean, minimal)
- Stripe Dashboard (data visualization)
- Vercel (modern SaaS)

## Pages & Components

**Frontend Pages:**
1. Dashboard - Role-specific home
2. Lost Items - User reports + Staff list
3. Found Items - Browse + Staff recording
4. Match Center - View matches with scores
5. Claims - Staff approval workflow
6. Notifications - In-app notification center
7. Admin Dashboard - Statistics & user management

**Component Hierarchy:**
- Layout (Header, Sidebar, Footer)
- Pages
- Feature Components (ItemCard, MatchCard, etc.)
- Common Components (Button, LoadingSpinner, EmptyState, ErrorAlert)

## Database Schema

**Key Tables:**
- `User` - username, email, password_hash, role, created_at
- `LostItem` - user_id, item_name, description, location, date_lost, image_url, image_embedding (pgvector), text_embedding, status
- `FoundItem` - staff_id, item_name, description, location, date_found, image_url, status
- `Match` - lost_item_id, found_item_id, image_score, text_score, combined_score
- `ClaimRequest` - user_id, found_item_id, status (Pending/Approved/Rejected)
- `Notification` - user_id, notification_type, message, is_read

**Indexes:**
- pgvector: Index on image_embedding, text_embedding for similarity search
- Foreign keys on all relationships

## API Endpoints

**Authentication:**
- `POST /auth/register` - User registration
- `POST /auth/login` - JWT login (returns access_token + refresh_token)
- `POST /auth/refresh` - Refresh access token

**Lost Items:**
- `POST /lost-items` - Create lost item
- `GET /lost-items` - List user's lost items
- `GET /lost-items/{id}` - Get item details
- `PUT /lost-items/{id}` - Edit lost item
- `DELETE /lost-items/{id}` - Delete lost item

**Found Items:**
- `POST /found-items` - Create found item (Staff)
- `GET /found-items` - List found items
- `PUT /found-items/{id}` - Edit found item (Staff)
- `DELETE /found-items/{id}` - Delete found item (Staff)

**Matches:**
- `GET /matches` - Get user's matches
- `GET /matches/{id}` - Get match details

**Claims:**
- `POST /claims` - Create claim request
- `GET /claims` - List claims (Staff)
- `PATCH /claims/{id}/approve` - Approve claim (Staff)
- `PATCH /claims/{id}/reject` - Reject claim (Staff)

## Development Workflow

### Getting Started
```bash
# Clone and setup
cd c:\Users\tiradet.j\project\lostAndFound

# Copy env
cp .env.example .env

# Start with Docker Compose
docker-compose up -d

# Or local development
cd backend && python -m venv venv && venv\Scripts\activate && pip install -e ".[dev]"
cd ../frontend && npm install
```

### Running Services
- **Backend**: `uvicorn app.main:app --reload` (port 8000)
- **Frontend**: `npm run dev` (port 3000)
- **Database**: PostgreSQL (port 5432)
- **Storage**: MinIO (port 9000, console 9001)

### Testing
- **Backend**: `pytest tests/ --cov=app`
- **Frontend**: `npm run test`

### Code Quality
- **Backend**: `black app && ruff check app --fix && mypy app`
- **Frontend**: `npm run lint && npm run format`

## File Structure Rules

**Frontend**: Keep components small (<200 lines), use custom hooks for logic, never inline styles
**Backend**: Keep routes thin, use services for business logic, use schemas for validation
**Tests**: Match source file location, prefix with `test_`
**Config**: All environment-specific config in `.env` files

## Constraints

- ❌ NO Bootstrap, Material UI, or inline styles
- ❌ NO hardcoded URLs or secrets
- ❌ NO untyped functions in backend
- ❌ NO `any` types in TypeScript
- ✅ Always use Tailwind, PrimeReact, Tabler Icons
- ✅ Always add type hints
- ✅ Always write tests for critical logic
- ✅ Always use environment variables

## Common Commands

```bash
# Docker
docker-compose up -d                    # Start all services
docker-compose down                     # Stop all services
docker-compose logs -f backend         # View backend logs

# Backend
cd backend
alembic upgrade head                    # Run migrations
alembic revision --autogenerate -m "msg"  # Create migration
pytest tests/                           # Run tests

# Frontend
cd frontend
npm run dev                             # Dev server
npm run build                           # Production build
npm run lint                            # Check linting
npm run test                            # Run tests
```

## Questions & Support

For issues:
1. Check existing documentation in README.md
2. Review API documentation at http://localhost:8000/docs
3. Check error logs: `docker-compose logs service_name`
4. Open a GitHub Issue with context and error messages
