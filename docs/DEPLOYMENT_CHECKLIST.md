# 🚀 BookNook — Production Deployment & Handover Checklist

This document details the step-by-step production deployment procedure for **BookNook**, connecting the **Next.js frontend on Vercel**, the **Express API on Render**, and the **MongoDB Atlas cluster**.

---

## 📋 Pre-Deployment Codebase Verification

Run all pre-flight checks locally prior to committing and pushing code:

| Component | Command | Expected Result | Verified Status |
| :--- | :--- | :--- | :--- |
| **Backend Test Suite** | `npm test` (in `booksnook_backend`) | 31 passed, 0 failed across 8 suites | ✅ Passed |
| **Frontend Linter** | `npm run lint` (in `booknook_client`) | 0 Biome errors | ✅ Passed |
| **Frontend Production Build** | `npm run build` (in `booknook_client`) | 10/10 routes compiled with exit code 0 | ✅ Passed |

---

## 🗄 1. MongoDB Atlas Production Configuration

1. **Cluster Setup**:
   - Ensure an active **M0 Free Tier** or **M10+ Dedicated Cluster** is running on MongoDB Atlas.
   - Atlas clusters run natively as **3-node Replica Sets**, enabling multi-document ACID transactions.
2. **Network Access / IP Whitelist**:
   - In Atlas Console $\rightarrow$ **Network Access** $\rightarrow$ **IP Access List**.
   - Add IP: `0.0.0.0/0` (Allow access from anywhere) with comment: *"Required for Render & Vercel dynamic IP ranges"*.
3. **Database User & Permissions**:
   - In Atlas Console $\rightarrow$ **Database Access**.
   - Ensure a dedicated database user exists with `readWriteAnyDatabase` or `readWrite` permissions on database `assignment-08`.
4. **Automated Indexes**:
   - The backend `migrationService.js` provisions all partial unique and query indexes automatically on first server boot:
     - `idx_borrows_unique_active_loan`: `{ userId: 1, bookId: 1 }` (partialFilter: `status: "Active"`)
     - `idx_borrows_user_status`: `{ userId: 1, status: 1 }`
     - `idx_borrows_book_status`: `{ bookId: 1, status: 1 }`
     - `idx_books_deleted_category`: `{ isDeleted: 1, category: 1 }`
     - `idx_books_owner`: `{ ownerUserId: 1 }`

---

## ⚙️ 2. Render Backend Deployment

1. Sign in to [Render](https://render.com).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub backend repository (`booksnook_backend`).
4. **General Settings**:
   - **Name**: `booknook-api`
   - **Region**: Closest to your users (e.g. Frankfurt, Oregon, or Singapore).
   - **Branch**: `main` or `master`.
   - **Runtime**: `Node`.
   - **Build Command**: `npm install`.
   - **Start Command**: `npm start`.
   - **Instance Type**: Free or Starter.
5. **Environment Variables**:

| Variable Name | Production Value Example | Visibility |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Server-only |
| `MONGODB_URL` | `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority` | Server-only |
| `DB_NAME` | `assignment-08` | Server-only |
| `BETTER_AUTH_SECRET` | *(Must match Vercel exact 32+ char secret)* | Server-only |
| `ALLOWED_ORIGIN` | `https://booknook-client.vercel.app,http://localhost:3000` | Server-only |
| `TOKEN_ISSUER` | `https://booknook-client.vercel.app` | Server-only |
| `TOKEN_AUDIENCE` | `https://booknook-api.onrender.com` | Server-only |

6. Click **Create Web Service**.
7. Once deployed, test the health check route:
   ```bash
   curl -I https://booknook-api.onrender.com/health
   ```
   *Expected Response: HTTP 200 OK with `{"success": true, "data": {"status": "healthy"}}`.*

---

## 🌐 3. Vercel Frontend Deployment

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub frontend repository (`booknook_client`).
4. **Project Settings**:
   - **Framework Preset**: `Next.js`.
   - **Root Directory**: `./` (or `booknook_client` if monorepo).
   - **Build Command**: `next build` (default).
5. **Environment Variables**:

| Variable Name | Production Value Example | Visibility |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://booknook-api.onrender.com` | Public (Client + Server) |
| `NEXT_PUBLIC_APP_URL` | `https://booknook-client.vercel.app` | Public (Client + Server) |
| `BETTER_AUTH_URL` | `https://booknook-client.vercel.app` | Server-only |
| `BETTER_AUTH_SECRET` | *(Must match Render exact 32+ char secret)* | Server-only |
| `MONGODB_URL` | `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority` | Server-only |
| `GOOGLE_CLIENT_ID` | `...apps.googleusercontent.com` | Server-only |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | Server-only |

6. Click **Deploy**.
7. Note down your final production URL (e.g. `https://booknook-client.vercel.app`).

---

## 🔑 4. Google Cloud OAuth 2.0 Production Setup

1. Open the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Select your BookNook project.
3. Edit your **OAuth 2.0 Client ID**:
   - **Authorized JavaScript Origins**:
     - `http://localhost:3000`
     - `https://booknook-client.vercel.app`
   - **Authorized Redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://booknook-client.vercel.app/api/auth/callback/google`
4. Click **Save**.

---

## 🔄 5. Cross-Service Synchronization Check

Ensure both services have matching secrets and addresses:

```mermaid
flowchart LR
    Browser["User Browser"] -->|1. Web Interface| Vercel["Vercel Frontend (Next.js)"]
    Vercel -->|2. BetterAuth Session + JWT| Vercel
    Vercel -->|3. Bearer JWT /books, /borrows| Render["Render Backend (Express 5)"]
    Render -->|4. Verified Subject / Claims| Render
    Render -->|5. Native Transactions| Mongo[("MongoDB Atlas Replica Set")]
    Vercel -->|Auth Collections| Mongo
```

- [x] `BETTER_AUTH_SECRET` on Vercel == `BETTER_AUTH_SECRET` on Render.
- [x] `ALLOWED_ORIGIN` on Render contains the exact Vercel production domain.
- [x] `NEXT_PUBLIC_API_URL` on Vercel contains the exact Render backend URL.
- [x] `TOKEN_ISSUER` on Render matches `BETTER_AUTH_URL` on Vercel.
- [x] `TOKEN_AUDIENCE` on Render matches `NEXT_PUBLIC_API_URL` on Vercel.

---

## ✅ 6. Final Production Acceptance Run-Through

Perform these operational tests on the live production URL:

1. **Public Catalog Browsing**:
   - Open `https://<vercel-domain>/books`. Confirm books render with covers and stock badges.
   - Type in the search input; verify URL query synchronization (`?search=...`).
   - Filter by categories (*Fiction*, *Science*); verify instant filtering.
2. **User Authentication**:
   - Register a new reader account; verify password validation rules.
   - Click "Continue with Google"; verify Google consent and redirect back into the app.
   - Hard refresh (`F5`); verify the session survives.
3. **Book Contributor Workflow**:
   - Navigate to `/add-book`; fill the form; observe the live preview card update.
   - Submit book; verify redirection and appearance in `/my-books`.
   - On `/my-books`, verify the 4 summary metrics (*Total Books*, *Total Copies*, *Available Copies*, *Currently Loaned*).
   - Edit book in modal; adjust `totalCopies`.
4. **Reader Borrowing & Concurrency Workflow**:
   - Add a book to the **Borrow Bag** drawer.
   - Verify non-commercial terminology (*Borrow Bag*, *Selected Books*, *Expected Return Date*).
   - Confirm reservation. Verify that `availableCopies` decrements immediately.
   - Attempt to borrow the same book again while the active loan is open; verify duplicate rejection.
5. **Loan Management & Returns**:
   - Navigate to `/my-borrows`. Verify the active loan with a 14-day return countdown.
   - Click "Return Book"; confirm modal.
   - Verify status transitions to "Returned" and book's `availableCopies` increments on the catalog.
   - Verify contributor cannot delete a book with active reader loans.

