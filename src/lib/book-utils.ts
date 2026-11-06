import type { Book, NormalizedBook } from "@/types/book";

/**
 * Normalizes a raw Book document for safe and consistent rendering in UI components.
 */
export function normalizeBook(
  book: Partial<Book> & { _id?: string; id?: string },
): NormalizedBook {
  const total = Number(book.totalCopies ?? book.copies ?? 1);
  const available = Number(book.availableCopies ?? total);
  const isAvailable =
    available > 0 &&
    book.status !== "Unavailable" &&
    book.status !== "Borrowed";

  return {
    id: String(book.id || book._id || ""),
    title: book.title || "Untitled Book",
    author: book.author || "Unknown Author",
    image:
      book.image ||
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    category: book.category || "General",
    rating: typeof book.rating === "number" ? book.rating : 4.8,
    description:
      book.description || "A curated book from our modern library collection.",
    totalCopies: Math.max(1, total),
    availableCopies: Math.max(0, available),
    isAvailable,
    status: isAvailable ? "Available" : "Unavailable",
  };
}
