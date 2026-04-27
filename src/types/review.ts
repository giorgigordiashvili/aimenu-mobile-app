export interface ReviewMedia {
  id: string;
  kind: "image" | "video";
  file_url: string;
  blurhash?: string;
  duration_s?: number | null;
  position: number;
  created_at: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  restaurant_slug: string;
  restaurant_name?: string;
  restaurant_logo?: string | null;
  order_number: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string | null;
  rating: number;
  title: string;
  body: string;
  media?: ReviewMedia[];
  is_hidden?: boolean;
  edited_at?: string | null;
  edit_locks_at?: string;
  is_editable?: boolean;
  is_mine?: boolean;
  created_at: string;
  updated_at: string;
}

export interface EligibleOrder {
  id?: string;
  order_number: string;
  restaurant_id: string;
  restaurant_slug: string;
  restaurant_name: string;
  restaurant_logo?: string | null;
  total_amount?: string | number;
  completed_at?: string;
}
