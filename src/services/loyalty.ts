import { api } from "./http";
import type {
  LoyaltyCounter,
  PlatformStatus,
  Redemption,
} from "../types/loyalty";

export const loyaltyApi = {
  getCounters: async (): Promise<LoyaltyCounter[]> => {
    const data = await api.get("/loyalty/my/");
    return (data?.results ?? data ?? []) as LoyaltyCounter[];
  },

  redeem: (programId: string): Promise<Redemption> =>
    api.post("/loyalty/my/redeem/", { program_id: programId }),

  getPlatformStatus: async (): Promise<PlatformStatus | null> => {
    try {
      return (await api.get("/loyalty/platform/status/")) as PlatformStatus;
    } catch (e: any) {
      // Platform-tier is optional; backend returns 401 when feature is off
      // for the tenant/user, or 404 when the endpoint isn't enabled.
      const msg = String(e?.message ?? "");
      if (msg.startsWith("401") || msg.startsWith("404") || msg === "401" || msg === "404") {
        return null;
      }
      throw e;
    }
  },
};
