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
  - Automatically provisions tables and populates **100 sample book records** across 10 genres.
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
    Nginx -->|Proxy /api/| SpringBoot[Spring Boot 4.1.0 Backend / Port 8080]
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
        varchar_50 name UK "NOT NULL (ROLE_ADMIN, ROLE_LIBRARIAN, ROLE_USER)"
    }

    USER_ROLES {
        bigint user_id PK, FK
        bigint role_id PK, FK
    }

    BOOKS {
        bigint id PK
        varchar_255 title "NOT NULL"
        varchar_255 author "NOT NULL"
        varchar_20 isbn UK "NOT NULL"
        decimal_10_2 price "NOT NULL, CHECK >= 0"
        int published_year "NOT NULL"
        varchar_100 genre "NOT NULL"
        int stock "NOT NULL, CHECK >= 0"
        varchar_1000 description
    }
```

---

### 3. Component & Class Diagram

```mermaid
classDiagram
    class AuthController {
        +login(AuthRequest): AuthResponse
        +register(RegisterRequest): MessageResponse
    }

    class BookController {
        +getAllBooks(query, genre, page, size, sortBy, sortDir): Page~BookDto~
        +getBookById(id): BookDto
        +createBook(BookDto): BookDto
        +updateBook(id, BookDto): BookDto
        +deleteBook(id): MessageResponse
    }

    class AuthService {
        +login(AuthRequest): AuthResponse
        +register(RegisterRequest): String
    }

    class BookService {
        +getAllBooks(query, genre, pageable): Page~BookDto~
        +getBookById(id): BookDto
        +createBook(BookDto): BookDto
        +updateBook(id, BookDto): BookDto
        +deleteBook(id): void
    }

    class BookRepository {
        +findByIsbn(isbn): Optional~Book~
        +existsByIsbn(isbn): Boolean
        +searchBooks(query, genre, pageable): Page~Book~
    }

    class JwtAuthenticationFilter {
        #doFilterInternal(request, response, filterChain)
    }

    class SecurityConfig {
        +securityFilterChain(HttpSecurity): SecurityFilterChain
        +passwordEncoder(): PasswordEncoder
    }

    AuthController --> AuthService
    BookController --> BookService
    BookService --> BookRepository
    SecurityConfig --> JwtAuthenticationFilter
```

---

### 4. JWT Authentication & RBAC Authorization Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Client / User
    participant React as React 19 Frontend
    participant Security as JwtAuthenticationFilter
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthService
    participant DB as Database (H2/Postgres/MySQL)

    User->>React: Enter username & password
    React->>AuthCtrl: POST /api/auth/login
    AuthCtrl->>AuthSvc: login(AuthRequest)
    AuthSvc->>DB: Query User by Username
    DB-->>AuthSvc: Return User Entity & Hashed Password
    AuthSvc->>AuthSvc: Verify Password with BCrypt
    AuthSvc-->>AuthCtrl: Return JWT Token & User Roles
    AuthCtrl-->>React: 200 OK + JWT Bearer Token
    React->>React: Store JWT in LocalStorage

    Note over User, DB: Subsequent Authenticated Request
    User->>React: Click "Add Book" (Librarian/Admin)
    React->>Security: POST /api/books (Header: Authorization Bearer <token>)
    Security->>Security: Validate JWT Signature & Extract Roles
    alt Valid Token & Authorized Role (ADMIN / LIBRARIAN)
        Security->>DB: Process Request & Execute Mutation
        DB-->>Security: Mutation Success
        Security-->>React: 201 Created + Saved Book
    else Invalid Token or User Role (USER - Read Only)
        Security-->>React: 403 Forbidden / 401 Unauthorized
    end
```

---

### 5. Book CRUD Operations & Redis Caching Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Client as React Client
    participant Controller as BookController
    participant Service as BookService
    participant Cache as Redis Cache
    participant Repo as BookRepository
    participant DB as Database

    Note over Client, DB: Cacheable Read Flow (GET /api/books/{id})
    Client->>Controller: GET /api/books/1
    Controller->>Service: getBookById(1)
    Service->>Cache: Check "books::1"
    alt Cache Hit
        Cache-->>Service: Return Cached BookDto
    else Cache Miss
        Service->>Repo: findById(1)
        Repo->>DB: SELECT * FROM books WHERE id=1
        DB-->>Repo: Return Book Record
        Repo-->>Service: Return Book Entity
        Service->>Cache: Save to "books::1"
        Service-->>Controller: Return BookDto
    end
    Controller-->>Client: 200 OK (Book Data)

    Note over Client, DB: Cache Eviction Write Flow (PUT /api/books/{id})
    Client->>Controller: PUT /api/books/1 (Updated Book)
    Controller->>Service: updateBook(1, BookDto)
    Service->>Repo: save(updatedBook)
    Repo->>DB: UPDATE books SET ... WHERE id=1
    DB-->>Repo: Updated
    Service->>Cache: Evict key "books::1" & Clear Search Caches
    Service-->>Controller: Return Updated BookDto
    Controller-->>Client: 200 OK
```

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

### Option 2: Koyeb (Alternative Free Container Platform)

Koyeb offers free web service micro-instances for Docker apps.

1. Create a free account at [Koyeb.com](https://koyeb.com).
2. Create a service linking to your GitHub repository `syskantechnosoft/bookstore`.
3. Set the builder type to **Dockerfile**, using `./backend/Dockerfile` for API and `./frontend/Dockerfile` for UI.

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
- **Spring Boot API**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Prometheus**: `http://localhost:9090`
- **Grafana**: `http://localhost:3000` (User: `admin`, Pass: `admin`)
