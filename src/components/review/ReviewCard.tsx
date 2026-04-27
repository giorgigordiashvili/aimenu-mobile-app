import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../../theme";
import { StarRating } from "./StarRating";
import type { Review } from "../../types/review";

interface Props {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  language: string;
}

const formatDate = (iso: string, language: string) => {
  try {
    return new Intl.DateTimeFormat(language, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleDateString();
  }
};

export function ReviewCard({
  review,
  onEdit,
  onDelete,
  onReport,
  language,
}: Props) {
  const { t } = useTranslation();
  const canEdit = (review.is_editable ?? true) && !!onEdit;
  const media = (review.media ?? []).filter((m) => m.kind === "image");

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {review.restaurant_logo ? (
          <Image
            source={{ uri: review.restaurant_logo }}
            style={styles.logo}
          />
        ) : (
          <View style={[styles.logo, styles.logoFallback]}>
            <Text style={styles.logoFallbackText}>
              {(review.restaurant_name ?? "?").slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {review.restaurant_name ?? review.restaurant_slug}
          </Text>
          <Text style={styles.meta}>
            {formatDate(review.created_at, language)}
            {review.edited_at ? ` · ${t("reviews.editedBadge")}` : ""}
          </Text>
        </View>
      </View>

      <StarRating value={review.rating} size={18} />

      {review.title ? (
        <Text style={styles.title} numberOfLines={2}>
          {review.title}
        </Text>
      ) : null}

      {review.body ? (
        <Text style={styles.body}>{review.body}</Text>
      ) : null}

      {media.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mediaRow}
        >
          {media.map((m) => (
            <Image
              key={m.id}
              source={{ uri: m.file_url }}
              style={styles.mediaThumb}
            />
          ))}
        </ScrollView>
      ) : null}

      {canEdit || onDelete || onReport ? (
        <View style={styles.actions}>
          {canEdit ? (
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Text style={styles.actionText}>{t("reviews.edit")}</Text>
            </TouchableOpacity>
          ) : null}
          {onDelete ? (
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <Text style={[styles.actionText, styles.dangerText]}>
                {t("reviews.delete")}
              </Text>
            </TouchableOpacity>
          ) : null}
          {onReport ? (
            <TouchableOpacity onPress={onReport} style={styles.actionButton}>
              <Text style={[styles.actionText, styles.mutedText]}>
                {t("reviews.reportCta")}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.state100,
  },
  logoFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  logoFallbackText: {
    ...typography.button,
    color: colors.white,
    fontWeight: "700",
  },
  headerText: {
    flex: 1,
  },
  restaurantName: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
  },
  meta: {
    ...typography.textXs,
    color: colors.gray500,
  },
  title: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
  },
  body: {
    ...typography.textSm,
    color: colors.dark,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  actionButton: {
    paddingVertical: spacing.xs,
  },
  actionText: {
    ...typography.buttonSm,
    color: colors.primary,
    fontWeight: "600",
  },
  dangerText: {
    color: colors.error,
  },
  mutedText: {
    color: colors.gray500,
  },
  mediaRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  mediaThumb: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.md,
    backgroundColor: colors.state100,
  },
});
