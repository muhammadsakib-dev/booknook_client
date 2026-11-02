import { API_BASE_URL, getAuthHeaders } from "@/services/helper";

export async function returnBorrow(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/borrows/${id}`, {
      method: "DELETE",
      headers,
    });
    const json = await res.json();
    return {
      success: res.ok,
      message: json.message || "Book returned successfully!",
    };
  } catch (error) {
    console.error("Failed to return book:", error);
    return { success: false, message: "Failed to return book" };
  }
}
