import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { useReportReview } from "../../hooks/useReviews";
import { borderRadius, colors, spacing, typography } from "../../theme";
import { textColors } from "../../theme/colors";
import type { ReportReason } from "../../services/reviews";
import type { Review } from "../../types/review";

const REASONS: ReportReason[] = [
  "spam",
  "offensive",
  "not_a_customer",
  "off_topic",
  "other",
];

const NOTES_MAX = 500;

interface Props {
  review: Review | null;
  visible: boolean;
  onClose: () => void;
}

export function ReportReviewSheet({ review, visible, onClose }: Props) {
  const { t } = useTranslation();
  const reportMutation = useReportReview();

  const [reason, setReason] = useState<ReportReason | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setReason(null);
    setNotes("");
    setSubmitted(false);
    setError(null);
  }, [visible]);

  const submit = async () => {
    if (!review || !reason) {
      setError(t("reviews.report.errors.reasonRequired"));
      return;
    }
    setError(null);
    try {
      await reportMutation.mutateAsync({
        id: review.id,
        reason,
        notes: notes.trim() || undefined,
      });
      setSubmitted(true);
      setTimeout(() => onClose(), 900);
    } catch {
      setError(t("reviews.report.errors.submitFailed"));
    }
  };

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
            <Text style={styles.title}>{t("reviews.report.title")}</Text>
            <Text style={styles.subtitle}>{t("reviews.report.subtitle")}</Text>

            {submitted ? (
              <View style={styles.successWrap}>
                <Text style={styles.successText}>
                  {t("reviews.report.submitted")}
                </Text>
              </View>
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>{t("reviews.report.reason")}</Text>
                <View style={styles.reasonsList}>
                  {REASONS.map((r) => {
                    const selected = reason === r;
                    return (
                      <TouchableOpacity
                        key={r}
                        style={[
                          styles.reasonRow,
                          selected && styles.reasonRowSelected,
                        ]}
                        onPress={() => setReason(r)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.radio,
                            selected && styles.radioSelected,
                          ]}
                        >
                          {selected ? (
                            <View style={styles.radioInner} />
                          ) : null}
                        </View>
                        <Text style={styles.reasonText}>
                          {t(`reviews.report.reasons.${r}`)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.label}>{t("reviews.report.notes")}</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  value={notes}
                  onChangeText={(text) => setNotes(text.slice(0, NOTES_MAX))}
                  placeholder={t("reviews.report.notesPlaceholder")}
                  placeholderTextColor={textColors.placeholder}
                  multiline
                  maxLength={NOTES_MAX}
                  textAlignVertical="top"
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Button
                  title={
                    reportMutation.isPending
                      ? t("reviews.report.submitting")
                      : t("reviews.report.submit")
                  }
                  onPress={submit}
                  variant="primary"
                  size="md"
                  disabled={reportMutation.isPending}
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
            )}

            {reportMutation.isPending && !submitted ? (
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
    maxHeight: "80%",
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
  reasonsList: {
    gap: spacing.xs,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
  },
  reasonRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLightest,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  reasonText: {
    ...typography.textSm,
    color: colors.dark,
    flex: 1,
  },
  input: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    paddingHorizontal: spacing.md,
    ...typography.textSm,
    color: textColors.primary,
    backgroundColor: colors.white,
  },
  notesInput: {
    height: 100,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
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
  successWrap: {
    paddingVertical: spacing.xxl,
    alignItems: "center",
  },
  successText: {
    ...typography.textBase,
    color: colors.success,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
});
