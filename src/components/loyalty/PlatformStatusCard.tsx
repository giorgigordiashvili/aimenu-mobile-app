import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../../theme";
import { usePlatformStatus } from "../../hooks/useLoyalty";

export function PlatformStatusCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = usePlatformStatus();

  if (!data) return null;

  const { current_tier, next_tier, points, points_to_next } = data;
  const pointsNum = Number(points) || 0;
  const currentMin = Number(current_tier?.minimum_points ?? 0);
  const nextMin = Number(next_tier?.minimum_points ?? 0);
  const progress =
    next_tier && nextMin > currentMin
      ? Math.max(
          0,
          Math.min(1, (pointsNum - currentMin) / (nextMin - currentMin)),
        )
      : 1;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{t("loyalty.tier.current")}</Text>
          <Text style={styles.tierName}>
            {current_tier?.name ?? t("loyalty.tier.none")}
          </Text>
        </View>
        <View style={styles.pointsPill}>
          <Text style={styles.pointsText}>
            {t("loyalty.tier.points", { points: pointsNum })}
          </Text>
        </View>
      </View>

      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>

      {next_tier ? (
        <Text style={styles.toNext}>
          {t("loyalty.tier.toNext", {
            remaining: points_to_next,
            tier: next_tier.name,
          })}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={() => router.push("/loyalty-rules")}
        activeOpacity={0.7}
      >
        <Text style={styles.learnMore}>{t("loyalty.rules.learnMore")}</Text>
      </TouchableOpacity>
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
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  label: {
    ...typography.textXs,
    color: colors.gray500,
  },
  tierName: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
  },
  pointsPill: {
    backgroundColor: colors.primaryLightest,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  pointsText: {
    ...typography.textSm,
    color: colors.primary,
    fontWeight: "600",
  },
  bar: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  toNext: {
    ...typography.textXs,
    color: colors.gray500,
  },
  learnMore: {
    ...typography.textXs,
    color: colors.primary,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
});
