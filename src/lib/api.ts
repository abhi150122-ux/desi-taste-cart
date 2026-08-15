const API_BASE_URL = "https://admin.jaindesipure.co.in/api/v1";

const readToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("jdp-auth-token") ?? "";
};

const writeToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("jdp-auth-token", token);
  else localStorage.removeItem("jdp-auth-token");
};

const getJson = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = readToken();
  const headers = new Headers(init.headers ?? {});

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = await getJson(response);

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : undefined) ||
      (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : undefined) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }

  return (payload as T) ?? ({} as T);
}

export const setAuthToken = writeToken;

export const apiRegisterCustomer = (payload: Record<string, unknown>) =>
  apiRequest<{ token?: string; user?: Record<string, any> }>("/customer/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiVerifyRegistrationOtp = (payload: Record<string, unknown>) =>
  apiRequest<{ token?: string; user?: Record<string, any> }>("/customer/verify-registration-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiLoginCustomer = (payload: Record<string, unknown>) =>
  apiRequest<{ token?: string; user?: Record<string, any> }>("/customer/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiSendPasswordResetOtp = (payload: Record<string, unknown>) =>
  apiRequest<{ message?: string }>("/customer/forgot-password/send-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiVerifyPasswordResetOtp = (payload: Record<string, unknown>) =>
  apiRequest<{ message?: string }>("/customer/forgot-password/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiResetPassword = (payload: Record<string, unknown>) =>
  apiRequest<{ message?: string }>("/customer/forgot-password/reset", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiCustomerProfile = (customerId: string) => apiRequest(`/customers/${customerId}`);

export const apiGetCustomerAddresses = (customerId: string) => apiRequest(`/customers/${customerId}/addresses`);

export const apiGetCustomerNotifications = (customerId: string) => apiRequest(`/customers/${customerId}/notifications`);

export const apiGetNotifications = (recipientType: string, recipientId: number | string) =>
  apiRequest(`/notifications?recipient_type=${encodeURIComponent(recipientType)}&recipient_id=${encodeURIComponent(String(recipientId))}`);

export const apiGetUnreadNotificationsCount = (recipientType: string, recipientId: number | string) =>
  apiRequest(`/notifications/unread-count?recipient_type=${encodeURIComponent(recipientType)}&recipient_id=${encodeURIComponent(String(recipientId))}`);

export const apiMarkNotificationRead = (notificationId: number | string) =>
  apiRequest(`/notifications/${notificationId}/read`, { method: "PATCH" });

export const apiRegisterPushToken = (payload: Record<string, unknown>) =>
  apiRequest(`/push-tokens`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiGetCustomerCart = (customerId: string) => apiRequest(`/customers/${customerId}/cart`);

export const apiAddCartItem = (customerId: string, payload: Record<string, unknown>) =>
  apiRequest(`/customers/${customerId}/cart/items`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiUpdateCartItem = (customerId: string, itemId: string | number, payload: Record<string, unknown>) =>
  apiRequest(`/customers/${customerId}/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const apiDeleteCartItem = (customerId: string, itemId: string | number) =>
  apiRequest(`/customers/${customerId}/cart/items/${itemId}`, { method: "DELETE" });

export const apiClearCart = (customerId: string) => apiRequest(`/customers/${customerId}/cart`, { method: "DELETE" });

export const apiCreateCustomerAddress = (customerId: string, payload: Record<string, unknown>) =>
  apiRequest(`/customers/${customerId}/addresses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiGetCustomerOrders = (customerId: string) => apiRequest(`/customers/${customerId}/orders`);

export const apiCreateOrder = (payload: Record<string, unknown>) =>
  apiRequest(`/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiCreateRazorpayOrder = (payload: Record<string, unknown>) =>
  apiRequest(`/payment/razorpay`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiVerifyPayment = (payload: Record<string, unknown>) =>
  apiRequest(`/payment/verify`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiDeliveryFee = (payload?: Record<string, unknown>) => {
  const params = new URLSearchParams();
  if (payload) {
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
  }

  const query = params.toString();
  return apiRequest(`/delivery/fee${query ? `?${query}` : ""}`);
};
