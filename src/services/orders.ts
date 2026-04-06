const API_BASE_URL = "https://admin.aimenu.ge";

const buildAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Token ${token}`,
});

export const getOrderHistory = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/orders/`, {
    method: "GET",
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Order history request failed: ${response.status}`);
  }

  return response.json();
};

export const getOrderDetail = async (token: string, orderNumber: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/orders/${encodeURIComponent(orderNumber)}/`,
    {
      method: "GET",
      headers: buildAuthHeaders(token),
    },
  );

  if (!response.ok) {
    throw new Error(`Order detail request failed: ${response.status}`);
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
