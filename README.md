# StockFlow

Inventory management app — Express + Prisma backend, React + Tailwind frontend.

## Quick start (local dev)

### 1. Prerequisites
- Node.js 18+
- PostgreSQL running locally (or use Docker)

### 2. Backend

```bash
cd backend
cp .env.example .env          # edit DATABASE_URL, JWT_SECRET
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev                   # http://localhost:5000
```

Seed demo data (optional):
```bash
node prisma/seed.js
# login: admin@demo.com / password123
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

The Vite dev server proxies `/api` → `http://localhost:5000`.

## Docker (production)

```bash
cd deployment
docker-compose up -d
# frontend → http://localhost
# backend  → http://localhost:5000
```

## API routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/signup | - | Register + create org |
| POST | /api/auth/login | - | Login |
| GET | /api/auth/me | JWT | Current user |
| GET | /api/products | JWT | List (search, page) |
| POST | /api/products | JWT | Create |
| PUT | /api/products/:id | JWT | Update |
| DELETE | /api/products/:id | JWT | Delete |
| PATCH | /api/products/:id/adjust | JWT | Adjust stock |
| GET | /api/dashboard | JWT | Stats + low stock |
| GET | /api/settings | JWT | Org settings |
| PUT | /api/settings | JWT | Update settings |
