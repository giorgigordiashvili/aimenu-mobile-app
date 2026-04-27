export interface ReferralSummary {
  referral_code: string;
  referral_url: string;
  wallet_balance: string;
  total_earned: string;
  total_spent: string;
  referred_users_count: number;
  effective_percent: string;
}

export type WalletTransactionKind =
  | "referral_credit"
  | "order_spend"
  | "refund_credit"
  | "referral_clawback"
  | "manual_adjustment";

export interface WalletTransaction {
  id: string;
  kind: WalletTransactionKind;
  amount: string;
  balance_after: string;
  source_order: string | null;
  source_order_number: string | null;
  referred_user: string | null;
  referred_user_email: string | null;
  notes: string;
  created_at: string;
}

export interface ReferredUser {
  id: string;
  email: string;
  full_name: string;
  joined_at: string;
  total_earned: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
