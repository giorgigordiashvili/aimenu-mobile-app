import { Image, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { PunchDots } from "./PunchDots";
import { borderRadius, colors, spacing, typography } from "../../theme";
import type { LoyaltyCounter } from "../../types/loyalty";

interface Props {
  counter: LoyaltyCounter;
  onClaim: () => void;
}

export function LoyaltyCard({ counter, onClaim }: Props) {
  const { t } = useTranslation();
  const { program, punches, can_redeem, restaurant_name, restaurant_logo } =
    counter;

  const trigger = program.trigger_item_detail;
  const reward = program.reward_item_detail;

  const triggerLabel = trigger
    ? t("loyalty.trigger", { threshold: program.threshold, name: trigger.name })
    : `${program.threshold}×`;

  const rewardLabel = reward
    ? t("loyalty.reward", {
        quantity: program.reward_quantity,
        name: reward.name,
      })
    : `${program.reward_quantity}×`;

  const progressLabel = t("loyalty.progress", {
    punches,
    threshold: program.threshold,
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {restaurant_logo ? (
          <Image source={{ uri: restaurant_logo }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoFallback]}>
            <Text style={styles.logoFallbackText}>
              {(restaurant_name ?? "?").slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.headerText}>
          {restaurant_name ? (
            <Text style={styles.restaurantName} numberOfLines={1}>
              {restaurant_name}
            </Text>
          ) : null}
          <Text style={styles.programName} numberOfLines={1}>
            {program.name}
          </Text>
        </View>
      </View>

      <View style={styles.rulesBlock}>
        <View style={styles.ruleRow}>
          <Text style={styles.ruleLabel}>{t("loyalty.buy")}</Text>
          <Text style={styles.ruleValue} numberOfLines={1}>
            {triggerLabel}
          </Text>
        </View>
        <View style={styles.ruleRow}>
          <Text style={styles.ruleLabel}>{t("loyalty.get")}</Text>
          <Text style={styles.ruleValue} numberOfLines={1}>
            {rewardLabel}
          </Text>
        </View>
      </View>

      <PunchDots filled={punches} total={program.threshold} />

      <Button
        title={can_redeem ? t("loyalty.claim") : progressLabel}
        onPress={onClaim}
        disabled={!can_redeem}
        variant="primary"
        size="md"
        style={styles.claimButton}
      />
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
    gap: spacing.xmd,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xmd,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.state100,
  },
  logoFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  logoFallbackText: {
    ...typography.h3,
    color: colors.white,
    fontWeight: "700",
  },
  headerText: {
    flex: 1,
  },
  restaurantName: {
    ...typography.textSm,
    color: colors.gray500,
  },
  programName: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
  },
  rulesBlock: {
    gap: spacing.xs,
  },
  ruleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  ruleLabel: {
    ...typography.textSm,
    color: colors.gray500,
  },
  ruleValue: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  claimButton: {
    borderRadius: borderRadius.full,
    minHeight: 48,
  },
});
