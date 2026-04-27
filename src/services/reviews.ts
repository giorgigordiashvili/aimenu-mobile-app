import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, api } from "./http";
import type { EligibleOrder, Review, ReviewMedia } from "../types/review";

export type ReportReason =
  | "spam"
  | "offensive"
  | "not_a_customer"
  | "off_topic"
  | "other";

export interface CreateReviewPayload {
  order: string;
  rating: number;
  title?: string;
  body?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  body?: string;
}

export const reviewsApi = {
  listMyReviews: async (page: number = 1): Promise<Review[]> => {
    const data = await api.get("/reviews/mine/", { params: { page } });
    if (Array.isArray(data)) return data as Review[];
    return (data?.results ?? []) as Review[];
  },

  listEligibleOrders: async (): Promise<EligibleOrder[]> => {
    const data = await api.get("/reviews/eligible-orders/");
    if (Array.isArray(data)) return data as EligibleOrder[];
    return (data?.results ?? []) as EligibleOrder[];
  },

  createReview: (payload: CreateReviewPayload): Promise<Review> =>
    api.post("/reviews/", payload),

  updateReview: (id: string, payload: UpdateReviewPayload): Promise<Review> =>
    api.patch(`/reviews/${encodeURIComponent(id)}/`, payload),

  deleteReview: (id: string): Promise<void> =>
    api.delete(`/reviews/${encodeURIComponent(id)}/`),

  listRestaurantReviews: async (
    slug: string,
    page: number = 1,
  ): Promise<Review[]> => {
    const data = await api.get(
      `/reviews/restaurant/${encodeURIComponent(slug)}/`,
      { params: { page } },
    );
    if (Array.isArray(data)) return data as Review[];
    return (data?.results ?? []) as Review[];
  },

  reportReview: (
    id: string,
    payload: { reason: ReportReason; notes?: string },
  ): Promise<void> =>
    api.post(`/reviews/${encodeURIComponent(id)}/report/`, payload),

  uploadImage: async (
    reviewId: string,
    asset: { uri: string; mime?: string; fileName?: string },
  ): Promise<ReviewMedia> => {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) throw new Error("SESSION_EXPIRED");

    const form = new FormData();
    form.append("kind", "image");
    form.append("file", {
      // React Native's FormData accepts this shape for file uploads.
      uri: asset.uri,
      name: asset.fileName ?? `review-${Date.now()}.jpg`,
      type: asset.mime ?? "image/jpeg",
    } as any);

    const res = await fetch(
      `${API_BASE_URL}/api/v1/reviews/${encodeURIComponent(reviewId)}/media/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      },
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} - ${text}`);
    }
    return res.json();
  },

  deleteMedia: (reviewId: string, mediaId: string): Promise<void> =>
    api.delete(
      `/reviews/${encodeURIComponent(reviewId)}/media/${encodeURIComponent(mediaId)}/`,
    ),
};
