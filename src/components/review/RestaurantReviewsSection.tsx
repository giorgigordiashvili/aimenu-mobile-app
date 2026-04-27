import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useRestaurantReviews } from "../../hooks/useReviews";
import { ReviewCard } from "./ReviewCard";
import { ReportReviewSheet } from "./ReportReviewSheet";
import { borderRadius, colors, spacing, typography } from "../../theme";
import type { Review } from "../../types/review";

interface Props {
  slug?: string;
  language: string;
  /** How many reviews to show inline before "see more" copy. */
  limit?: number;
}

export function RestaurantReviewsSection({
  slug,
  language,
  limit = 5,
}: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = useRestaurantReviews(slug);
  const [reportTarget, setReportTarget] = useState<Review | null>(null);

  if (!slug) return null;

  const reviews = (data ?? []).slice(0, limit);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t("reviews.restaurantSectionTitle")}</Text>

      {isLoading && !data ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : reviews.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.empty}>
            {t("reviews.restaurantSectionEmpty")}
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {reviews.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              language={language}
              onReport={
                r.is_mine
                  ? undefined
                  : () => setReportTarget(r)
              }
            />
          ))}
        </View>
      )}

      <ReportReviewSheet
        review={reportTarget}
        visible={!!reportTarget}
        onClose={() => setReportTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  heading: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
  },
  list: {
    gap: spacing.sm,
  },
  loading: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
  },
  empty: {
    ...typography.textSm,
    color: colors.gray500,
    textAlign: "center",
  },
});
