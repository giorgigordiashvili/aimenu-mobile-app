import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, typography } from "../../theme";
import { textColors } from "../../theme/colors";

type Props = {
  label: string;
  value: string;
  onPress?: () => void;
};

export const DateChip: React.FC<Props> = ({ label, value, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  label: {
    ...typography.textXs,
    color: textColors.tertiary,
  },

  value: {
    ...typography.textSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.dark,
  },
});
