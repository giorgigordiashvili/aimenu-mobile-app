import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../../theme";
import { textColors } from "../../theme/colors";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled,
}) => {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      style={styles.container}
      disabled={disabled}
    >
      <View
        style={[
          styles.box,
          checked && styles.boxChecked,
          disabled && styles.boxDisabled,
        ]}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {label && (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm, // 8
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  boxDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  label: {
    ...typography.paragraph,
    color: colors.dark,
  },
  labelDisabled: {
    color: textColors.disabled,
  },
});
