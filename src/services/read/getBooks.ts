// Complete

import { API_BASE_URL } from "@/services/helper";
import type { Book } from "@/types/book";

export async function getBooks(): Promise<Book[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/books`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return [];
  }
}
