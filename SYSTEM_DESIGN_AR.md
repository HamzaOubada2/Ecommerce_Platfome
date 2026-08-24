# 📐 System Design & Architecture Document: E-Commerce Platform

## 1. Overview & Business Requirements (System Overview)

This is a comprehensive e-commerce platform built using a **Modular Monolith** architecture with **NestJS** and **MySQL**, covering the following:

- **Customer Facing:** Product browsing, cart, order creation, and payment via Stripe.
- **Admin Dashboard:** Product management, inventory tracking, and order status updates.

**Core Technical Goals:** Security (Authentication & RBAC), payment reliability (Idempotent Webhooks), and inventory management under high load (Race Conditions).

---

## 2. High-Level Architecture

The architecture relies on a Layered Architecture approach to ensure ease of maintenance and future scalability.

```
                  [ Frontend Layer ]
        ┌──────────────────────────────────────────────────┐
        │  React / Next.js (Admin Dashboard & Storefront)  │
        └────────────────────────┬─────────────────────────┘
                                 │ (HTTPS / REST API)
                                 ▼
                 [ Backend / Application Layer ]
   ┌──────────────────────────────────────────────────────────────┐
   │ NestJS API Gateway & Application Server                      │
   │                                                              │
   │  ┌────────────────────────┐  ┌────────────────────────────┐  │
   │  │ Authentication &        │  │ Rate Limiting              │  │
   │  │ Security (JWT & Roles   │  │ (@nestjs/throttler)        │  │
   │  │ Guard)                  │  │                             │  │
   │  └───────────┬────────────┘  └─────────────┬──────────────┘  │
   │              │                             │                 │
   │  ┌───────────▼─────────────────────────────▼──────────────┐  │
   │  │ Modules: Auth | Products | Orders | Payments            │  │
   │  └─────────────────────────┬──────────────────────────────┘  │
   └────────────────────────────┼─────────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        │                                               │
        ▼                                               ▼
[ Infrastructure ]                            [ External Services ]
┌─────────────────────────────────┐           ┌─────────────────────────────┐
│ MySQL Database                   │           │ Stripe Gateway               │
│ (Isolated container in Docker)  │           │ (Payments & Webhook events)  │
└─────────────────────────────────┘           └─────────────────────────────┘
```

---

## 3. Technical Decisions & Trade-offs

| Component | Chosen Option | Rationale / Justification |
|---|---|---|
| Overall Architecture | Modular Monolith | Avoids the complexity of Microservices early on, while keeping code separated into Modules for an easier future transition to Microservices. |
| Database | MySQL (via Prisma ORM) | Provides full ACID properties, essential for the integrity of financial transactions and inventory. |
| Authentication System | JWT + Refresh Tokens | Short-lived Access Token (15 minutes) + Refresh Token protected inside an HttpOnly Cookie. |
| Containerization | Docker & Docker Compose | Isolates the local development environment to match the actual production environment (Production Parity). |

---

## 4. Security & Reliability Controls

### A. Security Controls

**Authentication & Authorization:**
- `AuthGuard`: Validates the Access Token.
- `RolesGuard`: Uses `@Roles(Role.ADMIN)` to restrict access to the admin dashboard.

**Data Sanitization:** Uses `ValidationPipe` with `class-validator` to prevent SQL Injection and XSS attacks.

**Rate Limiting:** Protects login routes against brute-force guessing attacks.

### B. Handling Inventory Race Conditions

When two purchase requests for a product arrive at the same time and only one unit is left in stock:

- **The Problem:** Both requests may read `stock = 1` and proceed to purchase simultaneously, resulting in a stock count of `-1` (over-selling).
- **The Solution:** Use Database Transactions with a direct, atomic quantity update:

```sql
UPDATE Product 
SET stock = stock - :quantity 
WHERE id = :productId AND stock >= :quantity;
```

### C. Stripe Webhook Security & Idempotency

- **Signature Verification:** Confirms the digital signature to prevent forged requests.
- **Idempotency Handling:** Checks the order's status in the database before updating it, ensuring the same webhook event isn't processed more than once if Stripe resends it.

---

## 5. Database Schema

### Entity Relationships (ERD Relationships)

- User ─── (many) Orders: 1-to-N relationship.
- Order ─── (many) Order Items (OrderItem): 1-to-N relationship.
- Product ─── (many) Order Items (OrderItem): 1-to-N relationship.

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User roles
enum Role {
  ADMIN
  CUSTOMER
}

// Order statuses
enum OrderStatus {
  PENDING
  PAID
  CANCELLED
  FAILED
}

// Users table
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  password     String
  role         Role     @default(CUSTOMER)
  refreshToken String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  orders       Order[]
}

// Products & inventory table
model Product {
  id          String      @id @default(uuid())
  title       String
  description String?     @db.Text
  price       Decimal     @db.Decimal(10, 2)
  stock       Int         @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]
}

// Main orders table
model Order {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  totalAmount     Decimal     @db.Decimal(10, 2)
  status          OrderStatus @default(PENDING)
  stripePaymentId String?     @unique
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  items           OrderItem[]
}

// Order line items table
model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
}
```

---

## 6. Runtime Environment & Containers (Docker Setup)

`docker-compose.yml` file for running the server and database locally inside isolated containers:

```yaml
version: '3.8'

services:
  mysql_db:
    image: mysql:8.0
    container_name: ecommerce_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: ecommerce_db
      MYSQL_USER: nestuser
      MYSQL_PASSWORD: nestpassword
    ports:
      - '3306:3306'
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: .
    container_name: ecommerce_backend
    restart: always
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: "mysql://nestuser:nestpassword@mysql_db:3306/ecommerce_db"
      JWT_SECRET: "super-secret-key"
      STRIPE_SECRET_KEY: "sk_test_..."
    depends_on:
      - mysql_db

volumes:
  mysql_data:
```