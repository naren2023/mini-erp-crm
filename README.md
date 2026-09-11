# Northline Mini ERP + CRM Operations Portal

A full-stack Mini ERP + CRM for wholesale/distribution operations. The assignment requires authentication/roles, customer CRM, product/inventory management, sales challans, REST APIs, validation, and deployment documentation.

## Current implementation

- Node.js + TypeScript + Express REST API
- PostgreSQL + Prisma
- JWT authentication with Admin, Sales, Warehouse and Accounts roles
- Customer CRUD, search/filter, detail and follow-up history
- Product CRUD and stock movement audit log
- Inventory stock IN/OUT with non-negative stock protection
- Sales challan creation, draft/confirmed/cancelled workflow
- Automatic challan numbers
- Product snapshot stored on challan items
- React + TypeScript + Vite responsive admin UI
- Dashboard, customers, products, inventory and challans

The case study specifically requires that confirmed challans reduce stock and that insufficient stock returns an error; the backend already implements this transactionally.

## Run in VS Code

### 1. Prerequisites

Install:
- Node.js 20+ (LTS recommended)
- Docker Desktop
- VS Code

### 2. Open the project

Extract the zip and open the `mini-erp-crm` folder in VS Code.

Open two terminals in VS Code.

### 3. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

Check:

```bash
docker ps
```

You should see `mini-erp-crm-db` running.

### 4. Backend setup

Terminal 1:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

API: http://localhost:4000
Health check: http://localhost:4000/health

### 5. Frontend setup

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

http://localhost:5173

## Demo logins

Password for all accounts: `Password123!`

- Admin: `admin@example.com`
- Sales: `sales@example.com`
- Warehouse: `warehouse@example.com`
- Accounts: `accounts@example.com`

## Important demo flow

1. Login as Sales.
2. Open **Customers** and inspect a customer.
3. Open **Products** / **Inventory** and inspect stock.
4. Open **Sales Challans**.
5. Create a draft challan with multiple products.
6. Open the challan and click **Confirm**.
7. Stock is reduced only after confirmation.
8. Try confirming the seeded draft `CH-20260911-0001`: it requests 8 laptops while seeded stock is 5. The API should reject it with an insufficient-stock message and stock must remain unchanged.

## Role access

- Admin: full access
- Sales: customers, products/inventory viewing, challans; can create/update customers and challans
- Warehouse: product management and stock adjustments; product/inventory access
- Accounts: read-oriented access to customers/products/challans

## Environment variables

Backend `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mini_erp_crm?schema=public
JWT_SECRET=change-this-to-a-long-random-secret
PORT=4000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

For production, replace the JWT secret and database URL with secure deployment values.

## API examples

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/products`
- `POST /api/products/:id/stock`
- `GET /api/products/:id/movements`
- `GET /api/challans`
- `POST /api/challans`
- `POST /api/challans/:id/confirm`
- `POST /api/challans/:id/cancel`

All protected APIs use `Authorization: Bearer <JWT>`.

## Build checks

Backend:

```bash
cd backend
npm run build
npm test
```

Frontend:

```bash
cd frontend
npm run build
```

## Deployment

The case study accepts free hosting such as Vercel/Netlify/Render for frontend, Render/Railway/Fly.io for backend, and Supabase/Neon/Render Postgres for the database. AWS is optional bonus rather than a requirement.

Before deployment:
1. Create a production PostgreSQL database.
2. Set backend `DATABASE_URL`, `JWT_SECRET`, `PORT`, and `FRONTEND_ORIGIN`.
3. Run `npm run prisma:deploy` in the backend deployment.
4. Set frontend `VITE_API_URL` to the deployed API `/api` URL.
5. Build and deploy frontend.
6. Test all four roles and the insufficient-stock flow.

## Known limitations / next polish

- Invoice module is not required by the supplied case study's core module list.
- PDF invoice export, S3 image upload, Docker CI/CD and GitHub Actions are optional bonuses.
- Add automated API/Postman collection and production monitoring before final submission.
