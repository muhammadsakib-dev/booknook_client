import {
  API_BASE_URL,
  getAuthHeaders,
  notifyInventoryUpdated,
} from "@/services/helper";

/**
 * Approve a pending borrow request (book contributor only).
 */
export async function approveBorrow(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/borrows/${id}/approve`, {
      method: "PUT",
      headers,
    });
    const json = await res.json();
    if (res.ok) {
      notifyInventoryUpdated();
    }
    return {
      success: res.ok,
      message: json.message || "Borrow request approved successfully!",
    };
  } catch (error) {
    console.error("Failed to approve borrow:", error);
    return { success: false, message: "Failed to approve borrow request" };
  }
}

/**
 * Reject or cancel a pending borrow request (contributor declines or borrower cancels).
 */
export async function rejectBorrow(id: string, reason?: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/borrows/${id}/reject`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (res.ok) {
      notifyInventoryUpdated();
    }
    return {
      success: res.ok,
      message: json.message || "Borrow request resolved successfully.",
    };
  } catch (error) {
    console.error("Failed to reject borrow:", error);
    return { success: false, message: "Failed to resolve borrow request" };
  }
}

/**
 * Request to return an active borrowed book (borrower initiates).
 */
export async function requestReturn(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/borrows/${id}/request-return`, {
      method: "PUT",
      headers,
    });
    const json = await res.json();
    if (res.ok) {
      notifyInventoryUpdated();
    }
    return {
      success: res.ok,
      message:
        json.message ||
        "Return request submitted! Waiting for contributor confirmation.",
    };
  } catch (error) {
    console.error("Failed to request return:", error);
    return { success: false, message: "Failed to submit return request" };
  }
}

/**
 * Confirm receipt of a returned book (book contributor only).
 */
export async function approveReturn(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/borrows/${id}/approve-return`, {
      method: "PUT",
      headers,
    });
    const json = await res.json();
    if (res.ok) {
      notifyInventoryUpdated();
    }
    return {
      success: res.ok,
      message:
        json.message ||
        "Book return confirmed! Available copies have been restored.",
    };
  } catch (error) {
    console.error("Failed to approve return:", error);
    return { success: false, message: "Failed to confirm book return" };
  }
}
