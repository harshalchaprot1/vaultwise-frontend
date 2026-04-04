# VaultWise Frontend (Angular 18 + Material 18.2.14)

This frontend is designed for a Node.js + Express + MySQL backend running at `http://localhost:3000` and provides end-to-end UI modules for:

- Auth
- Dashboard
- Transactions
- Budgets
- Reports

## What Is Implemented

- Angular standalone architecture with route protection (JWT guard)
- Angular Material UI shell with toolbar, side nav, responsive cards/tables/forms
- Typed HttpClient services for backend APIs
- Auth interceptor that adds `Authorization: Bearer <token>`
- Form validation with Material errors and responsive CSS hover effects

## Frontend Routes

- `/auth/login`
- `/dashboard`
- `/transactions`
- `/budgets`
- `/reports`

Protected routes require a valid token in local storage (`vaultwise_token`).

## Backend API Contract Expected

Base URL: `http://localhost:3000`

- `POST /api/auth/login`
- `GET|POST|PUT|DELETE /api/users`
- `GET|POST|PUT|DELETE /api/transactions`
- `GET|POST|PUT|DELETE /api/budgets`
- `GET /api/reports/summary`
- `GET /api/reports/monthly?year=YYYY`

The UI expects numeric `id` fields (auto-increment in MySQL) for Users, Transactions, and Budgets.

## CORS Requirement In Express Backend

Ensure backend includes:

```ts
import cors from 'cors';

app.use(
	cors({
		origin: 'http://localhost:4200',
		credentials: true
	})
);
```

## Run Locally

1. Start backend on port `3000`.
2. In this folder run:

```bash
npm install
npm start
```

Frontend runs on `http://localhost:4200`.

## Build

```bash
npm run build
```
