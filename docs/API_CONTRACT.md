# BookNook — REST API Specification & Data Contracts

**Version**: 1.0.0 (Phase 02 Architecture Contract)  
**Base URL**: `${NEXT_PUBLIC_API_URL}` (Default: `http://localhost:8000`)  
**Transport**: HTTPS / JSON  

---

## 1. Global Request & Response Standards

### 1.1. Headers
- `Content-Type: application/json`
- `Authorization: Bearer <JWT>` (Required for all protected endpoints)

### 1.2. Standard Success Response Envelope
```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable feedback"
}
```

### 1.3. Standard Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable explanation of error",
    "details": {}
  }
}
```

### 1.4. Standard Error Codes
| HTTP Status | Error Code | Description |
| :---: | :--- | :--- |
| `400` | `VALIDATION_ERROR` | Request payload fails schema validation or boundary checks. |
| `400` | `INSUFFICIENT_COPIES` | Book requested has fewer available copies than requested quantity. |
| `400` | `DUPLICATE_ACTIVE_LOAN` | Borrower already holds an unreturned copy of this title. |
| `400` | `CANNOT_DELETE_ACTIVE_LOANS` | Book cannot be deleted while active loans exist. |
| `401` | `UNAUTHORIZED` | Missing, malformed, or expired Bearer token. |
| `403` | `FORBIDDEN` | Authenticated user lacks permission for this resource. |
| `404` | `NOT_FOUND` | Requested book or borrow record does not exist. |
| `500` | `INTERNAL_SERVER_ERROR` | Unexpected server or database exception. |

---

## 2. Books API Contracts

### 2.1. `GET /books` — List Catalog Books
Returns active books matching search, category, and sorting filters. Soft-deleted books (`isDeleted: true`) are excluded.

- **Auth**: Public (No authentication required).
- **Query Parameters**:
  | Param | Type | Required | Default | Description |
  | :--- | :---: | :---: | :---: | :--- |
  | `search` | `string` | No | `""` | Search substring matching title or author. |
  | `category` | `string` | No | `"All"` | Filter by category/genre. |
  | `sort` | `string` | No | `"default"` | Options: `"default"`, `"copies-desc"`, `"available"`, `"rating"`. |
  | `limit` | `number` | No | `20` | Max items to return per page. |
  | `page` | `number` | No | `1` | Pagination page number. |

- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "_id": "67243c5b706c8b9d88001122",
        "title": "The Midnight Library",
        "author": "Matt Haig",
        "category": "Fiction",
        "image": "https://images.unsplash.com/...",
        "description": "Between life and death there is a library...",
        "totalCopies": 5,
        "availableCopies": 4,
        "rating": 4.8,
        "isAvailable": true,
        "createdAt": "2026-10-31T01:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

---

### 2.2. `GET /books/:id` — Get Single Book Details
Retrieves complete book specifications by ID.

- **Auth**: Public.
- **URL Parameters**: `id` (`ObjectId` or string ID).
- **Response `200 OK`**: Returns single book document.
- **Response `404 NOT_FOUND`**:
```json
{
  "success": false,
  "error": { "code": "NOT_FOUND", "message": "Book not found" }
}
```

---

### 2.3. `POST /books` — Register New Book
Creates a new physical book catalog entry.

- **Auth**: Protected (`role: "reader"` or `"librarian"`).
- **Request Body**:
```json
{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "category": "Technology",
  "image": "https://images.unsplash.com/...",
  "description": "A craftsman's guide to software structure and design.",
  "copies": 4,
  "rating": 4.8
}
```
- **Server Enforcement**:
  - Automatically injects `ownerUserId: req.user.id`, `addedByName: req.user.name`, `addedByEmail: req.user.email`.
  - Sets `totalCopies = Number(copies || 5)`, `availableCopies = totalCopies`, `isDeleted = false`.
- **Response `201 CREATED`**:
```json
{
  "success": true,
  "message": "Book added successfully",
  "data": {
    "book": {
      "_id": "67243c5b706c8b9d88001199",
      "title": "Clean Architecture",
      "author": "Robert C. Martin",
      "category": "Technology",
      "totalCopies": 4,
      "availableCopies": 4,
      "isAvailable": true,
      "ownerUserId": "usr_998877",
      "createdAt": "2026-10-31T21:00:00.000Z"
    }
  }
}
```

---

### 2.4. `PATCH /books/:id` (and alias `PUT /books/:id`) — Update Book
Updates catalog information or inventory volume counts.

- **Auth**: Protected (Requires book owner or `"librarian"` role).
- **Request Body**:
```json
{
  "title": "Clean Architecture (Second Edition)",
  "category": "Technology",
  "totalCopies": 6,
  "availableCopies": 5,
  "description": "Updated overview."
}
```
- **Business Rule Check**:
  - `totalCopies` must NEVER be set lower than active loaned copies:  
    $\text{newTotalCopies} \ge \text{currentTotalCopies} - \text{currentAvailableCopies}$.
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": { "bookId": "67243c5b706c8b9d88001199" }
}
```

---

### 2.5. `DELETE /books/:id` — Delete Book
Soft-deletes a book from the catalog.

- **Auth**: Protected (Requires book owner or `"librarian"` role).
- **Business Rule Check**:
  - Checks if any borrow records for this `bookId` have `status: "Active"`.
  - If active borrows exist: Returns `400 CANNOT_DELETE_ACTIVE_LOANS`.
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Book successfully deleted from catalog"
}
```

---

## 3. Borrows API Contracts

### 3.1. `POST /borrows` — Check Out Books (Borrow Bag Checkout)
Processes single-item or multi-item borrow checkouts under **all-or-nothing transactional guarantees**.

- **Auth**: Protected (`reader` or `librarian`).

#### Single-Book Request Payload:
```json
{
  "bookId": "67243c5b706c8b9d88001122",
  "quantity": 1
}
```

#### Multi-Book Request Payload:
```json
{
  "items": [
    {
      "bookId": "67243c5b706c8b9d88001122",
      "quantity": 1
    },
    {
      "bookId": "67243c5b706c8b9d88001133",
      "quantity": 1
    }
  ]
}
```

- **Validation & Business Execution**:
  1. Payload normalized to array of `{ bookId, quantity }`.
  2. For every item, verify borrower does not currently hold an `Active` borrow of that title.
  3. Atomically check and decrement `availableCopies` in `books` collection for each item.
  4. If any single item fails (out of stock or duplicate loan), **the entire checkout is rolled back**. No partial checkout is permitted.
  5. Computes `borrowDate = now()`, `returnDate = now() + 14 days`, `status = "Active"`.
- **Response `201 CREATED`**:
```json
{
  "success": true,
  "message": "Borrow successfully confirmed for 2 books",
  "data": {
    "borrows": [
      {
        "_id": "67245555706c8b9d88003344",
        "bookId": "67243c5b706c8b9d88001122",
        "bookTitle": "The Midnight Library",
        "quantity": 1,
        "borrowDate": "2026-10-31T21:05:00.000Z",
        "returnDate": "2026-11-14T21:05:00.000Z",
        "status": "Active"
      }
    ]
  }
}
```

---

### 3.2. `GET /borrows` — List User Loans
Retrieves loan records.

- **Auth**: Protected.
- **Authorization Scoping**:
  - Regular Readers: Server forces query `{ userId: req.user.id }` (users cannot view other users' borrow history).
  - Librarians: Allowed to view all borrows or filter by `userId` / `status`.
- **Query Parameters**: `status` (`"Active"`, `"Returned"`, `"Overdue"`, `"all"`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "borrows": [
      {
        "_id": "67245555706c8b9d88003344",
        "bookId": "67243c5b706c8b9d88001122",
        "bookTitle": "The Midnight Library",
        "bookAuthor": "Matt Haig",
        "bookImage": "https://images.unsplash.com/...",
        "quantity": 1,
        "borrowDate": "2026-10-31T21:05:00.000Z",
        "returnDate": "2026-11-14T21:05:00.000Z",
        "status": "Active",
        "daysRemaining": 14
      }
    ]
  }
}
```

---

### 3.3. `DELETE /borrows/:id` (and alias `PUT /borrows/:id/return`) — Return Borrowed Book
Marks a loan as returned and restores catalog inventory.

- **Auth**: Protected (Requires original borrower or `librarian`).
- **Execution**:
  1. Finds borrow record with `_id: id` and `status: "Active"`.
  2. Updates borrow record: `status = "Returned"`, `returnedAt = now()`.
  3. Atomically increments book's `availableCopies` by `borrow.quantity`.
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Book returned successfully. Inventory updated.",
  "data": {
    "borrowId": "67245555706c8b9d88003344",
    "returnedAt": "2026-11-04T10:15:00.000Z"
  }
}
```

---

*Specification authored in accordance with Phase 02 requirements.*

