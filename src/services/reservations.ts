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

// 🔹 Available Dates
export const getAvailableDates = async (
  token: string,
  restaurant: string,
  partySize: number,
): Promise<string[]> => {
  const url = `${API_BASE_URL}/api/v1/reservations/available-dates/?restaurant=${encodeURIComponent(
    restaurant,
  )}&party_size=${partySize}`;

  const response = await authFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Available dates request failed: ${response.status}`);
  }

  const data = await response.json();
  const raw: any[] = Array.isArray(data)
    ? data
    : (data.dates ?? data.available_dates ?? data.results ?? []);

  return raw
    .map((d) =>
      typeof d === "string" ? d : (d.date ?? d.available_date ?? ""),
    )
    .filter(Boolean);
};

// 🔹 Availability
export const getAvailability = async (
  token: string,
  restaurant: string,
  date: string,
  partySize: number,
) => {
  const url = `${API_BASE_URL}/api/v1/reservations/availability/?restaurant=${encodeURIComponent(
    restaurant,
  )}&date=${date}&party_size=${partySize}`;

  const response = await authFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Availability request failed: ${response.status}`);
  }

  return response.json();
};

// 🔹 Settings
export const getReservationSettings = async (
  token: string,
  restaurant: string,
) => {
  const url = `${API_BASE_URL}/api/v1/reservations/settings/?restaurant=${encodeURIComponent(
    restaurant,
  )}`;

  const response = await authFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Settings request failed: ${response.status}`);
  }

  return response.json();
};

// 🔹 Create Reservation
export const createReservation = async (
  token: string,
  payload: any,
  restaurantSlug: string,
) => {
  const res = await authFetch(
    "https://admin.aimenu.ge/api/v1/reservations/create/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Restaurant": restaurantSlug,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }

  return res.json();
};
