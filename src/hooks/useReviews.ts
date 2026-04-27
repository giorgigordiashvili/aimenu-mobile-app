import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  reviewsApi,
  type CreateReviewPayload,
  type ReportReason,
  type UpdateReviewPayload,
} from "../services/reviews";
import { useAuth } from "../context/AuthContext";

export const reviewsKeys = {
  mine: ["reviews", "mine"] as const,
  pending: ["reviews", "pending"] as const,
  restaurant: (slug: string) => ["reviews", "restaurant", slug] as const,
};

export function useMyReviews() {
  const { token } = useAuth();
  return useQuery({
    queryKey: reviewsKeys.mine,
    queryFn: () => reviewsApi.listMyReviews(1),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function usePendingReviews() {
  const { token } = useAuth();
  return useQuery({
    queryKey: reviewsKeys.pending,
    queryFn: reviewsApi.listEligibleOrders,
    enabled: !!token,
    staleTime: 30_000,
  });
}

const invalidateAll = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: reviewsKeys.mine });
  qc.invalidateQueries({ queryKey: reviewsKeys.pending });
};

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewsApi.createReview(payload),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewPayload }) =>
      reviewsApi.updateReview(id, payload),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.deleteReview(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useRestaurantReviews(slug: string | undefined) {
  return useQuery({
    queryKey: reviewsKeys.restaurant(slug ?? ""),
    queryFn: () => reviewsApi.listRestaurantReviews(slug as string),
    enabled: !!slug,
    staleTime: 60_000,
  });
}

export function useReportReview() {
  return useMutation({
    mutationFn: (input: {
      id: string;
      reason: ReportReason;
      notes?: string;
    }) =>
      reviewsApi.reportReview(input.id, {
        reason: input.reason,
        notes: input.notes,
      }),
  });
}
