import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://admin.aimenu.ge";

// ==============================
// 🔐 TOKEN HELPERS
// ==============================

const buildAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

async function refreshAccessToken() {
  const refresh = await AsyncStorage.getItem("auth_refresh_token");

  if (!refresh) {
    throw new Error("SESSION_EXPIRED");
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    // ❗ clear broken session
    await AsyncStorage.multiRemove([
      "auth_token",
      "auth_refresh_token",
      "auth_user",
    ]);
    throw new Error("SESSION_EXPIRED");
  }

  const data = await res.json();

  await AsyncStorage.setItem("auth_token", data.access);

  return data.access as string;
}

// ==============================
// 🌐 AUTH FETCH (AUTO-REFRESH)
// ==============================

async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let token = await AsyncStorage.getItem("auth_token");

  if (!token) {
    throw new Error("SESSION_EXPIRED");
  }

  const doRequest = (t: string) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${t}`,
      },
    });

  let response = await doRequest(token);

  // 🔁 retry once if token expired
  if (response.status === 401) {
    try {
      token = await refreshAccessToken();
      response = await doRequest(token);
    } catch {
      throw new Error("SESSION_EXPIRED");
    }
  }

  return response;
}

// ==============================
// 📦 TYPES
// ==============================

export interface CreateReservationPayload {
  restaurant_slug: string;
  reservation_date: string; // YYYY-MM-DD
  reservation_time: string; // HH:MM:SS
  party_size: number;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  special_requests?: string;
}

// ==============================
// 📅 API FUNCTIONS
// ==============================

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

  const response = await authFetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Availability request failed: ${response.status}`);
  }

  return response.json();
};

// 🔹 Settings
export const getReservationSettings = async (
  token: string,
  restaurantSlug: string,
) => {
  const url = `${API_BASE_URL}/api/v1/reservations/settings/?restaurant_slug=${encodeURIComponent(
    restaurantSlug,
  )}`;

  const response = await authFetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Settings request failed: ${response.status}`);
  }

  return response.json();
};

// 🔹 Create Reservation
export const createReservation = async (
  token: string,
  data: CreateReservationPayload,
) => {
  const response = await authFetch(
    `${API_BASE_URL}/api/v1/reservations/create/`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} - ${text}`);
  }

  return response.json();
};
