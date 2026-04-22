import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { colors, spacing, borderRadius, typography } from "../theme";
import { textColors } from "../theme/colors";
import BackArrowIcon from "../assets/icons/BackArrowIcon";

export default function CardDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { lastFour, brand, expiryMonth, expiryYear, isDefault } =
    useLocalSearchParams<{
      id: string;
      lastFour: string;
      brand?: string;
      expiryMonth?: string;
      expiryYear?: string;
      isDefault?: string;
    }>();

  const expiry =
    expiryMonth && expiryYear
      ? `${expiryMonth.padStart(2, "0")}/${String(expiryYear).slice(-2)}`
      : "—";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("cardDetail.title", { defaultValue: "ბარათი" })}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.cardPreview}>
          <Text style={styles.cardBrandLabel}>
            {brand || t("cardDetail.card", { defaultValue: "Card" })}
          </Text>
          <Text style={styles.cardNumber}>
            •••• •••• •••• {lastFour || "••••"}
          </Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardMetaLabel}>
                {t("cardDetail.expiry", { defaultValue: "Expiry" })}
              </Text>
              <Text style={styles.cardMetaValue}>{expiry}</Text>
            </View>
            {isDefault === "true" && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>
                  {t("cardDetail.default", { defaultValue: "Default" })}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.detailCard}>
          <DetailRow
            label={t("cardDetail.brand", { defaultValue: "Brand" })}
            value={brand || "—"}
          />
          <Divider />
          <DetailRow
            label={t("cardDetail.number", { defaultValue: "Card number" })}
            value={lastFour ? `**** **** **** ${lastFour}` : "—"}
          />
          <Divider />
          <DetailRow
            label={t("cardDetail.expiry", { defaultValue: "Expiry" })}
            value={expiry}
          />
          <Divider />
          <DetailRow
            label={t("cardDetail.default", { defaultValue: "Default" })}
            value={
              isDefault === "true"
                ? t("cardDetail.yes", { defaultValue: "Yes" })
                : t("cardDetail.no", { defaultValue: "No" })
            }
          />
        </View>
      </View>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },

  headerSpacer: {
    width: 44,
    height: 44,
  },

  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },

  cardPreview: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    minHeight: 180,
    justifyContent: "space-between",
  },

  cardBrandLabel: {
    ...typography.textSm,
    color: colors.white,
    fontWeight: typography.h1.fontWeight,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  cardNumber: {
    ...typography.h3,
    color: colors.white,
    fontWeight: typography.h1.fontWeight,
    letterSpacing: 2,
    marginVertical: spacing.md,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  cardMetaLabel: {
    ...typography.textXs,
    color: colors.light,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  cardMetaValue: {
    ...typography.textSm,
    color: colors.white,
    fontWeight: typography.h1.fontWeight,
  },

  defaultBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },

  defaultBadgeText: {
    ...typography.textXs,
    color: colors.white,
    fontWeight: typography.h1.fontWeight,
  },

  detailCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    paddingHorizontal: spacing.md,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },

  detailLabel: {
    ...typography.textSm,
    color: textColors.tertiary,
  },

  detailValue: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },

  divider: {
    height: 1,
    backgroundColor: colors.light,
  },
});
