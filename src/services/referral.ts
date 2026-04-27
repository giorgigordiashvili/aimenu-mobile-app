import { api } from "./http";
import type {
  Paginated,
  ReferralSummary,
  ReferredUser,
  WalletTransaction,
} from "../types/referral";

export const referralApi = {
  getSummary: (): Promise<ReferralSummary> => api.get("/referrals/me/"),

  getReferred: async (): Promise<ReferredUser[]> => {
    const data = await api.get("/referrals/referred/");
    if (Array.isArray(data)) return data as ReferredUser[];
    return (data?.results ?? []) as ReferredUser[];
  },

  getHistory: (
    page: number = 1,
  ): Promise<Paginated<WalletTransaction>> =>
    api.get("/referrals/history/", { params: { page } }),
};
