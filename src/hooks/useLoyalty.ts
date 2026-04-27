import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loyaltyApi } from "../services/loyalty";
import { useAuth } from "../context/AuthContext";

export const loyaltyKeys = {
  counters: ["loyalty", "my"] as const,
  platform: ["loyalty", "platform"] as const,
};

export function useLoyaltyCounters() {
  const { token } = useAuth();
  return useQuery({
    queryKey: loyaltyKeys.counters,
    queryFn: loyaltyApi.getCounters,
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useRedeemProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (programId: string) => loyaltyApi.redeem(programId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: loyaltyKeys.counters });
    },
  });
}

export function usePlatformStatus() {
  const { token } = useAuth();
  return useQuery({
    queryKey: loyaltyKeys.platform,
    queryFn: loyaltyApi.getPlatformStatus,
    enabled: !!token,
    staleTime: 60_000,
  });
}
