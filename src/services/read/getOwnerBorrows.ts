// Perfect

import { API_BASE_URL, getAuthHeaders } from "@/services/helper";
import type { BorrowRecord } from "@/types/book";

export async function getOwnerBorrows(): Promise<BorrowRecord[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/borrows?role=owner`, {
      cache: "no-store",
      headers,
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch owner borrows:", error);
    return [];
  }
}
