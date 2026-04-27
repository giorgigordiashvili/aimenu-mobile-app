import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../../theme";
import type { ReferredUser } from "../../types/referral";

interface Props {
  users: ReferredUser[];
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
  return `₾${n.toFixed(2)}`;
};

export function ReferredUsersList({ users, isLoading, language }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("referral.referredUsersTitle")}</Text>

      {users.length === 0 && !isLoading ? (
        <Text style={styles.empty}>{t("referral.emptyReferred")}</Text>
      ) : (
        users.map((u, index) => (
          <View
            key={u.id}
            style={[styles.row, index > 0 && styles.rowDivider]}
          >
            <View style={styles.rowLeft}>
              <Text style={styles.name} numberOfLines={1}>
                {u.full_name || u.email}
              </Text>
              {u.full_name ? (
                <Text style={styles.meta} numberOfLines={1}>
                  {u.email}
                </Text>
              ) : null}
              <Text style={styles.meta}>
                {t("referral.joinedAt")}: {formatDate(u.joined_at, language)}
              </Text>
            </View>
            <Text style={styles.amount}>{formatAmount(u.total_earned)}</Text>
          </View>
        ))
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
  name: {
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
    color: colors.success,
  },
});
