# Enterprise Bookstore Application

A full-stack, multi-environment Bookstore Inventory Management System built with **Spring Boot 4.1.0 (Java 25)**, **React 19.2.8**, **Liquibase**, **Redis Caching**, **Prometheus & Grafana**, and **Docker**.

GitHub Repository: [https://github.com/syskantechnosoft/bookstore](https://github.com/syskantechnosoft/bookstore)

---

## Application Screenshots

### 1. Bookstore Pro React UI Dashboard
![Bookstore Pro UI Dashboard](docs/images/dashboard_preview.jpg)

### 2. Swagger UI OpenAPI Documentation
![Swagger UI API Documentation](docs/images/swagger_preview.jpg)

---

## Core Features & Multi-Role RBAC

- **Role-Based Access Control (RBAC)**:
  - `ROLE_ADMIN`: Full administrative permissions (CRUD on Books, Roles, and Users).
  - `ROLE_LIBRARIAN`: Full write, update, and delete permissions on Book inventory.
  - `ROLE_USER`: Read-only access to search and view book records.
- **Triple-Layer Input Validation**:
  - **Client-Side**: Real-time React form validation (ISBN format matching, positive numbers for price/stock, required fields).
  - **Server-Side**: Jakarta Validation `@Valid` DTO annotations handled by a global `@RestControllerAdvice` returning HTTP 400 validation error maps.
  - **Database-Side**: Liquibase DDL constraints (`NOT NULL`, `UNIQUE isbn`, `CHECK (price >= 0)`, `CHECK (stock >= 0)`).
- **Multi-Database Support & Spring Profiles**:
  - `h2`: In-memory database with Spring `simple` ConcurrentMap cache (`spring.profiles.active=h2`).
  - `postgres`: Production-grade PostgreSQL database container (`spring.profiles.active=postgres`).
  - `mysql`: Production-grade MySQL database container (`spring.profiles.active=mysql`).
- **Liquibase Database Migrations**:
  - Automatically provisions tables and populates **100 sample book records** across 10 genres with identity sequence auto-sync (`RESTART WITH 100`).
- **Redis Caching**: High-performance `@Cacheable` and `@CacheEvict` annotations for book catalog lookups.
- **Observability**: Prometheus metrics scraped from `/actuator/prometheus` and visualized via pre-configured Grafana dashboards.

---

## Demo Credentials

| Role | Username | Password | Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `Admin@123` | Full Read / Write / Update / Delete |
| **Librarian** | `librarian` | `Librarian@123` | Write / Update / Delete Books |
| **User** | `user` | `User@123` | Read-only Book Catalogue |

---

## UML Diagrams

### 1. System Architecture Diagram (C4 Container View)

```mermaid
graph TD
    UserClient[Browser / Client] -->|HTTP / React 19.2.8| Nginx[Nginx Reverse Proxy / Port 80]
    Nginx -->|Proxy /api/| SpringBoot[Spring Boot 4.1.0 Backend / Port 8085]
    Nginx -->|Proxy /swagger-ui/| Swagger[Springdoc Swagger UI]
    
    subgraph Security Layer
        SpringBoot -->|Intersects Requests| JwtFilter[JwtAuthenticationFilter]
        JwtFilter -->|Validates Token| JwtProvider[JwtTokenProvider]
    end
    
    subgraph Service & Caching Layer
        SpringBoot -->|Data Logic| BookService[BookService]
        BookService -->|Cache Lookups| Redis[Redis Caching Service / Port 6379]
    end
    
    subgraph Multi-DB Data Store
        BookService -->|JPA / Liquibase| DB{Active Database Profile}
        DB -->|h2 profile| H2DB[(H2 In-Memory DB)]
        DB -->|postgres profile| PostgresDB[(PostgreSQL 16 DB)]
        DB -->|mysql profile| MySQLDB[(MySQL 8 DB)]
    end
    
    subgraph Observability
        Prometheus[Prometheus Server / Port 9090] -->|Scrapes /actuator/prometheus| SpringBoot
        Grafana[Grafana Dashboards / Port 3000] -->|Queries Metrics| Prometheus
    end
```

---

### 2. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : "has"
    ROLES ||--o{ USER_ROLES : "assigned to"

    USERS {
        bigint id PK
        varchar_50 username UK "NOT NULL"
        varchar_100 email UK "NOT NULL"
        varchar_255 password "NOT NULL"
        varchar_100 full_name "NOT NULL"
    }

    ROLES {
        bigint id PK
        varchar_20 name UK "NOT NULL"
    }

    USER_ROLES {
        bigint user_id PK,FK
        bigint role_id PK,FK
    }

    BOOKS {
        bigint id PK
        varchar_255 title "NOT NULL"
        varchar_255 author "NOT NULL"
        varchar_20 isbn UK "NOT NULL"
        varchar_50 genre "NOT NULL"
        decimal_10_2 price "NOT NULL, >= 0"
        integer stock "NOT NULL, >= 0"
        integer published_year "NOT NULL"
        text description
    }
```

---

### 3. Component & Class Architecture Diagram

```mermaid
classDiagram
    class BookController {
        +getAllBooks(page, size, sortBy, sortDir, search, genre)
        +getBookById(id)
        +createBook(bookDto)
        +updateBook(id, bookDto)
        +deleteBook(id)
    }

    class AuthController {
        +login(authRequest)
        +register(registerRequest)
    }

    class BookService {
        +findAll(pageable, search, genre)
        +findById(id)
        +create(bookDto)
        +update(id, bookDto)
        +delete(id)
    }

    class AuthService {
        +login(authRequest)
        +register(registerRequest)
    }

    class BookRepository {
        +searchBooks(query, genre, pageable)
        +findByIsbn(isbn)
        +existsByIsbn(isbn)
    }

    class UserRepository {
        +findByUsername(username)
        +existsByUsername(username)
        +existsByEmail(email)
    }

    BookController --> BookService
    AuthController --> AuthService
    BookService --> BookRepository
    AuthService --> UserRepository
```

---

### 4. JWT Authentication Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Client (React UI / Swagger)
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthService
    participant AuthMgr as AuthenticationManager
    participant JwtProv as JwtTokenProvider

    User->>AuthCtrl: POST /api/auth/login {username, password}
    AuthCtrl->>AuthSvc: login(authRequest)
    AuthSvc->>AuthMgr: authenticate(UsernamePasswordAuthenticationToken)
    AuthMgr-->>AuthSvc: Authentication Success
    AuthSvc->>JwtProv: generateToken(authentication)
    JwtProv-->>AuthSvc: Bearer JWT Token String
    AuthSvc-->>AuthCtrl: AuthResponse DTO
    AuthCtrl-->>User: 200 OK + JWT Token Payload
```

---

### 5. Book CRUD & Redis Caching Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client (React UI / Swagger)
    participant Ctrl as BookController
    participant Svc as BookService
    participant Cache as Redis Cache
    participant Repo as BookRepository
    participant DB as Active Database (Postgres/H2/MySQL)

    Client->>Ctrl: GET /api/books/{id}
    Ctrl->>Svc: getBookById(id)
    Svc->>Cache: Check Key "books::id"
    alt Cache Hit
        Cache-->>Svc: Return Cached Book DTO
    else Cache Miss
        Svc->>Repo: findById(id)
        Repo->>DB: SELECT * FROM books WHERE id=?
        DB-->>Repo: Book Entity
        Repo-->>Svc: Book Entity
        Svc->>Cache: Save Key "books::id"
    end
    Svc-->>Ctrl: Book DTO
    Ctrl-->>Client: 200 OK

    Client->>Ctrl: PUT /api/books/{id} (Admin/Librarian)
    Ctrl->>Svc: updateBook(id, bookDto)
    Svc->>Repo: save(updatedBook)
    Repo->>DB: UPDATE books SET ... WHERE id=?
    DB-->>Repo: Updated Entity
    Svc->>Cache: Evict Key "books::id" & Clear "books_list"
    Svc-->>Ctrl: Updated Book DTO
    Ctrl-->>Client: 200 OK
```

---

## Swagger UI Testing Guide & Sample Payloads

Interactive OpenAPI Swagger UI is accessible at:
- **Local Swagger URL**: `http://localhost:8085/swagger-ui.html`
- **Cloud Live Swagger URL**: `https://bookstore-backend-api-mk53.onrender.com/swagger-ui.html`

### Step 1: Authentication & Token Generation

#### 1. Login with Demo Account
- **Endpoint**: `POST /api/auth/login`
- **Sample Request Body**:
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```
- **Response**: Copy the `token` string from the JSON response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc4NTMyMDI3NiwiZXhwIjoxNzg1NDA2Njc2fQ.e7X_Enb4RFVEZcyLAnI8...",
  "type": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@bookstore.com",
  "fullName": "System Administrator",
  "roles": [
    "ROLE_ADMIN"
  ]
}
```

#### 2. Register a New User Account
- **Endpoint**: `POST /api/auth/register`
- **Sample Request Body**:
```json
{
  "username": "sivaos",
  "email": "sivaos@gmail.com",
  "password": "sivaos@123",
  "fullName": "Sivakumar OS",
  "roles": [
    "ROLE_USER"
  ]
}
```
- **Response**:
```json
{
  "message": "User registered successfully!"
}
```

---

### Step 2: Authorize Requests in Swagger UI

1. Click the green **Authorize 🔓** button at the top right of the Swagger UI page.
2. Enter your JWT token in the Value field: `Bearer <your_copied_jwt_token>` (or paste the raw token).
3. Click **Authorize**, then **Close**.

---

### Step 3: Book Inventory CRUD Operations

#### 1. Get All Books (Paginated & Filtered)
- **Endpoint**: `GET /api/books`
- **Query Parameters**:
  - `page`: `0`
  - `size`: `10`
  - `genre`: `Computer Science` (optional)
  - `search`: `Clean Code` (optional)

#### 2. Create a New Book (Admin / Librarian Only)
- **Endpoint**: `POST /api/books`
- **Sample Request Body**:
```json
{
  "title": "Clean Architecture: A Craftsman's Guide to Software Structure and Design",
  "author": "Robert C. Martin",
  "isbn": "978-0134494166",
  "genre": "Computer Science",
  "price": 34.99,
  "stock": 45,
  "publishedYear": 2017,
  "description": "Practical software architecture rules and principles for building maintainable systems."
}
```

#### 3. Update Existing Book (Admin / Librarian Only)
- **Endpoint**: `PUT /api/books/{id}`
- **Sample Request Body**:
```json
{
  "title": "Clean Architecture (Second Edition)",
  "author": "Robert C. Martin",
  "isbn": "978-0134494166",
  "genre": "Software Engineering",
  "price": 38.50,
  "stock": 50,
  "publishedYear": 2024,
  "description": "Updated guide with microservices and cloud-native architecture patterns."
}
```

#### 4. Delete Book (Admin / Librarian Only)
- **Endpoint**: `DELETE /api/books/{id}`
- **Response**: `204 No Content`

---

## Free Cloud Deployment Options & GitHub Actions Setup

You can easily deploy this application to **free cloud hosting platforms** using Docker containers and GitHub Actions.

### Option 1: Render.com (Recommended Free Cloud Hosting)

Render provides free hosting for Docker Web Services, Managed PostgreSQL, and Redis.

#### 1. Setup Render Account & Blueprint:
1. Sign up for a free account at [Render.com](https://render.com).
2. Go to **Dashboard** -> **New** -> **Blueprint**.
3. Connect your GitHub repository `https://github.com/syskantechnosoft/bookstore`.
4. Render automatically detects `render.yaml` in your repository and provisions:
   - **PostgreSQL Database** (`bookstore-postgres-db` - Free)
   - **Redis Cache** (`bookstore-redis-cache` - Free)
   - **Spring Boot Backend** (`bookstore-backend-api` - Free)
   - **React Frontend** (`bookstore-frontend-ui` - Free)

#### 2. Automated CD via GitHub Actions:
1. In your Render Dashboard, navigate to your Web Services and copy their **Deploy Hook URLs**.
2. Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
3. Add the secret keys:
   - `RENDER_BACKEND_DEPLOY_HOOK`: `<Your Render Backend Deploy Hook URL>`
   - `RENDER_FRONTEND_DEPLOY_HOOK`: `<Your Render Frontend Deploy Hook URL>`
4. Every push to `main` automatically triggers the `.github/workflows/deploy-render.yml` pipeline!

---

## Local Development & Testing

### Run Backend Unit & Integration Tests:
```bash
cd backend
mvn clean test "-Dspring.profiles.active=h2"
```

### Run Multi-Container Stack via Docker Compose:
```bash
docker-compose up --build
```
- **React Frontend**: `http://localhost`
- **Spring Boot API**: `http://localhost:8085`
- **Swagger UI**: `http://localhost:8085/swagger-ui.html`
- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3000` (User: `admin`, Pass: `admin`)
