import { useQuery } from "@tanstack/react-query";
import { referralApi } from "../services/referral";
import { useAuth } from "../context/AuthContext";

export const referralKeys = {
  summary: ["referrals", "me"] as const,
  referred: ["referrals", "referred"] as const,
  history: (page: number) => ["referrals", "history", page] as const,
};

export function useReferralSummary() {
  const { token } = useAuth();
  return useQuery({
    queryKey: referralKeys.summary,
    queryFn: referralApi.getSummary,
    enabled: !!token,
    staleTime: 60_000,
  });
}

export function useReferredUsers() {
  const { token } = useAuth();
  return useQuery({
    queryKey: referralKeys.referred,
    queryFn: referralApi.getReferred,
    enabled: !!token,
    staleTime: 60_000,
  });
}

export function useWalletHistory(page: number = 1) {
  const { token } = useAuth();
  return useQuery({
    queryKey: referralKeys.history(page),
    queryFn: () => referralApi.getHistory(page),
    enabled: !!token,
    staleTime: 60_000,
  });
}
