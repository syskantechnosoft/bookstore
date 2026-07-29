# Enterprise Bookstore Application

A full-stack, multi-environment Bookstore Inventory Management System built with **Spring Boot 4.1.0 (Java 25)**, **React 19.2.8**, **Liquibase**, **Redis Caching**, **Prometheus & Grafana**, and **Docker**.

Repository: [https://github.com/syskantechnosoft/bookstore](https://github.com/syskantechnosoft/bookstore)

---

## Key Features

- **Multi-Role RBAC Security**:
  - `ROLE_ADMIN`: Full permissions (CRUD on Books and Users).
  - `ROLE_LIBRARIAN`: Write/Update/Delete permissions on Books.
  - `ROLE_USER`: Read-only access to Book search & catalogue.
- **Triple-Layer Validation**:
  - **Client-side**: Real-time React form validation (ISBN format, non-negative numbers, required fields).
  - **Server-side**: Jakarta Validation `@Valid` DTO constraints with structured `@RestControllerAdvice` error responses.
  - **Database-side**: Liquibase DDL constraints (`NOT NULL`, `UNIQUE isbn`, `CHECK (price >= 0)`, `CHECK (stock >= 0)`).
- **Multi-Environment Database Support**:
  - **H2 Profile** (`spring.profiles.active=h2`): In-memory database for rapid testing.
  - **PostgreSQL Profile** (`spring.profiles.active=postgres`): Production-grade PostgreSQL container.
  - **MySQL Profile** (`spring.profiles.active=mysql`): Production-grade MySQL container.
- **Automated Schema & Data Migration (Liquibase)**:
  - Automatically provisions schemas and **100 sample book records** across 10 categories.
- **Redis Caching**:
  - High-performance caching layer (`@Cacheable`, `@CacheEvict`) for book queries.
- **Observability & Monitoring**:
  - Prometheus metric scraping at `/actuator/prometheus`.
  - Grafana dashboard provisioning.
- **Swagger / OpenAPI Documentation**:
  - Interactive API explorer at `http://localhost:8080/swagger-ui.html`.
- **CI/CD Pipeline**:
  - Automated GitHub Actions workflow testing backend & frontend builds and Docker image validation.

---

## Demo Accounts

| Role | Username | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `Admin@123` | Full Read / Write / Update / Delete |
| **Librarian** | `librarian` | `Librarian@123` | Write / Update / Delete Books |
| **User** | `user` | `User@123` | Read-only Book Catalogue |

---

## Getting Started with Docker Compose

Spin up the complete multi-container stack (Backend, Frontend, Postgres, MySQL, Redis, Prometheus, Grafana) with a single command:

```bash
docker-compose up --build
```

### Accessing Services

- **React Web App**: `http://localhost:80` (or `http://localhost:3000` in dev mode)
- **Spring Boot API**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3000` (User: `admin`, Pass: `admin`)
- **H2 Console** (when using H2 profile): `http://localhost:8080/h2-console`

---

## Local Development & Testing

### Running Backend Tests
```bash
cd backend
mvn clean test
```

### Running Backend Locally (H2 In-Memory)
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

### Running Frontend Locally
```bash
cd frontend
npm install
npm run dev
```

---

## Architecture Diagram

```
+---------------------------------------------------------------------------------+
|                                    Browser                                      |
|                            (React 19.2.8 Frontend)                             |
+---------------------------------------------------------------------------------+
                                        | (JWT Auth / REST APIs)
                                        v
+---------------------------------------------------------------------------------+
|                             Spring Boot 4.1.0 API                               |
|               (Security Filters, OpenAPI, Micrometer Actuator)                  |
+---------------------------------------------------------------------------------+
        |                        |                        |                       |
        v                        v                        v                       v
+---------------+        +---------------+        +---------------+       +---------------+
| Redis Cache   |        | PostgreSQL DB |        |   MySQL DB    |       | Prometheus    |
| (Port 6379)   |        | (Port 5432)   |        | (Port 3306)   |       | & Grafana     |
+---------------+        +---------------+        +---------------+       +---------------+
```
