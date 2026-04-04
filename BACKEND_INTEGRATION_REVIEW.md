# VaultWise Backend Integration Review (from Frontend Contract)

This workspace only contains the Angular frontend, so backend code/schema could not be directly inspected here.

## Expected Express Routes

- Users: `/api/users`
- Transactions: `/api/transactions`
- Budgets: `/api/budgets`
- Reports: `/api/reports`
- Auth login: `/api/auth/login`

## Expected MySQL Tables (Auto-Increment IDs)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('income','expense') NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  limit_amount DECIMAL(12,2) NOT NULL,
  period ENUM('weekly','monthly','yearly') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## CORS Requirement

```ts
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
```

## JWT Requirement

- Backend should return `token` and `user` on login.
- Protected routes should validate `Authorization: Bearer <token>`.

## Validation Checklist

- Route paths match frontend service URLs.
- JSON response shape matches frontend models.
- MySQL IDs are numeric and auto-increment.
- Date fields are ISO-compatible for Angular date rendering.
