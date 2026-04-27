import { API_BASE_URL, api, authFetch } from "./http";
import type { Reservation } from "../types/reservation";

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
  const res = await authFetch(`${API_BASE_URL}/api/v1/reservations/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Restaurant": restaurantSlug,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} - ${text}`);
  }

  return res.json();
};

// ==============================
// 🏗️ RESERVATION API SHAPE
// ==============================

export const reservationApi = {
  getSettings: (restaurantSlug: string) =>
    api.get("/reservations/settings/", {
      params: { restaurant: restaurantSlug },
    }),

  getAvailability: (params: {
    restaurant_slug: string;
    date: string;
    guests: number;
  }) =>
    api.get("/reservations/availability/", {
      params: {
        restaurant: params.restaurant_slug,
        date: params.date,
        party_size: params.guests,
      },
    }),

  createReservation: (payload: {
    restaurant_slug: string;
    date: string;
    time: string;
    guests: number;
    note?: string;
  }) =>
    api.post("/reservations/create/", {
      restaurant_slug: payload.restaurant_slug,
      reservation_date: payload.date,
      reservation_time: payload.time,
      party_size: payload.guests,
      special_requests: payload.note,
    }),

  listMyReservations: async (
    page: number = 1,
    pageSize: number = 50,
  ): Promise<Reservation[]> => {
    const data = await api.get("/reservations/my/", {
      params: { page, page_size: pageSize, ordering: "-reservation_date" },
    });
    if (Array.isArray(data)) return data as Reservation[];
    return (data?.results ?? []) as Reservation[];
  },

  cancelReservation: (id: string): Promise<Reservation> =>
    api.post(`/reservations/my/${encodeURIComponent(id)}/cancel/`),
};
