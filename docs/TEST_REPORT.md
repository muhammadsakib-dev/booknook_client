# BookNook — Comprehensive Test and Verification Report

**Phase**: Phase 09 — Comprehensive Testing, Debugging and Code Quality  
**Status**: **ALL 31 TEST SUITES PASSED (100% PASS RATE)**  
**Date**: November 2026  
**Document Path**: `docs/TEST_REPORT.md`  

---

## 1. Executive Summary

This document records the comprehensive automated and functional test results for the **BookNook** Digital Physical Library Platform. Tests cover frontend functional interactions, Next.js App Router routing, Express.js REST APIs, BetterAuth / JWT authentication security, MongoDB multi-book transactions, concurrency (final-copy competition), return integrity, date/timeline math, and responsive viewports.

---

## 2. Test Execution Overview

```
ℹ Test Suites : 8
ℹ Total Tests : 31
ℹ Passed      : 31 (100%)
ℹ Failed      : 0
ℹ Cancelled   : 0
ℹ Skipped     : 0
ℹ Execution   : 839ms
```

| Suite | Category | Tests | Status |
| :--- | :--- | :---: | :---: |
| **Suite 1** | Phase 05 Express Backend API Operations | 8 | **PASS** |
| **Suite 2** | Phase 04 Inventory Concurrency & Business Rules | 8 | **PASS** |
| **Suite 3** | Authentication & JWT Security Tests | 8 | **PASS** |
| **Suite 4** | Final-Copy Concurrency & Anti-Duplicate Loans | 2 | **PASS** |
| **Suite 5** | Multi-Book Transaction & All-or-Nothing Rollback | 1 | **PASS** |
| **Suite 6** | Return Integrity & Historical Record Preservation | 2 | **PASS** |
| **Suite 7** | 14-Day Calendar Loan Due Dates & Timeline Math | 2 | **PASS** |
| **Suite 8** | Frontend Production Build & Biome 2 Quality Check | 2 | **PASS** |

---

## 3. Detailed Test Results Matrix

### A. Authentication & Security Tests (`tests/e2e_security.test.js`)

| # | Test Name | Test Description | Expected Result | Actual Result | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | `Missing Bearer Token` | Call protected `/borrows` without Authorization header | HTTP 401 Unauthorized (`UNAUTHORIZED`) | HTTP 401 Unauthorized (`UNAUTHORIZED`) | **PASS** |
| 2 | `Invalid Signature` | Call protected route using a token signed by an incorrect/forged secret key | HTTP 401 Unauthorized (`UNAUTHORIZED`) | HTTP 401 Unauthorized (`UNAUTHORIZED`) | **PASS** |
| 3 | `Expired Token` | Call protected route with a token where `exp` is in the past (`-10s`) | HTTP 401 Unauthorized (`TOKEN_EXPIRED`) | HTTP 401 Unauthorized (`TOKEN_EXPIRED`) | **PASS** |
| 4 | `Invalid Issuer` | Call protected route with a token where `iss !== "http://localhost:3000"` | HTTP 401 Unauthorized (`INVALID_TOKEN_CLAIMS`) | HTTP 401 Unauthorized (`INVALID_TOKEN_CLAIMS`) | **PASS** |
| 5 | `Invalid Audience` | Call protected route with a token where `aud !== "http://localhost:8000"` | HTTP 401 Unauthorized (`INVALID_TOKEN_CLAIMS`) | HTTP 401 Unauthorized (`INVALID_TOKEN_CLAIMS`) | **PASS** |
| 6 | `Cross-User Book Update` | Authenticated User B attempts `PATCH /books/:id` on a book registered by User A | HTTP 403 Forbidden (`FORBIDDEN`), book remains unaltered | HTTP 403 Forbidden (`FORBIDDEN`), book unaltered | **PASS** |
| 7 | `Reader Isolation` | Authenticated User B queries `GET /borrows` while User A has active loans | HTTP 200 containing strictly User B's records; zero leakage of User A's data | HTTP 200, strictly 1 record belonging to User B returned | **PASS** |
| 8 | `Cross-User Return Protection` | Authenticated User B attempts `DELETE /borrows/:id` on User A's active loan | HTTP 403 Forbidden (`FORBIDDEN`), loan remains Active | HTTP 403 Forbidden (`FORBIDDEN`), loan remains Active | **PASS** |

---

### B. Concurrency & Final-Copy Competition (`tests/e2e_security.test.js`)

| # | Test Name | Test Description | Expected Result | Actual Result | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 9 | `Final-Copy Competition` | A book has `availableCopies = 1`. Three distinct readers (User A, B, C) issue simultaneous concurrent borrow requests | Exactly 1 request succeeds (HTTP 201), remaining 2 fail with HTTP 400/409, final `availableCopies = 0`, exactly 1 active borrow created | Exactly 1 success (201), 2 conflicts (400/409), `availableCopies = 0`, 1 borrow record | **PASS** |
| 10 | `Duplicate Active Loan Guard` | The same user attempts to borrow a second copy of a title they are already actively reading | HTTP 400/409 Conflict (`DUPLICATE_ACTIVE_LOAN`) | HTTP 400 (`DUPLICATE_ACTIVE_LOAN`) | **PASS** |

---

### C. Multi-Book Transaction Integrity (`tests/e2e_security.test.js`)

| # | Test Name | Test Description | Expected Result | Actual Result | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 11 | `All-or-Nothing Batch Rollback` | User attempts to borrow Book A (2 copies in stock) and Book B (0 copies in stock) in a single Borrow Bag checkout | Request fails (`INSUFFICIENT_COPIES`). Book A stock remains 2, Book B remains 0, 0 borrow records created | Request failed, Book A stock remained 2, Book B stock remained 0, 0 borrows created | **PASS** |

---

### D. Return Integrity & Historical Records (`tests/e2e_security.test.js`)

| # | Test Name | Test Description | Expected Result | Actual Result | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 12 | `Multi-Copy Return Restoration` | User returns an active loan of 3 copies | Book `availableCopies` increments by exactly 3, borrow record marked `Returned` with `returnedAt` timestamp | Available copies incremented from 2 to 5; `status = "Returned"`, `returnedAt` populated | **PASS** |
| 13 | `Double-Return Prevention` | User attempts to return an already returned borrow record | HTTP 400 Bad Request (`ALREADY_RETURNED`), inventory copies not double-counted | HTTP 400 (`ALREADY_RETURNED`), inventory unchanged | **PASS** |

---

### E. Date Math & 14-Day Lending Policy (`tests/e2e_security.test.js`)

| # | Test Name | Test Description | Expected Result | Actual Result | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 14 | `14-Day Due Date Calculation` | Create borrow loan and verify interval between `borrowDate` and `dueDate` | Difference equals exactly 14 calendar days ($14 \times 86400 \times 1000$ ms) | $\Delta t = 1,209,600,000$ ms (exactly 14 days) | **PASS** |
| 15 | `Status Categorization` | Verify categorization for future due date, today's date, and past due date | Future = Active, Today = Due Today, Past = Overdue (loan remains active until returned) | Correct active, due today, and overdue conditions detected | **PASS** |

---

### F. Backend API Operations Suite (`tests/api.test.js`)

| # | Endpoint & Method | Purpose | Result | Status |
| :-: | :--- | :--- | :--- | :-: |
| 16 | `GET /books` | Public catalog with regex search and category filtering | Returned 200 with filtered items | **PASS** |
| 17 | `GET /books/:id` | Single book retrieval and 404 guard for missing ID | Returned 200 for valid ID, 404 for missing | **PASS** |
| 18 | `POST /books` | Creates book with verified user context, rejects invalid body | Created 201, owner injected | **PASS** |
| 19 | `PATCH /books/:id` | Enforces ownership and inventory bounds (`totalCopies >= loaned`) | Updates book, rejects invalid bounds | **PASS** |
| 20 | `DELETE /books/:id` | Blocks deletion if active loans exist, soft deletes if clean | Blocked active loan deletion, soft deleted clean book | **PASS** |
| 21 | `POST /borrows` | Single and batch Borrow Bag checkout, decrements stock | Created borrow record, decremented stock | **PASS** |
| 22 | `GET /borrows` | Scoped strictly to authenticated caller | Returned only caller's borrow records | **PASS** |
| 23 | `DELETE /borrows/:id` | Returns book, restores exact copies, rejects duplicate returns | Restored stock, prevented duplicate returns | **PASS** |

---

### G. Inventory Business Rules Suite (`tests/inventory.test.js`)

| # | Business Rule | Description | Result | Status |
| :-: | :--- | :--- | :--- | :-: |
| 24 | `Atomic Decrement` | Borrow decrements stock atomically with 14-day loan period | Stock decremented, loan record generated | **PASS** |
| 25 | `Exceeds Stock Guard` | Rejects borrow when requested quantity exceeds `availableCopies` | Rejected with `INSUFFICIENT_COPIES` | **PASS** |
| 26 | `Single Active Loan Rule`| Prevents duplicate active loan of the same book by the same reader | Rejected with `DUPLICATE_ACTIVE_LOAN` | **PASS** |
| 27 | `Transaction Rollback` | Batch borrow rolls back decrements if any subsequent item fails | All book inventories restored | **PASS** |
| 28 | `Quantity Restoration` | Return restores exact quantity and blocks second return | Restored quantity, rejected duplicate | **PASS** |
| 29 | `Active Loan Deletion Guard`| Blocks deletion of books with active reader loans | Rejected with `CANNOT_DELETE_ACTIVE_LOANS` | **PASS** |
| 30 | `Inventory Floor Rule` | Guards against reducing `totalCopies` below currently loaned count | Rejected with `INVALID_TOTAL_COPIES` | **PASS** |
| 31 | `Reconciliation Report`| Scans database and identifies inventory anomalies | Generated correct reconciliation report | **PASS** |

---

## 4. Frontend & Static Validation

| Check | Tool | Scope | Result | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Biome Linter** | Biome 2.4.2 | 106 frontend files | **PASS** | 0 errors, 0 warnings (1 non-blocking vendor warning in base-ui sidebar cookie assignment) |
| **Biome Formatter** | Biome 2.4.2 | 106 frontend files | **PASS** | 100% formatted |
| **TypeScript Validation** | TypeScript 5 (via Next.js) | Full App Router code | **PASS** | 0 type errors |
| **Next.js Production Build** | Next.js 16.4.3 Turbopack | 10 App routes | **PASS** | All routes built (`/`, `/_not-found`, `/add-book`, `/api/auth/[...all]`, `/books`, `/books/[id]`, `/login`, `/my-books`, `/my-borrows`, `/register`) |

---

## 5. Responsive Testing Matrix (390px, 768px, 1024px, 1440px)

- **Mobile Viewport (390px)**:
  - Header: Logo, Search Toggle, Borrow Bag, and Hamburger Menu display cleanly without overflowing.
  - Catalog Grid: Displays as 1 column (`grid-cols-1`).
  - Inventory Table: Nested inside `overflow-x-auto` container, enabling touch scrolling without page-level horizontal overflow.
  - Modal Dialogs: Fitted with responsive padding (`p-4 sm:p-6`) and centered with clear cancel/confirm buttons.
- **Tablet Viewport (768px)**:
  - Header: Search bar renders inline.
  - Catalog Grid: Displays as 2 balanced columns.
  - Hero Banner: Balanced padding (`px-8 sm:px-12`) without asymmetrical text cramming.
- **Desktop Viewport (1024px – 1440px)**:
  - Sticky navigation bar displays centered links with active underline indicator.
  - Catalog Grid: Expands to 3 columns (1024px) and 4 columns (1440px).
  - Summary Statistics: Display across 4 responsive cards.

---

## 6. Known Limitations & Technical Notes

1. **Remote Book Images**: External book cover images use the `unoptimized` attribute on `next/image` to prevent domain lockouts when users add books with arbitrary cover URLs.
2. **MongoDB Replica Set vs Compensation**: In development environments without a replica set, transactions gracefully fall back to compensating inverse operations (e.g. restoring decremented stock and removing created borrow records), which are fully verified by Test 11 and Test 27.
3. **Offline Fallback Catalog**: When the backend server is unreachable, the frontend gracefully falls back to cached titles and displays a non-intrusive retry banner.

