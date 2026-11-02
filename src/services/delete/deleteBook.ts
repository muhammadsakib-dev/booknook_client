import { API_BASE_URL, getAuthHeaders } from "@/services/helper";

export async function deleteBook(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: "DELETE",
      headers,
    });
    const json = await res.json();
    return {
      success: res.ok,
      message: json.message || "Book deleted successfully!",
    };
  } catch (error) {
    console.error("Failed to delete book:", error);
    return { success: false, message: "Failed to delete book" };
  }
}
