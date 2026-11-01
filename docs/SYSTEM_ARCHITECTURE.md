# BookNook — System Architecture Specification

**Version**: 1.0.0 (Phase 02 Architecture Contract)  
**Status**: APPROVED DESIGN  
**Date**: October 31, 2026  

---

## 1. High-Level Architecture Overview

BookNook is architected as a modern, decoupled full-stack application separating user-facing rendering, authentication orchestration, business logic, and transactional database persistence.

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Client (Vercel)"]
        Browser["Reader / Librarian Web Browser"]
        NextApp["Next.js 16 App Router\n(React 19 + Tailwind v4)"]
        AuthClient["BetterAuth Client SDK\n(Session Context & Tokens)"]
        CartStore["Borrow Bag Provider\n(Local & Session State)"]
    end

    subgraph AuthLayer["Authentication & Security"]
        NextAuthRoute["Next.js Route Handler\n/api/auth/[...all]"]
        BetterAuthServer["BetterAuth Engine\n(Google OAuth / Credentials)"]
        JWTIssuer["JWT Token Signer / JWKS"]
    end

    subgraph BackendLayer["Business API (Render)"]
        ExpressApp["Express.js 5 Service (Port 8000)"]
        AuthMiddleware["JWT Authentication Guard\n(Bearer Token Verification)"]
        BookRouter["/books Route Handler"]
        BorrowRouter["/borrows Route Handler"]
        AtomicEngine["Atomic Inventory & Transaction Engine"]
    end

    subgraph DatabaseLayer["Data Persistence (MongoDB Atlas)"]
        MongoCluster[("MongoDB Atlas: assignment-08")]
        BooksColl[("books Collection")]
        BorrowsColl[("borrows Collection")]
        AuthColls[("users, sessions, accounts Collections")]
    end

    Browser <--> NextApp
    NextApp <--> CartStore
    NextApp <--> AuthClient
    AuthClient <--> NextAuthRoute
    NextAuthRoute <--> BetterAuthServer
    BetterAuthServer <--> AuthColls
    BetterAuthServer --> JWTIssuer

    NextApp -- "HTTP + Bearer JWT" --> ExpressApp
    ExpressApp --> AuthMiddleware
    AuthMiddleware --> BookRouter
    AuthMiddleware --> BorrowRouter
    BookRouter --> AtomicEngine
    BorrowRouter --> AtomicEngine

    AtomicEngine <--> BooksColl
    AtomicEngine <--> BorrowsColl
```

---

## 2. Core Technological Components

| Layer | Technology | Primary Role | Hosting / Runtime |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript | Server and Client Components, fast edge rendering, client-side UI state, live previews | Vercel Serverless / Edge |
| **Authentication** | BetterAuth (`better-auth`) | User signup, login, Google OAuth, session cookies, JWT token issuance for backend calls | Next.js API Route (`/api/auth/*`) |
| **Business API** | Express.js 5.3 (ESM) | Business logic validation, inventory invariant protection, atomic borrow/return transactions | Render Web Service |
| **Database** | MongoDB 7.8 Native Driver | Document database storing books, borrow contracts, and auth accounts | MongoDB Atlas Dedicated/Serverless |
| **Styling & UI** | Tailwind CSS v4, Base UI, shadcn | Themeable UI tokens (`@theme`), Dark Green primary palette, responsive layout | Client Bundle |
| **Code Hygiene** | React Compiler + Biome 2.4 | Automated memoization, strict linting, zero ESLint/Prettier conflicts | Development Tooling |

---

## 3. End-to-End Authentication Architecture

BetterAuth runs directly inside the Next.js application as a route handler (`/api/auth/[...all]`). When requests are made from the frontend to the Express backend (`http://localhost:8000` or production Render API), a signed JSON Web Token (JWT) is attached in the `Authorization: Bearer <token>` header.

```mermaid
sequenceDiagram
    autonumber
    actor User as Reader / Librarian
    participant Client as Next.js Frontend
    participant Auth as BetterAuth API Handler
    participant Express as Express.js Backend
    participant Mongo as MongoDB Atlas

    User->>Client: Clicks "Login with Google" or submits email/password
    Client->>Auth: POST /api/auth/sign-in
    Auth->>Mongo: Verify credentials or handle OAuth exchange
    Mongo-->>Auth: User record & roles verified
    Auth-->>Client: Returns session cookie & signed API JWT
    Note over Client: Client stores token securely in memory

    User->>Client: Confirms Borrow Bag or Adds New Book
    Client->>Express: POST /borrows (with Authorization: Bearer JWT)
    Express->>Express: AuthMiddleware verifies JWT signature & expiration
    alt Invalid / Expired Token
        Express-->>Client: 401 Unauthorized
    else Valid Token
        Note over Express: req.user = { id, email, name, role }
        Express->>Mongo: Execute atomic business operation
        Mongo-->>Express: Operation committed
        Express-->>Client: 201 Created { success: true, data: ... }
    end
```

### Express JWT Verification Strategy
1. The Express server uses a lightweight verification middleware (`jsonwebtoken` or `@better-auth/jwt`).
2. The shared secret (`BETTER_AUTH_SECRET` or `JWT_SECRET`) is shared securely between Next.js and Express via environment variables.
3. Every authenticated route receives `req.user` populated with:
   - `id`: Unique User ObjectId string.
   - `email`: Authenticated email address.
   - `name`: User full name.
   - `role`: Role (`"reader"` or `"librarian"`).

---

## 4. End-to-End Borrowing Flow

The borrow operation enforces **zero partial checkouts**, **atomic inventory decrements**, and **concurrency protection**.

```mermaid
sequenceDiagram
    autonumber
    actor Reader as Student / Reader
    participant Bag as Borrow Bag (Cart)
    participant Client as Frontend (/books/[id] or CartSheet)
    participant API as Express API (POST /borrows)
    participant DB as MongoDB (books & borrows)

    Reader->>Bag: Adds book (Quantity: 1 or 2)
    Reader->>Bag: Clicks "Confirm Borrow"
    Bag->>Client: Prepares checkout payload { items: [{ bookId, quantity }] }
    Client->>API: POST /borrows with Bearer Token
    
    API->>API: Verify Reader Authentication
    API->>DB: Check for existing Active borrow of same title by this user
    alt Duplicate Active Borrow Found
        API-->>Client: 400 DUPLICATE_ACTIVE_LOAN (User already has active copy)
    else No Duplicate
        Note over API,DB: Atomic Conditional Inventory Decrement
        API->>DB: findOneAndUpdate({ _id: bookId, isDeleted: false, availableCopies: >= qty }, { $inc: { availableCopies: -qty } })
        alt Insufficient Copies Available
            API-->>Client: 400 INSUFFICIENT_COPIES ("Only X copies left")
        else Decrement Successful
            API->>DB: insertOne(newBorrowRecord { returnDate: now + 14 days, status: "Active" })
            API-->>Client: 201 CREATED { borrow: record }
            Client->>Bag: clearCart()
            Client-->>Reader: Success confirmation & redirect to /my-borrows
        end
    end
```

---

## 5. End-to-End Return Flow

Returning a book restores library inventory while preserving complete historical audit trails.

```mermaid
sequenceDiagram
    autonumber
    actor Reader as Student / Reader
    participant Dashboard as My Borrows Dashboard
    participant API as Express API (DELETE /borrows/:id or PUT /borrows/:id/return)
    participant DB as MongoDB (books & borrows)

    Reader->>Dashboard: Clicks "Return Book"
    Dashboard->>Dashboard: Displays return confirmation modal
    Reader->>Dashboard: Confirms Return
    Dashboard->>API: PUT /borrows/:id/return with Bearer Token

    API->>API: Verify Authentication & Ownership (req.user.id === borrow.userId or role === "librarian")
    API->>DB: findOne({ _id: borrowId, status: "Active" })
    alt Borrow not found or already returned
        API-->>Dashboard: 400 ALREADY_RETURNED
    else Active Borrow Found
        API->>DB: updateOne({ _id: borrowId }, { status: "Returned", returnedAt: now })
        API->>DB: updateOne({ _id: bookId }, { $inc: { availableCopies: borrow.quantity } })
        API-->>Dashboard: 200 OK { message: "Book returned successfully" }
        Dashboard-->>Reader: Updates loan card to "Returned" badge & shows success toast
    end
```

---

## 6. Hosting and Deployment Topology

- **Frontend (Vercel)**:
  - Custom domain or Vercel production URL.
  - Environment variables: `NEXT_PUBLIC_API_URL` (points to Render backend), `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- **Backend (Render Web Service)**:
  - Docker or Node.js environment (`node index.js`).
  - Environment variables: `PORT=8000`, `MONGODB_URL` (Atlas connection string), `BETTER_AUTH_SECRET` (shared for JWT validation), `ALLOWED_ORIGIN` (Vercel domain).
- **Database (MongoDB Atlas)**:
  - M0 or Serverless Atlas instance in the same regional data center (e.g., AWS us-east-1 or ap-southeast-1) to minimize network latency between Render and MongoDB.

---

*Specification authored in accordance with Phase 02 requirements.*

