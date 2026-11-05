// Completed

import {
  API_BASE_URL,
  getAuthHeaders,
  notifyInventoryUpdated,
} from "@/services/helper";
import type { Book } from "@/types/book";

export async function updateBook(id: string, bookData: Partial<Book>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(bookData),
    });
    const json = await res.json();
    if (res.ok) {
      notifyInventoryUpdated();
    }
    return {
      success: res.ok,
      message: json.message || "Book updated successfully!",
    };
  } catch (error) {
    console.error("Failed to update book:", error);
    return { success: false, message: "Failed to update book" };
  }
}
