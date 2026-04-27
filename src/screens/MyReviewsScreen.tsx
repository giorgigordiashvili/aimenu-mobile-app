import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../theme";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import {
  useDeleteReview,
  useMyReviews,
  usePendingReviews,
} from "../hooks/useReviews";
import { ReviewCard } from "../components/review/ReviewCard";
import { PendingOrderCard } from "../components/review/PendingOrderCard";
import { WriteReviewSheet } from "../components/review/WriteReviewSheet";
import type { EligibleOrder, Review } from "../types/review";

export default function MyReviewsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const myReviewsQuery = useMyReviews();
  const pendingQuery = usePendingReviews();
  const deleteMutation = useDeleteReview();

  const [pendingForWrite, setPendingForWrite] = useState<EligibleOrder | null>(
    null,
  );
  const [reviewForEdit, setReviewForEdit] = useState<Review | null>(null);

  const refreshAll = () => {
    myReviewsQuery.refetch();
    pendingQuery.refetch();
  };

  const onDelete = (review: Review) => {
    Alert.alert(
      t("reviews.deleteConfirmTitle"),
      t("reviews.deleteConfirmText"),
      [
        { text: t("reviews.cancel"), style: "cancel" },
        {
          text: t("reviews.delete"),
          style: "destructive",
          onPress: () => deleteMutation.mutate(review.id),
        },
      ],
    );
  };

  const isLoading = myReviewsQuery.isLoading && pendingQuery.isLoading;
  const isRefetching =
    myReviewsQuery.isRefetching || pendingQuery.isRefetching;

  const reviews = myReviewsQuery.data ?? [];
  const pending = pendingQuery.data ?? [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.title}>{t("reviews.myReviewsTitle")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refreshAll}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {pending.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {t("reviews.pendingTitle")}
                </Text>
                <Text style={styles.sectionLead}>
                  {t("reviews.pendingSubtitle")}
                </Text>
                {pending.map((order) => (
                  <PendingOrderCard
                    key={order.order_number}
                    order={order}
                    onWrite={() => setPendingForWrite(order)}
                  />
                ))}
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t("reviews.myReviewsTitle")}
              </Text>
              {reviews.length === 0 ? (
                <Text style={styles.empty}>
                  {t("reviews.myReviewsEmpty")}
                </Text>
              ) : (
                reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    language={i18n.language}
                    onEdit={() => setReviewForEdit(review)}
                    onDelete={() => onDelete(review)}
                  />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      <WriteReviewSheet
        visible={!!pendingForWrite}
        order={pendingForWrite}
        onClose={() => setPendingForWrite(null)}
      />
      <WriteReviewSheet
        visible={!!reviewForEdit}
        review={reviewForEdit}
        onClose={() => setReviewForEdit(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  title: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  loading: {
    paddingVertical: spacing.xxxl,
    alignItems: "center",
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
  },
  sectionLead: {
    ...typography.textXs,
    color: colors.gray500,
    marginBottom: spacing.xs,
  },
  empty: {
    ...typography.textSm,
    color: colors.gray500,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
});
