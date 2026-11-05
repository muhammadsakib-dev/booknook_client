// Completed

import {
  API_BASE_URL,
  getAuthHeaders,
  notifyInventoryUpdated,
} from "@/services/helper";
import type { Book } from "@/types/book";

export async function createBook(bookData: Partial<Book>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/books`, {
      method: "POST",
      headers,
      body: JSON.stringify(bookData),
    });
    const json = await res.json();
    if (res.ok) {
      notifyInventoryUpdated();
    }
    return {
      success: res.ok,
      book: json.data,
      message: json.message || "Book created successfully!",
    };
  } catch (error) {
    console.error("Failed to create book:", error);
    return { success: false, message: "Failed to create book" };
  }
}
