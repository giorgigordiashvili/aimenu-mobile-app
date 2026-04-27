import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../../theme";
import type { ReferralSummary } from "../../types/referral";

interface Props {
  summary: ReferralSummary | null | undefined;
}

const formatAmount = (raw: string | undefined) => {
  if (!raw) return "₾0.00";
  const n = Number(raw);
  if (Number.isFinite(n)) return `₾${n.toFixed(2)}`;
  return `₾${raw}`;
};

const formatPercent = (raw: string | undefined) => {
  if (!raw) return "0%";
  const n = Number(raw);
  if (Number.isFinite(n)) return `${n}%`;
  return `${raw}%`;
};

export function ReferralStatsCards({ summary }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.grid}>
      <View style={[styles.card, styles.primaryCard]}>
        <Text style={styles.label}>{t("referral.balanceLabel")}</Text>
        <Text style={styles.primaryValue}>
          {formatAmount(summary?.wallet_balance)}
        </Text>
        <Text style={styles.subLabel}>
          {t("referral.effectivePercentLabel")}{" "}
          {formatPercent(summary?.effective_percent)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{t("referral.totalEarnedLabel")}</Text>
        <Text style={styles.value}>{formatAmount(summary?.total_earned)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{t("referral.totalSpentLabel")}</Text>
        <Text style={styles.value}>{formatAmount(summary?.total_spent)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
    gap: spacing.xs,
  },
  primaryCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLightest,
  },
  label: {
    ...typography.textXs,
    color: colors.gray500,
  },
  value: {
    ...typography.h2,
    color: colors.dark,
    fontWeight: "700",
  },
  primaryValue: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: "700",
  },
  subLabel: {
    ...typography.textXs,
    color: colors.darkGrey,
  },
});
