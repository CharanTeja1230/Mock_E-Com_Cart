Full-stack server (Express + SQLite) added

How to run

1. Install dependencies:

   npm install

2. Start the API server (runs on port 4000):

   npm run start:server

3. Run the Next.js app (in a separate terminal):

   npm run dev

Vibe Commerce – Mock E‑Com Cart (Full‑Stack)

This repository contains a complete solution for the mock shopping cart assignment with a React (Next.js) frontend, a Node/Express backend, and SQLite persistence. It implements product listing, add/remove/update cart, total calculation, and a mock checkout returning a receipt. Backend integration tests are included.

## What’s inside

Frontend (React + Next.js 16)
   - Product grid with Add to Cart
   - Cart view with increment/decrement/remove and running total
   - Checkout modal returning a receipt
   - Responsive UI using a component library under `components/ui`

Backend (Node + Express)
   - REST APIs under `server/index.js`
   - SQLite database (file-based for dev, in-memory for tests)
   - Products seeded on first run

Tests (Jest + Supertest)
   - Integration tests for Products, Cart flow, and Checkout (`server/__tests__/api.test.js`)

## Tech stack

Frontend: Next.js 16, React 19, Tailwind CSS components (local), Radix UI primitives
Backend: Node.js + Express, SQLite (`sqlite3`)
Tests: Jest, Supertest
Dev environment: Windows PowerShell examples provided

## Architecture overview

Next.js app (frontend) in the repo root (`app`, `components`, `public`, etc.)
Express server (backend) in `server/`
SQLite database:
   - Dev: `server/data.sqlite` file
   - Tests: in-memory (no file)
Communication patterns:
   - Preferred: set `NEXT_PUBLIC_API_URL=http://localhost:4000` so frontend calls the Express API directly
   - Fallback (no env): the Next app proxies requests via `/api-ext/*` to the backend using a rewrite in `next.config.mjs`

## Folder breakdown (frontend vs backend)

Frontend (client/UI)

`app/` – Next.js routing, pages, layout (`page.tsx`, `layout.tsx`)
`components/` – App components, modal, header, cart, product grid
`components/ui/` – UI primitives (accordion, dialog, button, etc.)
`hooks/` – UI hooks (`use-mobile`, `use-toast`)
`public/` – Images used by the UI
`styles/` – Stylesheet(s)
`lib/` – Client-side utilities and store (some of this is legacy from the initial Next-only approach)

Backend (server/API)

`server/index.js` – Express app and REST endpoints
`server/db.js` – SQLite init, schema, seed, and readiness gate
`server/__tests__/api.test.js` – API integration tests
`server/package.json` – Backend-only dependencies and scripts

Build/config (shared)

`package.json` – Root scripts for Next app; wrappers to run backend scripts
`next.config.mjs` – Next options and dev proxy for `/api-ext/*`
`tsconfig.json`, `postcss.config.mjs`, `components.json` – project config

## Requirements mapping (assignment → implementation)

GET `/api/products`: returns 6 seeded products with `{ id, name, price, image }` → implemented in Express
POST `/api/cart`: body `{ productId, qty }` → add or update quantity in cart (SQLite)
DELETE `/api/cart/:id`: remove a cart row by cart item id
GET `/api/cart`: returns `{ items, total }`
POST `/api/checkout`: body `{ items }` → returns `{ receipt }` and clears the cart
Frontend: product grid, cart with add/update/remove, checkout modal and receipt, responsive styles

## Prerequisites

Node.js 18+ (recommended)
Windows PowerShell (examples use PowerShell syntax)

## Setup & install

Install root deps for the Next app (uses a relaxed peer policy due to UI libraries vs React 19):

```powershell
npm install --legacy-peer-deps
```

Install backend deps (this also runs automatically when you run tests via the root):

```powershell
npm --prefix server install
```

## Running locally (two options)

Option A: Direct calls to the backend (explicit base URL)

```powershell
# 1) Start Express API (port 4000)
npm run start:server

# 2) Start Next dev (new terminal) and point to the API URL
$env:NEXT_PUBLIC_API_URL = 'http://localhost:4000'
npm run dev

# Open the app
# http://localhost:3000
```

Option B: Use Next proxy (no env var needed)

```powershell
# 1) Start Express API (port 4000)
npm run start:server

# 2) Start Next dev (new terminal). The app will use /api-ext/* → http://localhost:4000/api/*
npm run dev

# Open the app
# http://localhost:3000
```

Note: If port 3000 is taken, Next will use the next free port (e.g., 3001). Watch the console output.

## API reference (Express server)

Base URL (dev): `http://localhost:4000`

GET `/api/products`
   - 200 → `{ products: Array<{ id, name, price, image }> }`

GET `/api/cart`
   - 200 → `{ items: Array<{ id, productId, name, price, quantity }>, total: number }`

POST `/api/cart`
   - Body: `{ productId: number, qty: number }`
   - Behavior: upserts the cart item quantity; `qty <= 0` removes any matching product
   - 200 → `{ success: true, items, total }`

DELETE `/api/cart/:id`
   - Param `id`: cart item identifier
   - 200 → `{ success: true, items, total }`

POST `/api/checkout`
   - Body: `{ items: Array<{ id, name, price, quantity }>, name?: string, email?: string }`
   - 200 → `{ success: true, receipt: { orderNumber, items, total, date, customer } }` and clears cart

Example requests (PowerShell)

```powershell
# Products
Invoke-RestMethod -Uri http://localhost:4000/api/products | ConvertTo-Json -Depth 5

# Add item (productId=1, qty=2)
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/cart -Body (@{productId=1;qty=2} | ConvertTo-Json) -ContentType 'application/json' | ConvertTo-Json -Depth 5

# Get cart
Invoke-RestMethod -Uri http://localhost:4000/api/cart | ConvertTo-Json -Depth 5

# Delete cart item (id=1)
Invoke-RestMethod -Method Delete -Uri http://localhost:4000/api/cart/1 | ConvertTo-Json -Depth 5

# Checkout (mock)
$items = Invoke-RestMethod -Uri http://localhost:4000/api/cart | Select-Object -ExpandProperty items
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/checkout -Body (@{items=$items} | ConvertTo-Json -Depth 5) -ContentType 'application/json' | ConvertTo-Json -Depth 5
```

## Database schema (SQLite)

Products

```sql
CREATE TABLE IF NOT EXISTS products (
   id INTEGER PRIMARY KEY,
   name TEXT NOT NULL,
   price REAL NOT NULL,
   image TEXT
);
```

Cart

```sql
CREATE TABLE IF NOT EXISTS cart (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   productId INTEGER NOT NULL,
   name TEXT NOT NULL,
   price REAL NOT NULL,
   quantity INTEGER NOT NULL
);
```

Products are seeded automatically on first run (6 items).

## Tests

Run backend tests (installs backend deps and runs Jest):

```powershell
npm test
```

What’s covered:

`GET /api/products` returns product list
Cart flow: add → update → get → delete
`POST /api/checkout` returns a receipt and clears the cart

## Screenshots (suggested)

Place screenshots under a new folder `docs/screenshots/` (you can add these later without changing any code):

```markdown
![Home – Products](docs/screenshots/home-products.png)
![Cart – Items & Total](docs/screenshots/cart-panel.png)
![Checkout – Receipt](docs/screenshots/checkout-receipt.png)
```

Suggested shots:

Home page with product grid
Cart with a few items and total
Checkout modal showing a receipt

## Troubleshooting

Next dev lock: “Unable to acquire lock … .next\dev\lock”
   - Close other `next dev` processes, then re-run `npm run dev`
   - If needed, delete the lock file: `.next/dev/lock`

Port already in use
   - Next will choose the next free port (e.g., 3001). Use the printed URL

Clipboard API blocked in the editor preview
   - The VS Code Simple Browser restricts clipboard access — this warning is harmless
   - Open in your regular browser if you need clipboard features

“Failed to fetch” in preview
   - Ensure the backend is running: `npm run start:server`
   - If you didn’t set `NEXT_PUBLIC_API_URL`, the app will call `/api-ext/*` which rewrites to `http://localhost:4000/api/*` (dev only)

Peer dependency warnings during install
   - Use `npm install --legacy-peer-deps` at the root (this is expected with React 19 and some UI libs)

## Scripts (cheat sheet)

Frontend (root):

`npm run dev` – start Next.js
`npm run start` – Next.js production start (after build)
`npm run build` – Next.js build
`npm run start:server` – start Express API (`server/`)
`npm run test` – install and run backend tests under `server/`

Backend (inside `server/`):

`npm start` – start Express API
`npm run dev` – dev mode with nodemon
`npm test` – run Jest tests
`npm run show` – print sample outputs from all endpoints without starting a server (uses Supertest in-process)

## Deployment notes

The assignment requires a GitHub deploy (no hosting). Push this repo to GitHub
Optional CI: add a GitHub Actions workflow to run `npm test` (backend) on each push/PR
If you prefer MongoDB instead of SQLite, swap the DB layer in `server/db.js` and update tests (a Mongo memory server can be used for CI)

---

If you want me to include actual screenshots or add a CI workflow file, let me know and I’ll add them (only the README was changed here as requested).

Tests

Run:

  npm test

This will run backend integration tests against an in-memory SQLite DB.
