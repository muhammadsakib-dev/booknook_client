# BookNook Data Migration & Index Provisioning Guide

## 1. Overview

This document describes the non-destructive data migration and index provisioning pipeline developed in **Phase 04** for MongoDB Atlas database `assignment-08`.

---

## 2. Safe Migration Principles
1. **Zero Data Loss**: Existing documents and collections are NEVER deleted, dropped, or wiped.
2. **Schema Normalization**: Missing legacy fields (e.g., `isDeleted`, `totalCopies`, `quantity`) are populated with safe defaults.
3. **Idempotence**: Running the migration multiple times produces identical, safe outcomes without error or duplication.
4. **Pre-Index Anomaly Resolution**: Inspects and audits potential duplicate active loans before attempting unique index creation to prevent indexing failure.

---

## 3. Provisioned Database Indexes

The following indexes are provisioned via `booksnook_backend/services/migrationService.js`:

| Collection | Index Name | Keys / Specification | Type / Constraints | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `borrows` | `idx_borrows_unique_active_loan` | `{ userId: 1, bookId: 1 }` | `unique: true`, `partialFilterExpression: { status: "Active" }` | Hard database guard preventing duplicate active borrows for the same title |
| `borrows` | `idx_borrows_user_status` | `{ userId: 1, status: 1 }` | Standard Compound | Fast filtering for `/my-borrows` user dashboard |
| `borrows` | `idx_borrows_book_status` | `{ bookId: 1, status: 1 }` | Standard Compound | Rapid active-loan count queries before book deletion and updates |
| `books` | `idx_books_deleted_category` | `{ isDeleted: 1, category: 1 }` | Standard Compound | High-performance catalog browsing and category filtering |
| `books` | `idx_books_owner` | `{ ownerUserId: 1 }` | Single Field | Rapid fetching for `/my-books` user inventory |

---

## 4. Execution & Automation

### Automated Startup Provisioning
The migration pipeline is integrated into `booksnook_backend/index.js` and runs automatically when the backend boots:
```javascript
import { runDatabaseMigrations } from "./services/migrationService.js";

// Non-blocking index and normalization verification
try {
  await runDatabaseMigrations(db);
} catch (migErr) {
  console.warn("Database migration notice on startup:", migErr.message);
}
```

### Manual CLI Execution
To run standalone migration and inspect output:
```bash
cd booksnook_backend
npm run migrate
```
Or directly:
```bash
node services/migrationService.js
```

---

## 5. Migration Execution Log

*Executed on MongoDB Atlas `assignment-08`:*
```json
{
  "indexesCreated": [
    "idx_borrows_unique_active_loan",
    "idx_borrows_user_status",
    "idx_borrows_book_status",
    "idx_books_deleted_category",
    "idx_books_owner"
  ],
  "booksNormalized": 0,
  "borrowsNormalized": 0,
  "duplicateActiveLoansFound": 0,
  "timestamp": "2026-10-31T15:22:56.476Z"
}
```

---

## 6. Rollback Instructions

If an index needs to be dropped for troubleshooting or restructuring:

```javascript
// Drop partial unique index
await db.collection("borrows").dropIndex("idx_borrows_unique_active_loan");

// Drop query indexes
await db.collection("borrows").dropIndex("idx_borrows_user_status");
await db.collection("borrows").dropIndex("idx_borrows_book_status");
await db.collection("books").dropIndex("idx_books_deleted_category");
await db.collection("books").dropIndex("idx_books_owner");
```
No data modification occurs during index removal.

