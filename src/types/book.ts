// OK
export interface Book {
  _id: string;
  title: string;
  author: string;
  image: string;
  category: string;
  rating: number;
  description: string;
  totalCopies: number;
  availableCopies: number;
  status: string;
  copies?: number;
  available?: boolean;
  pages?: number;
  publishedYear?: number | string;
  ownerUserId?: string;
  addedByName?: string;
  addedByEmail?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface BorrowRecord {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookImage: string;
  quantity: number;
  userId?: string;
  userName?: string;
  userEmail?: string;
  borrowerName?: string;
  borrowerEmail?: string;
  ownerUserId?: string;
  ownerName?: string;
  ownerEmail?: string;
  status:
    | "Pending"
    | "Active"
    | "Return Pending"
    | "Returned"
    | "Rejected"
    | "Cancelled"
    | "Overdue";
  requestedAt?: string;
  borrowedAt?: string | null;
  dueDate?: string | null;
  returnRequestedAt?: string | null;
  returnedAt?: string | null;
  rejectionReason?: string | null;
}

export { normalizeBook } from "@/lib/book-utils";
