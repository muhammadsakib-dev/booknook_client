export interface Book {
  _id: string;
  title?: string;
  bookTitle?: string;
  name?: string;
  author?: string;
  authorName?: string;
  image?: string;
  coverImage?: string;
  imageUrl?: string;
  cover_image?: string;
  category?: string;
  genre?: string;
  rating?: number;
  description?: string;
  copies?: number;
  availableCopies?: number;
  quantity?: number;
  totalCopies?: number;
  status?: string;
  available?: boolean;
  pages?: number;
  publishedYear?: number | string;
  createdAt?: string;
}

export interface NormalizedBook {
  id: string;
  title: string;
  author: string;
  image: string;
  category: string;
  rating: number;
  description: string;
  totalCopies: number;
  availableCopies: number;
  isAvailable: boolean;
  status: string;
}

export function normalizeBook(book: Book): NormalizedBook {
  const total =
    typeof book.totalCopies === "number"
      ? book.totalCopies
      : typeof book.copies === "number"
        ? book.copies
        : typeof book.quantity === "number"
          ? book.quantity
          : 5;

  const available =
    typeof book.availableCopies === "number"
      ? book.availableCopies
      : book.available === false ||
          book.status === "Borrowed" ||
          book.status === "Unavailable"
        ? 0
        : total;

  const isAvailable = available > 0;

  return {
    id: book._id,
    title: book.title || book.bookTitle || book.name || "Untitled Book",
    author: book.author || book.authorName || "Unknown Author",
    image:
      book.image ||
      book.coverImage ||
      book.imageUrl ||
      book.cover_image ||
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    category: book.category || book.genre || "General",
    rating: typeof book.rating === "number" ? book.rating : 4.8,
    description:
      book.description ||
      "A wonderfully curated book from our modern library collection.",
    totalCopies: total,
    availableCopies: Math.max(0, available),
    isAvailable,
    status: isAvailable ? "Available" : "Unavailable",
  };
}

export interface BorrowRecord {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookImage: string;
  quantity: number;
  borrowerName?: string;
  borrowerEmail?: string;
  borrowedAt: string;
  dueDate: string;
  status: "Active" | "Returned" | "Overdue";
  returnedAt?: string;
}
