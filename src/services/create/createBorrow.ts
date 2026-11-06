// Perfect

import {
  API_BASE_URL,
  getAuthHeaders,
  notifyInventoryUpdated,
} from "@/services/helper";

export async function createBorrow(
  items: Array<{ bookId: string; quantity: number }>,
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/borrows`, {
      method: "POST",
      headers,
      body: JSON.stringify({ items }),
    });
    const json = await res.json();
    if (res.ok) {
      notifyInventoryUpdated();
    }
    return {
      success: res.ok,
      message: json.message || "Borrow confirmed successfully!",
    };
  } catch (error) {
    console.error("Failed to borrow book:", error);
    return { success: false, message: "Failed to borrow book" };
  }
}
