export interface MenuItemBrief {
  id: string;
  name: string;
  price: string;
  image?: string | null;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  threshold: number;
  reward_quantity: number;
  trigger_item_detail?: MenuItemBrief;
  reward_item_detail?: MenuItemBrief;
}

export interface LoyaltyCounter {
  id: string;
  punches: number;
  can_redeem: boolean;
  last_earned_at: string | null;
  restaurant_name?: string;
  restaurant_slug?: string;
  restaurant_logo?: string | null;
  program: LoyaltyProgram;
}

export interface Redemption {
  id: string;
  code: string;
  status: string;
  expires_at: string;
}

export interface PlatformTier {
  slug: string;
  name: string;
  minimum_points: string;
  discount_percentage: string;
}

export interface PlatformStatus {
  current_tier: PlatformTier | null;
  next_tier: PlatformTier | null;
  points: string;
  points_to_next: string;
  window_started: string;
}
