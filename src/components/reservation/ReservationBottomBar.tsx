import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, borderRadius, typography } from "../../theme";
import { textColors } from "../../theme/colors";
import CardArrow from "../../assets/icons/CardArrow";

export type ReservationBottomBarProps = {
  totalGuests: number;
  selectedDate?: string;
  selectedTime?: string;
  ctaLabel: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
};

export function ReservationBottomBar({
  totalGuests,
  selectedDate,
  selectedTime,
  ctaLabel,
  disabled = false,
  loading = false,
  onPress,
}: ReservationBottomBarProps) {
  const { t } = useTranslation();
  const isDisabled = disabled || loading;

  const formattedTime = selectedTime ? selectedTime.substring(0, 5) : null;

  const summaryParts: string[] = [];
  if (totalGuests > 0)
    summaryParts.push(`${totalGuests} ${t("restaurantList.guest")}`);
  if (selectedDate) summaryParts.push(selectedDate);
  if (formattedTime) summaryParts.push(formattedTime);

  return (
    <View style={styles.container}>
      {summaryParts.length > 0 && (
        <View style={styles.summaryRow}>
          {summaryParts.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <View style={styles.dot} />}
              <Text style={styles.summaryText}>{part}</Text>
            </React.Fragment>
          ))}
        </View>
      )}

      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[styles.button, isDisabled && styles.buttonDisabled]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <View style={styles.buttonContent}>
            <Text style={styles.buttonLabel}>{ctaLabel}</Text>
            <CardArrow color={colors.white} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.state50,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },

  summaryText: {
    ...typography.textSm,
    color: textColors.secondary,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: borderRadius.full,
    backgroundColor: textColors.secondary,
    marginHorizontal: spacing.xs,
  },

  button: {
    backgroundColor: colors.greenButtonBackground,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonLabel: {
    ...typography.buttonLg,
    color: colors.white,
    fontWeight: typography.h1.fontWeight,
    marginRight: spacing.sm,
  },
});
