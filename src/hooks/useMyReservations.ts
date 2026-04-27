import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservationApi } from "../services/reservations";
import { useAuth } from "../context/AuthContext";

export const reservationsKeys = {
  my: ["reservations", "my"] as const,
};

export function useMyReservations() {
  const { token } = useAuth();
  return useQuery({
    queryKey: reservationsKeys.my,
    queryFn: () => reservationApi.listMyReservations(),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationApi.cancelReservation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reservationsKeys.my });
    },
  });
}
