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
