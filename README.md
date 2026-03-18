# Organic Farm Hub (OFH) - Enterprise E-Commerce Platform

A production-grade, full-stack e-commerce platform built with enterprise architecture standards.

## Tech Stack

### Frontend
- **React 18** + TypeScript + Vite
- **TailwindCSS** + ShadCN UI components
- **React Router v6** (nested layouts)
- **TanStack React Query** (server state management)
- **Zustand** (client state management)
- **Axios** (HTTP client with interceptors)
- **Recharts** (admin analytics charts)

### Backend
- **NestJS** (modular architecture)
- **TypeScript** (strict mode)
- **Prisma ORM** (PostgreSQL)
- **Redis** (caching via ioredis)
- **BullMQ** (background job queues)
- **Passport + JWT** (auth with refresh tokens)
- **bcrypt** (password hashing)
- **Helmet** (security headers)
- **Winston** (structured logging)

### Infrastructure
- **Docker** + Docker Compose
- **PostgreSQL 16**
- **Redis 7**
- **Nginx** (frontend reverse proxy)

---

## Project Structure

```
OFH/
├── backend/                    # NestJS Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Seed data
│   ├── src/
│   │   ├── main.ts             # App bootstrap
│   │   ├── app.module.ts       # Root module
│   │   ├── common/             # Shared utilities
│   │   │   ├── decorators/     # @Roles, @CurrentUser
│   │   │   ├── dto/            # PaginationDto
│   │   │   ├── filters/        # HttpExceptionFilter
│   │   │   ├── guards/         # RolesGuard (RBAC)
│   │   │   ├── interceptors/   # ResponseInterceptor
│   │   │   └── logger/         # Winston config
│   │   ├── prisma/             # Prisma service (global)
│   │   ├── redis/              # Redis caching service (global)
│   │   ├── modules/
│   │   │   ├── auth/           # JWT auth, register, login, refresh
│   │   │   ├── users/          # Profile, admin user management
│   │   │   ├── products/       # CRUD, search, pagination, caching
│   │   │   ├── categories/     # Hierarchical categories, caching
│   │   │   ├── cart/           # Cart management
│   │   │   ├── orders/         # Order lifecycle, BullMQ integration
│   │   │   ├── payments/       # Payment records & webhooks
│   │   │   ├── inventory/      # Stock control, reserve/release
│   │   │   ├── reviews/        # Product reviews & ratings
│   │   │   ├── admin/          # Dashboard aggregation
│   │   │   └── analytics/      # Sales, top products, customers
│   │   └── queues/
│   │       ├── order-processing/  # Order processor worker
│   │       └── notifications/     # Email notification worker
│   ├── Dockerfile
│   └── package.json
├── src/                        # React Frontend
│   ├── api/                    # Axios API service layer
│   │   ├── client.ts           # Axios instance + interceptors
│   │   ├── auth.api.ts
│   │   ├── products.api.ts
│   │   ├── categories.api.ts
│   │   ├── cart.api.ts
│   │   ├── orders.api.ts
│   │   ├── reviews.api.ts
│   │   └── admin.api.ts
│   ├── hooks/queries/          # React Query hooks
│   ├── stores/                 # Zustand stores
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── uiStore.ts
│   ├── types/                  # Shared TypeScript types
│   ├── layouts/                # Route layouts
│   │   ├── StorefrontLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── pages/enterprise/admin/ # Enterprise admin pages
│   └── routes/                 # Enterprise route config
├── docker-compose.yml
├── Dockerfile                  # Frontend Dockerfile
├── nginx.conf                  # Nginx reverse proxy
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)

### Option 1: Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Access:
# Frontend: http://localhost:8080
# Backend:  http://localhost:4000/api
# Postgres: localhost:5432
# Redis:    localhost:6379
```

### Option 2: Local Development

**1. Start infrastructure:**
```bash
docker-compose up postgres redis -d
```

**2. Setup backend:**
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

**3. Setup frontend:**
```bash
cd ..
npm install
npm run dev
```

---

## Default Credentials

| Role  | Email          | Password     |
|-------|----------------|--------------|
| Admin | admin@ofh.com  | admin@OFH2026  |
| User  | user@ofh.com   | user@OFH2026   |

---

## API Endpoints

### Auth
| Method | Endpoint           | Auth | Description          |
|--------|--------------------|------|----------------------|
| POST   | /api/auth/register | No   | Register new user    |
| POST   | /api/auth/login    | No   | Login                |
| POST   | /api/auth/refresh  | JWT  | Refresh tokens       |
| POST   | /api/auth/logout   | JWT  | Logout               |
| GET    | /api/auth/me       | JWT  | Get current user     |

### Products
| Method | Endpoint             | Auth  | Description           |
|--------|----------------------|-------|-----------------------|
| GET    | /api/products        | No    | List (paginated)      |
| GET    | /api/products/:slug  | No    | Get by slug           |
| POST   | /api/products        | Admin | Create product        |
| PATCH  | /api/products/:id    | Admin | Update product        |
| DELETE | /api/products/:id    | Admin | Delete product        |

### Cart
| Method | Endpoint               | Auth | Description       |
|--------|------------------------|------|-------------------|
| GET    | /api/cart              | JWT  | Get cart          |
| POST   | /api/cart/items        | JWT  | Add item          |
| PATCH  | /api/cart/items/:id    | JWT  | Update quantity   |
| DELETE | /api/cart/items/:id    | JWT  | Remove item       |
| DELETE | /api/cart              | JWT  | Clear cart        |

### Orders
| Method | Endpoint                  | Auth  | Description         |
|--------|---------------------------|-------|---------------------|
| POST   | /api/orders               | JWT   | Create order        |
| GET    | /api/orders               | JWT   | User's orders       |
| GET    | /api/orders/:id           | JWT   | Order details       |
| PATCH  | /api/orders/:id/cancel    | JWT   | Cancel order        |
| GET    | /api/orders/admin/all     | Admin | All orders          |
| PATCH  | /api/orders/:id/status    | Admin | Update status       |

### Admin
| Method | Endpoint                   | Auth  | Description          |
|--------|----------------------------|-------|----------------------|
| GET    | /api/admin/dashboard       | Admin | Dashboard stats      |
| GET    | /api/analytics/sales       | Admin | Sales analytics      |
| GET    | /api/analytics/top-products| Admin | Top selling products |
| GET    | /api/analytics/customers   | Admin | Customer analytics   |
| GET    | /api/inventory             | Admin | All inventory        |
| PATCH  | /api/inventory/:productId  | Admin | Update stock         |
| GET    | /api/users                 | Admin | All users            |
| PATCH  | /api/users/:id/block       | Admin | Block user           |

---

## Architecture Highlights

### API Response Format
All responses follow a consistent structure:
```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

### Caching Strategy
- Product lists: 10 min TTL
- Product details: 30 min TTL
- Categories: 1 hour TTL
- Admin dashboard: 5 min TTL
- Cache invalidation on create/update/delete

### Queue System
- **order-processing**: Validates payment, prepares fulfillment
- **email-notifications**: Order confirmations, status updates

### Security
- bcrypt (cost factor 12) password hashing
- JWT access tokens (15 min) + refresh tokens (7 days)
- Helmet security headers
- Rate limiting (100 req/min)
- Input validation (class-validator)
- RBAC with @Roles() decorator

---

## License
UNLICENSED - Private

