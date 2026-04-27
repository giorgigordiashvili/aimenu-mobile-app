import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { StarRating } from "./StarRating";
import {
  reviewsKeys,
  useCreateReview,
  useUpdateReview,
} from "../../hooks/useReviews";
import { reviewsApi } from "../../services/reviews";
import { borderRadius, colors, spacing, typography } from "../../theme";
import { textColors } from "../../theme/colors";
import type { EligibleOrder, Review, ReviewMedia } from "../../types/review";

const TITLE_MAX = 120;
const BODY_MAX = 4000;
const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface PendingMedia {
  key: string;
  uri: string;
  fileName?: string;
  mime?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  /** When editing an existing review, pass `review`. When writing a new one, pass `order`. */
  order?: EligibleOrder | null;
  review?: Review | null;
}

export function WriteReviewSheet({ visible, onClose, order, review }: Props) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();

  const isEdit = !!review;

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<Set<string>>(
    new Set(),
  );
  const [uploading, setUploading] = useState<{
    done: number;
    total: number;
  } | null>(null);

  const existingMedia = useMemo<ReviewMedia[]>(
    () => review?.media ?? [],
    [review?.media],
  );

  const visibleExistingMedia = useMemo(
    () => existingMedia.filter((m) => !removedMediaIds.has(m.id)),
    [existingMedia, removedMediaIds],
  );

  const totalImageCount = visibleExistingMedia.length + pendingMedia.length;
  const remaining = Math.max(0, MAX_IMAGES - totalImageCount);

  useEffect(() => {
    if (!visible) return;
    if (review) {
      setRating(review.rating ?? 0);
      setTitle(review.title ?? "");
      setBody(review.body ?? "");
    } else {
      setRating(0);
      setTitle("");
      setBody("");
    }
    setPendingMedia([]);
    setRemovedMediaIds(new Set());
    setUploading(null);
    setError(null);
  }, [visible, review]);

  const targetRestaurantName = review?.restaurant_name ?? order?.restaurant_name;
  const targetOrderNumber = review?.order_number ?? order?.order_number;

  const isPending =
    createMutation.isPending || updateMutation.isPending || !!uploading;

  const pickImages = async () => {
    if (remaining <= 0) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError(t("reviews.errors.mediaPermission"));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions?.Images ?? "images",
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });
    if (result.canceled) return;

    const accepted: PendingMedia[] = [];
    let rejectedTooLarge = false;

    for (const asset of result.assets ?? []) {
      if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE) {
        rejectedTooLarge = true;
        continue;
      }
      accepted.push({
        key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        uri: asset.uri,
        fileName: asset.fileName ?? undefined,
        mime: asset.mimeType ?? undefined,
      });
      if (accepted.length >= remaining) break;
    }

    if (rejectedTooLarge) setError(t("reviews.errors.imageTooLarge"));
    else setError(null);
    setPendingMedia((prev) => [...prev, ...accepted]);
  };

  const removePending = (key: string) => {
    setPendingMedia((prev) => prev.filter((p) => p.key !== key));
  };

  const removeExisting = (id: string) => {
    setRemovedMediaIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const submit = async () => {
    if (rating < 1) {
      setError(t("reviews.errors.ratingRequired"));
      return;
    }
    setError(null);

    try {
      let reviewId: string;

      if (isEdit && review) {
        await updateMutation.mutateAsync({
          id: review.id,
          payload: { rating, title: title.trim(), body: body.trim() },
        });
        reviewId = review.id;

        // Delete the existing media the user removed.
        for (const id of removedMediaIds) {
          try {
            await reviewsApi.deleteMedia(reviewId, id);
          } catch {
            // best-effort: continue even if one delete fails
          }
        }
      } else if (order) {
        const created = await createMutation.mutateAsync({
          order: order.order_number,
          rating,
          title: title.trim() || undefined,
          body: body.trim() || undefined,
        });
        reviewId = created.id;
      } else {
        return;
      }

      // Upload pending images sequentially.
      if (pendingMedia.length > 0) {
        setUploading({ done: 0, total: pendingMedia.length });
        for (let i = 0; i < pendingMedia.length; i++) {
          try {
            await reviewsApi.uploadImage(reviewId, pendingMedia[i]);
          } catch {
            // surface a soft warning but keep going
          }
          setUploading({ done: i + 1, total: pendingMedia.length });
        }
        // Refresh My Reviews so the new media appears.
        qc.invalidateQueries({ queryKey: reviewsKeys.mine });
      }

      setUploading(null);
      onClose();
    } catch {
      setUploading(null);
      setError(t("reviews.errors.submitFailed"));
    }
  };

  const renderImageThumb = (
    uri: string,
    onRemove: () => void,
    key: string,
  ) => (
    <View key={key} style={styles.thumbWrap}>
      <Image source={{ uri }} style={styles.thumb} />
      <TouchableOpacity
        style={styles.thumbRemove}
        onPress={onRemove}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        disabled={isPending}
      >
        <Text style={styles.thumbRemoveText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const submitLabel = uploading
    ? t("reviews.uploadingProgress", {
        done: uploading.done,
        total: uploading.total,
      })
    : isPending
    ? t("reviews.submitting")
    : isEdit
    ? t("reviews.save")
    : t("reviews.submit");

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />

            <Text style={styles.title}>
              {isEdit ? t("reviews.editTitle") : t("reviews.writeTitle")}
            </Text>
            {targetRestaurantName ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {targetRestaurantName}
                {targetOrderNumber ? ` · #${targetOrderNumber}` : ""}
              </Text>
            ) : null}

            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>{t("reviews.ratingLabel")}</Text>
              <View style={styles.ratingWrap}>
                <StarRating value={rating} size={36} onChange={setRating} />
              </View>

              <Text style={styles.label}>{t("reviews.titleLabel")}</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={(text) => setTitle(text.slice(0, TITLE_MAX))}
                placeholder={t("reviews.titlePlaceholder")}
                placeholderTextColor={textColors.placeholder}
                maxLength={TITLE_MAX}
              />

              <Text style={styles.label}>{t("reviews.bodyLabel")}</Text>
              <TextInput
                style={[styles.input, styles.bodyInput]}
                value={body}
                onChangeText={(text) => setBody(text.slice(0, BODY_MAX))}
                placeholder={t("reviews.bodyPlaceholder")}
                placeholderTextColor={textColors.placeholder}
                multiline
                maxLength={BODY_MAX}
                textAlignVertical="top"
              />

              <Text style={styles.label}>
                {t("reviews.mediaLabel")}{" "}
                <Text style={styles.mediaHint}>
                  ({totalImageCount}/{MAX_IMAGES})
                </Text>
              </Text>

              <View style={styles.thumbGrid}>
                {visibleExistingMedia.map((m) =>
                  renderImageThumb(m.file_url, () => removeExisting(m.id), m.id),
                )}
                {pendingMedia.map((m) =>
                  renderImageThumb(m.uri, () => removePending(m.key), m.key),
                )}
                {remaining > 0 ? (
                  <TouchableOpacity
                    style={[styles.thumbWrap, styles.thumbAdd]}
                    onPress={pickImages}
                    disabled={isPending}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.thumbAddText}>＋</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Button
                title={submitLabel}
                onPress={submit}
                variant="primary"
                size="md"
                disabled={isPending}
                style={styles.submitButton}
              />
              <Button
                title={t("reviews.cancel")}
                onPress={onClose}
                variant="outline"
                size="md"
                style={styles.cancelButton}
              />
            </ScrollView>

            {isPending ? (
              <View style={styles.loadingOverlay} pointerEvents="none">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : null}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const THUMB_SIZE = 80;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: "90%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    ...typography.textSm,
    color: colors.gray500,
    textAlign: "center",
    marginTop: 2,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.textSm,
    color: colors.darkGrey,
    fontWeight: "600",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  mediaHint: {
    ...typography.textXs,
    color: colors.gray500,
    fontWeight: "400",
  },
  ratingWrap: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  input: {
    height: 48,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    paddingHorizontal: spacing.md,
    ...typography.textSm,
    color: textColors.primary,
    backgroundColor: colors.white,
  },
  bodyInput: {
    height: 140,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  thumbGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: borderRadius.md,
    overflow: "visible",
    position: "relative",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: borderRadius.md,
    backgroundColor: colors.state100,
  },
  thumbAdd: {
    borderWidth: 1,
    borderColor: colors.light,
    borderStyle: "dashed",
    backgroundColor: colors.state50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
  },
  thumbAddText: {
    fontSize: 32,
    color: colors.gray500,
    lineHeight: 36,
  },
  thumbRemove: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbRemoveText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
  },
  errorText: {
    ...typography.textSm,
    color: colors.error,
    marginTop: spacing.sm,
  },
  submitButton: {
    borderRadius: borderRadius.full,
    minHeight: 48,
    marginTop: spacing.md,
  },
  cancelButton: {
    borderRadius: borderRadius.full,
    minHeight: 48,
    marginTop: spacing.sm,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
});
