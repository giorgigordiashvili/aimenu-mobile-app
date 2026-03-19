import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import CheckCircleIcon from "../../src/assets/icons/CheckCircleIcon";
import InviteIcon from "../../src/assets/icons/InviteIcon";
import { Button } from "../../src/components/Button";
import { colors, spacing, borderRadius, typography } from "../../src/theme";
import { textColors } from "../../src/theme/colors";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckCircleIcon />

        <Text style={styles.title}>{t("paymentSuccess.successTitle")}</Text>
        <Text style={styles.subtitle}>
          {t("paymentSuccess.successSubtitle")}
        </Text>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>{t("paymentSuccess.infoTitle")}</Text>
          <Text style={styles.codeValue}>#MG-2271</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={t("paymentSuccess.invite")}
          onPress={() => {}}
          variant="primary"
          fullWidth
          size="md"
          leftIcon={<InviteIcon />}
          style={styles.inviteButton}
          textStyle={styles.inviteButtonText}
        />

        <Button
          title={t("paymentSuccess.successCta")}
          onPress={() => router.replace("/(tabs)")}
          variant="success"
          fullWidth
          size="md"
          style={styles.primaryButton}
          textStyle={styles.primaryButtonText}
        />

        <Button
          title={t("paymentSuccess.orders")}
          onPress={() => {}}
          variant="ghost"
          size="sm"
          textStyle={styles.ordersLink}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
    paddingHorizontal: spacing.md,
    padding: spacing.xxxl,
    justifyContent: "space-between",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  title: {
    ...typography.h2,
    marginTop: spacing.md,
    textAlign: "center",
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },

  subtitle: {
    ...typography.textXs,
    color: textColors.tertiary,
    textAlign: "center",
  },

  codeCard: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  codeLabel: {
    ...typography.textSm,
    color: textColors.tertiary,
  },

  codeValue: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },

  footer: {
    gap: spacing.xmd,
    alignItems: "center",
  },

  inviteButton: {
    height: 48,
    borderRadius: borderRadius.full,
  },

  inviteButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: typography.h1.fontWeight,
  },

  primaryButton: {
    height: 48,
    borderRadius: borderRadius.full,
  },

  primaryButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: typography.h1.fontWeight,
  },

  ordersLink: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },
});
