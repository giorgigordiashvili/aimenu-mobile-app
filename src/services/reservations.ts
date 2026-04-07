const API_BASE_URL = "https://admin.aimenu.ge";

const buildAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// 🔹 Availability
export const getAvailability = async (
  token: string,
  restaurantSlug: string,
  date: string,
  guests: number,
) => {
  const url = `${API_BASE_URL}/api/v1/reservations/availability/?restaurant_slug=${encodeURIComponent(
    restaurantSlug,
  )}&date=${date}&guests=${guests}`;

  const response = await fetch(url, {
    method: "GET",
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Availability request failed: ${response.status}`);
  }

  return response.json();
};

// 🔹 Settings (FIXED)
export const getReservationSettings = async (
  token: string,
  restaurantSlug: string,
) => {
  const url = `${API_BASE_URL}/api/v1/reservations/settings/?restaurant_slug=${encodeURIComponent(
    restaurantSlug,
  )}`;

  const response = await fetch(url, {
    method: "GET",
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Settings request failed: ${response.status}`);
  }

  return response.json();
};

export interface CreateReservationPayload {
  restaurant_slug: string;
  reservation_date: string; // "YYYY-MM-DD"
  reservation_time: string; // "HH:MM:SS"
  party_size: number;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  special_requests?: string;
}

// 🔹 Create
export const createReservation = async (
  token: string,
  data: CreateReservationPayload,
) => {
  const { restaurant_slug, ...body } = data;

  const response = await fetch(`${API_BASE_URL}/api/v1/reservations/create/`, {
    method: "POST",
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} - ${text}`);
  }

  return response.json();
};
