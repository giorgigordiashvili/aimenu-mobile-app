import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, borderRadius, typography } from "../../src/theme";
import CheckCircleIcon from "../../src/assets/icons/CheckCircleIcon";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { orderNumber } = useLocalSearchParams<{ orderNumber?: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <CheckCircleIcon />
      </View>

      <Text style={styles.title}>
        {t("payment.successTitle", "Payment Successful!")}
      </Text>
      <Text style={styles.subtitle}>
        {t("payment.successSubtitle", "Your order has been placed.")}
      </Text>

      {orderNumber ? (
        <Text style={styles.orderNumber}>
          {t("payment.orderNumber", "Order #{{number}}", {
            number: orderNumber,
          })}
        </Text>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/order-history")}
      >
        <Text style={styles.buttonText}>
          {t("payment.viewOrders", "View My Orders")}
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
    marginBottom: spacing.sm,
  },
  orderNumber: {
    ...typography.button,
    color: colors.success,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.greenButtonBackground,
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
