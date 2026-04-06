import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, borderRadius, typography } from "../../src/theme";
import ErrorCircleIcon from "../../src/assets/icons/ErrorCircleIcon";

export default function PaymentFailedScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { reason } = useLocalSearchParams<{ reason?: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <ErrorCircleIcon />
      </View>

      <Text style={styles.title}>
        {t("payment.failedTitle", "Payment Failed")}
      </Text>
      <Text style={styles.subtitle}>
        {reason ||
          t(
            "payment.failedSubtitle",
            "Something went wrong. Please try again.",
          )}
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>
          {t("payment.tryAgain", "Try Again")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.secondaryText}>
          {t("payment.backHome", "Back to Home")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  iconWrap: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.textSm,
    color: colors.gray600,
    textAlign: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    width: "100%",
    marginBottom: spacing.md,
  },
  buttonText: {
    color: colors.white,
    ...typography.buttonLg,
    fontWeight: typography.h1.fontWeight,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  secondaryText: {
    ...typography.button,
    color: colors.gray600,
  },
});
