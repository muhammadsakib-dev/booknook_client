// Completed

import { API_BASE_URL } from "@/services/helper";
import type { Book } from "@/types/book";

export async function getMyBooks(userId: string): Promise<Book[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/books?ownerUserId=${userId}`, {
      cache: "force-cache",
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch my books:", error);
    return [];
  }
}
