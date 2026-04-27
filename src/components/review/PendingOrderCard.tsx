import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../../theme";
import type { EligibleOrder } from "../../types/review";

interface Props {
  order: EligibleOrder;
  onWrite: () => void;
}

export function PendingOrderCard({ order, onWrite }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      {order.restaurant_logo ? (
        <Image source={{ uri: order.restaurant_logo }} style={styles.logo} />
      ) : (
        <View style={[styles.logo, styles.logoFallback]}>
          <Text style={styles.logoFallbackText}>
            {order.restaurant_name.slice(0, 1).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {order.restaurant_name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          #{order.order_number}
          {order.total_amount ? ` · ${order.total_amount} ₾` : ""}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.writeButton}
        onPress={onWrite}
        activeOpacity={0.85}
      >
        <Text style={styles.writeButtonText}>{t("reviews.writeCta")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
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
  info: {
    flex: 1,
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
  writeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  writeButtonText: {
    ...typography.buttonSm,
    color: colors.white,
    fontWeight: "700",
  },
});
