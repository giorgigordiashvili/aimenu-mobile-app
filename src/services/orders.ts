import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://admin.aimenu.ge";

const buildAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const refreshAccessToken = async (): Promise<string> => {
  const refresh = await AsyncStorage.getItem("auth_refresh_token");
  if (!refresh) throw new Error("Session expired");

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) throw new Error("Session expired");

  const data = await res.json().catch(() => null);
  const newAccess: string | undefined = data?.access;
  if (!newAccess) throw new Error("Session expired");

  await AsyncStorage.setItem("auth_token", newAccess);
  return newAccess;
};

const authedGet = async (url: string, token: string) => {
  let res = await fetch(url, { method: "GET", headers: buildAuthHeaders(token) });
  if (res.status === 401) {
    const fresh = await refreshAccessToken();
    res = await fetch(url, { method: "GET", headers: buildAuthHeaders(fresh) });
  }
  return res;
};

export const getOrderHistory = async (token: string) => {
  const response = await authedGet(`${API_BASE_URL}/api/v1/orders/my/`, token);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body?.detail ?? `Order history request failed: ${response.status}`,
    );
  }

  return response.json();
};

export const getOrderDetail = async (token: string, orderNumber: string) => {
  const response = await authedGet(
    `${API_BASE_URL}/api/v1/orders/my/${encodeURIComponent(orderNumber)}/`,
    token,
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body?.detail ?? `Order detail request failed: ${response.status}`,
    );
  }

  return response.json();
};

export interface OrderItem {
  item_id: number;
  quantity: number;
  modifiers: { modifier_id: number }[];
}

export interface CreateOrderPayload {
  restaurant_slug: string;
  items: OrderItem[];
  payment_method_id: number;
  full_name: string;
  phone: string;
  email: string;
  special_request?: string;
  wallet_amount?: string;
}

export const createOrder = async (
  token: string,
  payload: CreateOrderPayload,
) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/create/`, {
    method: "POST",
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.detail ?? `Order creation failed: ${response.status}`,
    );
  }

  return response.json();
};
