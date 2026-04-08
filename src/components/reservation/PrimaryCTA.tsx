import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { colors, spacing, borderRadius, typography } from "../../theme";
import CardArrow from "../../assets/icons/CardArrow";

type PrimaryCTAProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  showArrow?: boolean;
};

export function PrimaryCTA({
  label,
  onPress,
  disabled = false,
  loading = false,
  showArrow = true,
}: PrimaryCTAProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[styles.button, isDisabled && styles.buttonDisabled]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          {showArrow ? <CardArrow color={colors.white} /> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.greenButtonBackground,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { opacity: 0.5 },
  content: { flexDirection: "row", alignItems: "center" },
  label: {
    ...typography.buttonLg,
    color: colors.white,
    fontWeight: typography.h1.fontWeight,
    marginRight: spacing.sm,
  },
});
