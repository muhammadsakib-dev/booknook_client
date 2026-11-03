// Completed

import { API_BASE_URL } from "@/services/helper";
import type { Book } from "@/types/book";

export async function getBookById(id: string): Promise<Book | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`);
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to fetch book:", error);
    return null;
  }
}
