import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors, spacing, borderRadius, typography } from "../../theme";
import { textColors } from "../../theme/colors";
import DropdownArrow from "../../assets/icons/DropdownArrow";

type Props = {
  label: string;
  value: string;
  style?: ViewStyle;
  onPress?: () => void;
};

export const TimeSlotChip: React.FC<Props> = ({
  label,
  value,
  style,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <DropdownArrow />
      </View>
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

  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  value: {
    ...typography.textSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.dark,
  },
});
