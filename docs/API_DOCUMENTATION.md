# BookNook API Documentation

## 1. Overview & Architecture

The BookNook API is a modular Express.js 5 backend delivering physical library management services. It integrates with BetterAuth JWTs, enforces strict inventory invariants, prevents concurrency race conditions, and supports both canonical REST contracts and legacy aliases.

- **Base URL**: `http://localhost:8000` (Production: Render deployment URL)
- **Authentication**: Bearer JWT (`Authorization: Bearer <token>`)
- **Format**: JSON (`Content-Type: application/json`)
- **CORS**: Restricted to configured frontend origin (`http://localhost:3000` or production domain)

---

## 2. Standard Response Envelopes

### 2.1 Standard Success Envelope
Every successful response returns HTTP 200/201 with:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### 2.2 Standard Error Envelope
Every error response returns the appropriate HTTP status code (400, 401, 403, 404, 409, 500) with:
```json
{
  "success": false,
  "message": "An understandable error description",
  "error": {
    "code": "SPECIFIC_ERROR_CODE"
  }
}
```

---

## 3. Books API

### 3.1 `GET /books` — List Catalog Books
Public endpoint retrieving all active books in the library catalog. Automatically excludes soft-deleted books (`isDeleted: true`).

- **Authentication**: None (Public)
- **Query Parameters**:
  - `search` *(optional, string)*: Case-insensitive regex search on `title` or `author`.
  - `category` *(optional, string)*: Filter by exact category (e.g. `Fiction`, `Technology`).
  - `sort` *(optional, string)*: `copies-desc`, `rating`, `newest`, `title-asc`.
  - `page` *(optional, integer)*: 1-based page number.
  - `limit` *(optional, integer)*: Items per page (default: 12, max: 100).

#### Response (HTTP 200)
```json
{
  "success": true,
  "message": "Books catalog retrieved successfully",
  "data": [
    {
      "_id": "6732a1b2c3d4e5f678901234",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "category": "Technology",
      "rating": 4.8,
      "totalCopies": 5,
      "availableCopies": 3,
      "image": "https://images.unsplash.com/photo-1532012164546-f432f2e3edd9",
      "description": "A handbook of agile software craftsmanship.",
      "isDeleted": false,
      "ownerUserId": "usr_librarian_1",
      "createdAt": "2026-10-31T20:00:00.000Z",
      "updatedAt": "2026-10-31T20:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 3.2 `GET /books/:id` — Single Book Details
Public endpoint fetching detailed metadata for a single book.

- **Authentication**: None (Public)
- **URL Parameters**:
  - `id` *(required)*: 24-character hexadecimal ObjectId or legacy string identifier.

#### Response (HTTP 200)
```json
{
  "success": true,
  "message": "Book details retrieved successfully",
  "data": {
    "_id": "6732a1b2c3d4e5f678901234",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Technology",
    "totalCopies": 5,
    "availableCopies": 3,
    "isDeleted": false
  }
}
```

#### Error Response (HTTP 404)
```json
{
  "success": false,
  "message": "Book with identifier \"6732a1b2c3d4e5f678901234\" not found in catalog",
  "error": {
    "code": "NOT_FOUND"
  }
}
```

---

### 3.3 `POST /books` — Register New Book
Registers a new physical book title into the catalog. Securely injects contributor ownership context from the verified JWT.

- **Authentication**: Required (`Bearer <JWT>`)
- **Request Body**:
```json
{
  "title": "Domain-Driven Design",
  "author": "Eric Evans",
  "category": "Technology",
  "totalCopies": 4,
  "image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
  "rating": 4.9,
  "description": "Tackling complexity in the heart of software."
}
```

#### Invariant Rules Applied:
- `availableCopies` is automatically initialized equal to `totalCopies`.
- `ownerUserId` is extracted directly from `req.user.id` (client-supplied user IDs are rejected).
- `isDeleted` is initialized to `false`.

#### Response (HTTP 201)
```json
{
  "success": true,
  "message": "Book added successfully to library catalog",
  "data": {
    "_id": "6732a1b2c3d4e5f678909999",
    "title": "Domain-Driven Design",
    "author": "Eric Evans",
    "category": "Technology",
    "totalCopies": 4,
    "availableCopies": 4,
    "ownerUserId": "usr_alex_123",
    "addedByName": "Alex Reader",
    "addedByEmail": "alex@booknook.dev",
    "isDeleted": false
  }
}
```

---

### 3.4 `PATCH /books/:id` & `PUT /books/:id` — Update Book
Updates book metadata and manages copy inventory.

- **Authentication**: Required (`Bearer <JWT>`)
- **Authorization**: Must be book owner (`ownerUserId == req.user.id`) or a system librarian.
- **Legacy Compatibility**: `PUT /books/:id` is an alias mapped to this canonical handler.
- **Request Body** *(partial fields allowed)*:
```json
{
  "title": "Domain-Driven Design (2nd Edition)",
  "totalCopies": 6,
  "description": "Updated reference manual."
}
```

#### Business Invariant Guard:
- `totalCopies` cannot be reduced below the number of currently borrowed active copies. If 3 copies are currently on loan and the contributor submits `totalCopies: 2`, the API rejects the request with HTTP 400 `INVALID_INVENTORY_BOUNDARY`.

#### Response (HTTP 200)
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "bookId": "6732a1b2c3d4e5f678909999",
    "updated": true
  }
}
```

---

### 3.5 `DELETE /books/:id` — Soft-Delete Book
Archives a book title from the catalog.

- **Authentication**: Required (`Bearer <JWT>`)
- **Authorization**: Must be book owner or librarian.
- **Active Loan Guard**: Prohibits deletion if any physical copies are currently borrowed (`countDocuments({ bookId, status: "Active" }) > 0`). Returns HTTP 400 `CANNOT_DELETE_ACTIVE_LOANS`.
- **Soft Deletion**: Sets `isDeleted: true`, preserving historical loan relational integrity.

#### Response (HTTP 200)
```json
{
  "success": true,
  "message": "Book successfully deleted from library",
  "data": {
    "bookId": "6732a1b2c3d4e5f678909999",
    "isDeleted": true
  }
}
```

---

## 4. Borrows API

### 4.1 `POST /borrows` — Create Borrow Loan (Single & Batch)
Executes transaction-safe borrowing of physical book copies.

- **Authentication**: Required (`Bearer <JWT>`)
- **Duration**: Exactly 14 calendar days from `borrowDate`.
- **Single-Book Payload**:
```json
{
  "bookId": "6732a1b2c3d4e5f678901234",
  "quantity": 1
}
```
- **Multi-Book Borrow Bag Payload**:
```json
{
  "items": [
    { "bookId": "6732a1b2c3d4e5f678901234", "quantity": 1 },
    { "bookId": "6732a1b2c3d4e5f678905678", "quantity": 2 }
  ]
}
```

#### Invariant Rules Applied:
1. **Duplicate Active Loan Guard**: Rejects with HTTP 400 `DUPLICATE_ACTIVE_LOAN` if the borrower already has an active copy of the title.
2. **Conditional Atomic Decrement**: Executes `{ availableCopies: { $gte: quantity } }`. Rejects with HTTP 400 `INSUFFICIENT_COPIES` if stock runs out.
3. **All-or-Nothing Transaction**: In a multi-item Borrow Bag, if any item fails, all inventory decrements are rolled back.

#### Response (HTTP 201)
```json
{
  "success": true,
  "message": "Borrow confirmed for 2 books",
  "data": [
    {
      "_id": "6732b1b2c3d4e5f678907777",
      "bookId": "6732a1b2c3d4e5f678901234",
      "bookTitle": "Clean Code",
      "quantity": 1,
      "userId": "usr_alex_123",
      "userEmail": "alex@booknook.dev",
      "userName": "Alex Reader",
      "borrowDate": "2026-10-31T20:00:00.000Z",
      "dueDate": "2026-11-14T20:00:00.000Z",
      "status": "Active",
      "returnedAt": null
    }
  ]
}
```

---

### 4.2 `GET /borrows` — Reader's Borrow History
Retrieves borrow records scoped strictly to the authenticated reader.

- **Authentication**: Required (`Bearer <JWT>`)
- **Security Invariant**: Readers can never view another user's loan records.
- **Query Parameters**:
  - `status` *(optional)*: `Active`, `Returned`, or `all`.

#### Response (HTTP 200)
```json
{
  "success": true,
  "message": "Borrow records retrieved successfully",
  "data": [
    {
      "_id": "6732b1b2c3d4e5f678907777",
      "bookTitle": "Clean Code",
      "quantity": 1,
      "borrowDate": "2026-10-31T20:00:00.000Z",
      "dueDate": "2026-11-14T20:00:00.000Z",
      "status": "Active"
    }
  ]
}
```

---

### 4.3 `DELETE /borrows/:id` & `PUT /borrows/:id/return` — Return Book Loan
Marks a borrowed physical book as returned and restores exact stock to inventory.

- **Authentication**: Required (`Bearer <JWT>`)
- **Authorization**: Caller must be the borrower or a librarian.
- **Legacy Compatibility**: `PUT /borrows/:id/return` is mapped to this canonical return handler.
- **Double-Return Guard**: Conditional atomic state transition `{ status: { $ne: "Returned" } }`. Rejects second attempts with HTTP 400 `ALREADY_RETURNED`.

#### Response (HTTP 200)
```json
{
  "success": true,
  "message": "Book returned successfully. Inventory updated.",
  "data": {
    "borrowId": "6732b1b2c3d4e5f678907777",
    "returnedAt": "2026-11-01T06:00:00.000Z",
    "quantityRestored": 1
  }
}
```

---

## 5. Error Code Reference

| HTTP Code | Error Code | Description |
| :--- | :--- | :--- |
| **400** | `VALIDATION_ERROR` | Request body missing required fields or invalid numeric types |
| **400** | `INVALID_ID` | Malformed or non-existent ObjectId format |
| **400** | `INVALID_INPUT` | Malicious NoSQL operator (`$where`, `$gt`, etc.) detected |
| **400** | `INSUFFICIENT_COPIES` | Requested quantity exceeds available physical copies |
| **400** | `DUPLICATE_ACTIVE_LOAN` | User already holds an active loan of this book title |
| **400** | `DUPLICATE_BATCH_ITEM` | Duplicate bookId included in single Borrow Bag checkout |
| **400** | `ALREADY_RETURNED` | Loan record is already in "Returned" status |
| **400** | `CANNOT_DELETE_ACTIVE_LOANS` | Book has circulating active loans and cannot be deleted |
| **400** | `INVALID_INVENTORY_BOUNDARY` | Cannot reduce total copies below active borrowed quantity |
| **401** | `UNAUTHORIZED` | Missing, malformed, or expired Bearer JWT |
| **403** | `FORBIDDEN` | Caller attempted to edit/delete/return a resource owned by another user |
| **404** | `NOT_FOUND` | Resource identifier does not exist or has been soft-deleted |
| **409** | `DUPLICATE_KEY` | Unique database index constraint violation |
| **500** | `INTERNAL_ERROR` | Unexpected server-side fault (safe message presented in production) |

