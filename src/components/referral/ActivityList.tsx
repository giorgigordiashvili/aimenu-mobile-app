import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../../theme";
import type { WalletTransaction } from "../../types/referral";

interface Props {
  items: WalletTransaction[];
  isLoading?: boolean;
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

const formatAmount = (raw: string) => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return `₾${raw}`;
  const sign = n >= 0 ? "+" : "−";
  return `${sign}₾${Math.abs(n).toFixed(2)}`;
};

export function ActivityList({ items, isLoading, language }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("referral.recentActivityTitle")}</Text>

      {items.length === 0 && !isLoading ? (
        <Text style={styles.empty}>{t("referral.emptyActivity")}</Text>
      ) : (
        items.map((tx, index) => {
          const negative = Number(tx.amount) < 0;
          return (
            <View
              key={tx.id}
              style={[styles.row, index > 0 && styles.rowDivider]}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.kind} numberOfLines={1}>
                  {t(`referral.txKind.${tx.kind}`, {
                    defaultValue: tx.kind,
                  })}
                </Text>
                <Text style={styles.meta}>
                  {formatDate(tx.created_at, language)}
                  {tx.source_order_number ? ` · #${tx.source_order_number}` : ""}
                </Text>
                {tx.referred_user_email ? (
                  <Text style={styles.meta} numberOfLines={1}>
                    {tx.referred_user_email}
                  </Text>
                ) : null}
              </View>
              <Text
                style={[
                  styles.amount,
                  negative ? styles.amountNegative : styles.amountPositive,
                ]}
              >
                {formatAmount(tx.amount)}
              </Text>
            </View>
          );
        })
      )}
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
  title: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  empty: {
    ...typography.textSm,
    color: colors.gray500,
    textAlign: "center",
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  rowLeft: {
    flex: 1,
    gap: 2,
  },
  kind: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
  },
  meta: {
    ...typography.textXs,
    color: colors.gray500,
  },
  amount: {
    ...typography.textSm,
    fontWeight: "700",
  },
  amountPositive: {
    color: colors.success,
  },
  amountNegative: {
    color: colors.error,
  },
});
