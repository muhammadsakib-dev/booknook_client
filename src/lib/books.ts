import { getAuthToken } from "@/lib/auth-client";
import type { Book, BorrowRecord } from "@/types/book";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const LOCAL_BORROWS_KEY = "booknook-borrowed-records";

/**
 * Event emitter to synchronize live inventory changes across pages
 */
export function notifyInventoryUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("booknook:inventory-updated"));
  }
}

// Helper to construct authenticated headers
async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = await getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// Fallback books in case the backend server isn't running or has empty database
export const FALLBACK_BOOKS: Book[] = [
  {
    _id: "book-1",
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    rating: 4.8,
    copies: 5,
    availableCopies: 4,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    description:
      "Between life and death there is a library with infinite books representing different lives you could have lived.",
  },
  {
    _id: "book-2",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    rating: 4.9,
    copies: 6,
    availableCopies: 2,
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    description:
      "An easy & proven way to build good habits and break bad ones with tiny changes that deliver remarkable results.",
  },
  {
    _id: "book-3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Sci-Fi",
    rating: 4.9,
    copies: 3,
    availableCopies: 1,
    image:
      "https://images.unsplash.com/photo-1618609377864-68609b857e90?auto=format&fit=crop&q=80&w=800",
    description:
      "A lone astronaut must save the earth from disaster in this interstellar adventure full of science and humor.",
  },
  {
    _id: "book-4",
    title: "Silent Patient",
    author: "Alex Michaelides",
    category: "Mystery",
    rating: 4.6,
    copies: 4,
    availableCopies: 0,
    status: "Unavailable",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    description:
      "A shocking psychological thriller of a woman’s act of violence against her husband and the therapist obsessed with uncovering her motive.",
  },
  {
    _id: "book-5",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    rating: 4.7,
    copies: 4,
    availableCopies: 3,
    image:
      "https://images.unsplash.com/photo-1532012164546-f432f2e3edd9?auto=format&fit=crop&q=80&w=800",
    description:
      "A handbook of agile software craftsmanship for developers who strive to write elegant, maintainable code.",
  },
  {
    _id: "book-6",
    title: "Dune: Chronicles",
    author: "Frank Herbert",
    category: "Sci-Fi",
    rating: 4.9,
    copies: 5,
    availableCopies: 5,
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800",
    description:
      "The definitive epic masterpiece set on the desert planet Arrakis, following Paul Atreides and the spice melange.",
  },
  {
    _id: "book-7",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    rating: 4.8,
    copies: 4,
    availableCopies: 2,
    image:
      "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800",
    description:
      "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know.",
  },
  {
    _id: "book-8",
    title: "1984: Graphic Edition",
    author: "George Orwell",
    category: "Classic",
    rating: 4.9,
    copies: 3,
    availableCopies: 3,
    image:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
    description:
      "The chilling dystopian masterpiece exploring surveillance, totalitarianism, and truth in the modern state.",
  },
  {
    _id: "book-9",
    title: "Educated: A Memoir",
    author: "Tara Westover",
    category: "Biography",
    rating: 4.7,
    copies: 4,
    availableCopies: 1,
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    description:
      "An unforgettable memoir about a young girl who leaves her survivalist family in rural Idaho and earns a PhD.",
  },
];

export interface FetchBooksParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  ownerUserId?: string;
}

/**
 * Fetch books from the public backend catalog
 * Never attaches Bearer tokens unnecessarily.
 */
export async function fetchBooks(params?: FetchBooksParams): Promise<Book[]> {
  try {
    const url = new URL(`${API_BASE_URL}/books`);

    if (params) {
      if (params.search) url.searchParams.set("search", params.search);
      if (params.category && params.category !== "All")
        url.searchParams.set("category", params.category);
      if (params.sort && params.sort !== "default")
        url.searchParams.set("sort", params.sort);
      if (params.page) url.searchParams.set("page", String(params.page));
      if (params.limit) url.searchParams.set("limit", String(params.limit));
      if (params.ownerUserId)
        url.searchParams.set("ownerUserId", params.ownerUserId);
    }

    const res = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }

    const data = await res.json();
    const booksList = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.books)
          ? data.books
          : [];

    if (booksList.length > 0) {
      return booksList;
    }

    // Only fallback if no search/filter criteria was specified
    if (!params?.search && (!params?.category || params.category === "All")) {
      return FALLBACK_BOOKS;
    }

    return [];
  } catch (error) {
    console.warn(
      `Could not reach API at ${API_BASE_URL}/books, using fallback data:`,
      error,
    );
    return FALLBACK_BOOKS;
  }
}

/**
 * Fetch single book details by ID
 */
export async function fetchBookById(id: string): Promise<Book | null> {
  if (!id) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const book = data?.data || data?.book || data;
      if (book && (book._id || book.title)) {
        return book;
      }
    }

    if (res.status === 404) {
      return null;
    }
  } catch (error) {
    console.warn(
      `Could not reach API at ${API_BASE_URL}/books/${id}, checking fallback:`,
      error,
    );
  }

  // Fallback search only if offline
  const fallback = FALLBACK_BOOKS.find((b) => b._id === id);
  if (fallback) return fallback;

  return null;
}

/**
 * Register a new book (Authenticated)
 */
export async function createBook(
  bookData: Partial<Book>,
): Promise<{ success: boolean; book?: Book; message?: string }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/books`, {
      method: "POST",
      headers,
      body: JSON.stringify(bookData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        data.message ||
        data.error?.message ||
        `Failed to add book (${res.status})`;
      throw new Error(errorMsg);
    }

    notifyInventoryUpdated();

    return {
      success: true,
      book: data?.data || data?.book || data,
      message: data.message || "Book successfully added to library!",
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to connect to backend server";
    return {
      success: false,
      message,
    };
  }
}

/**
 * Update an existing book (Authenticated & Ownership Verified)
 */
export async function updateBook(
  id: string,
  bookData: Partial<Book>,
): Promise<{ success: boolean; message?: string }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(bookData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        data.message ||
        data.error?.message ||
        `Failed to update book (${res.status})`;
      throw new Error(errorMsg);
    }

    notifyInventoryUpdated();

    return {
      success: true,
      message: data.message || "Book updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error updating book",
    };
  }
}

/**
 * Delete a book from the catalog (Authenticated & Ownership Verified)
 */
export async function deleteBook(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        data.message ||
        data.error?.message ||
        `Failed to delete book (${res.status})`;
      throw new Error(errorMsg);
    }

    notifyInventoryUpdated();

    return {
      success: true,
      message: data.message || "Book deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error deleting book",
    };
  }
}

/**
 * Fetch Reader's own borrows (Authenticated)
 */
export async function fetchBorrows(status?: string): Promise<BorrowRecord[]> {
  try {
    const headers = await getAuthHeaders();
    const url = new URL(`${API_BASE_URL}/borrows`);
    if (status && status !== "all") {
      url.searchParams.set("status", status);
    }

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers,
    });

    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.borrows)
            ? data.borrows
            : [];
      return list;
    }
  } catch (error) {
    console.warn("Failed to fetch borrows from backend:", error);
  }

  // Fallback to localStorage for offline cache
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_BORROWS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
  }

  return [];
}

export interface CheckoutResult {
  success: boolean;
  borrows?: BorrowRecord[];
  message: string;
  errorCode?: string;
}

/**
 * Execute multi-book Borrow Bag checkout against POST /borrows
 */
export async function checkoutBorrowBag(
  items: Array<{ bookId: string; quantity: number }>,
): Promise<CheckoutResult> {
  if (!items || items.length === 0) {
    return {
      success: false,
      message: "No items selected in Borrow Bag.",
      errorCode: "EMPTY_BAG",
    };
  }

  try {
    const headers = await getAuthHeaders();

    // Check if token was present
    const hasAuth =
      typeof headers === "object" &&
      "Authorization" in headers &&
      Boolean(headers.Authorization);

    if (!hasAuth) {
      return {
        success: false,
        message: "You must be signed in to borrow books from BookNook.",
        errorCode: "UNAUTHORIZED",
      };
    }

    const res = await fetch(`${API_BASE_URL}/borrows`, {
      method: "POST",
      headers,
      body: JSON.stringify({ items }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorCode = data.error?.code || "BORROW_ERROR";
      const message =
        data.message ||
        data.error?.message ||
        `Borrow failed with status ${res.status}`;
      return {
        success: false,
        message,
        errorCode,
      };
    }

    const createdBorrows: BorrowRecord[] = Array.isArray(data.data)
      ? data.data
      : Array.isArray(data.borrows)
        ? data.borrows
        : [data.borrow || data.data];

    // Trigger revalidation across open pages
    notifyInventoryUpdated();

    return {
      success: true,
      borrows: createdBorrows,
      message: data.message || "Borrow confirmed successfully!",
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to connect to library borrowing service";
    return {
      success: false,
      message,
      errorCode: "NETWORK_ERROR",
    };
  }
}

/**
 * Return a borrowed book (Authenticated)
 */
export async function returnBorrowedBook(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/borrows/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        data.message ||
        data.error?.message ||
        `Failed to return book (${res.status})`;
      throw new Error(errorMsg);
    }

    notifyInventoryUpdated();

    return {
      success: true,
      message: data.message || "Book returned successfully! Inventory updated.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error returning book",
    };
  }
}
