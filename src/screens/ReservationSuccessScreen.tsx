import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import CheckCircleIcon from "../../src/assets/icons/CheckCircleIcon";
import InviteIcon from "../../src/assets/icons/InviteIcon";
import { Button } from "../../src/components/Button";
import { colors, spacing, borderRadius, typography } from "../../src/theme";
import { textColors } from "../../src/theme/colors";

export default function ReservationSuccessScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { reservationCode, restaurantName, date, time } = useLocalSearchParams<{
    reservationCode: string;
    restaurantName: string;
    date: string;
    time: string;
  }>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckCircleIcon />

        <Text style={styles.title}>{t("reservationSuccess.successTitle")}</Text>
        <Text style={styles.subtitle}>
          {t("reservationSuccess.successSubtitle", {
            restaurantName: restaurantName || "",
          })}
        </Text>

        <View style={styles.codeCard}>
          {!!date && (
            <>
              <View style={styles.codeRow}>
                <Text style={styles.codeLabel}>
                  {t("reservationSuccess.date")}
                </Text>
                <Text style={styles.codeValue}>{date}</Text>
              </View>
              <View style={styles.codeDivider} />
            </>
          )}
          {!!time && (
            <>
              <View style={styles.codeRow}>
                <Text style={styles.codeLabel}>
                  {t("reservationSuccess.time")}
                </Text>
                <Text style={styles.codeValue}>{time.substring(0, 5)}</Text>
              </View>
              <View style={styles.codeDivider} />
            </>
          )}
          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>
              {t("reservationSuccess.infoTitle")}
            </Text>
            <Text style={styles.codeValue}>
              {reservationCode ? `#${reservationCode}` : "—"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={t("reservationSuccess.invite")}
          onPress={() => {}}
          variant="primary"
          fullWidth
          size="md"
          leftIcon={<InviteIcon />}
          style={styles.inviteButton}
          textStyle={styles.inviteButtonText}
        />

        <Button
          title={t("reservationSuccess.successCta")}
          onPress={() => router.replace("/(tabs)")}
          variant="success"
          fullWidth
          size="md"
          style={styles.primaryButton}
          textStyle={styles.primaryButtonText}
        />

        <Button
          title={t("reservationSuccess.orders")}
          onPress={() => router.push("/order-history")}
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
    flexDirection: "column",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },

  codeDivider: {
    height: 1,
    backgroundColor: colors.light,
  },

  codeLabel: {
    ...typography.textSm,
    color: textColors.tertiary,
  },

  codeValue: {
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
