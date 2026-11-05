// Completed

import { API_BASE_URL, getAuthHeaders } from "@/services/helper";
import type { BorrowRecord } from "@/types/book";

export async function getBorrows(): Promise<BorrowRecord[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/borrows`, { headers });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch borrows:", error);
    return [];
  }
}
