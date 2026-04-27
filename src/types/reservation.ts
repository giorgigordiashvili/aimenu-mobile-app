export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Reservation {
  id: string;
  confirmation_code: string;
  reservation_date: string; // YYYY-MM-DD
  reservation_time: string; // HH:MM:SS or HH:MM
  party_size: number;
  status: ReservationStatus;
  special_requests?: string | null;

  restaurant: string;
  restaurant_name: string;
  restaurant_slug: string;
  restaurant_logo?: string | null;
  restaurant_cover_image?: string | null;
  restaurant_city?: string | null;
  restaurant_phone?: string | null;

  deposit_amount?: number | string;
  deposit_currency?: string;

  can_cancel?: boolean;
  is_upcoming?: boolean;

  cancelled_at?: string | null;
  completed_at?: string | null;
  cancellation_reason?: string | null;
}
