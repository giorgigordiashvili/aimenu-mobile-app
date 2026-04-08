import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, typography } from "../../theme";

type Status = "confirmed" | "pending" | "cancelled";

interface Props {
  status: Status;
}

export const ReservationStatusBadge: React.FC<Props> = ({ status }) => {
  const config = {
    confirmed: {
      bg: colors.accentGreenLight,
      text: colors.success,
      label: "Confirmed",
    },
    pending: {
      bg: colors.warningLight,
      text: colors.warning,
      label: "Pending",
    },
    cancelled: {
      bg: colors.dangerSoftBackground,
      text: colors.rose,
      label: "Cancelled",
    },
  };

  const current = config[status];

  return (
    <View style={[styles.container, { backgroundColor: current.bg }]}>
      <Text style={[styles.text, { color: current.text }]}>
        {current.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },

  text: {
    ...typography.textXs,
    fontWeight: typography.h2.fontWeight,
  },
});
