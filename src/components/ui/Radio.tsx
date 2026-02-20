import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../../theme";
import { textColors } from "../../theme/colors";

interface RadioProps {
  selected: boolean;
  onSelect: () => void;
  label?: string;
  disabled?: boolean;
}

export const Radio: React.FC<RadioProps> = ({
  selected,
  onSelect,
  label,
  disabled,
}) => {
  return (
    <Pressable
      onPress={() => !disabled && onSelect()}
      style={styles.container}
      disabled={disabled}
    >
      <View
        style={[
          styles.outerCircle,
          selected && styles.outerSelected,
          disabled && styles.disabled,
        ]}
      >
        {selected && <View style={styles.innerDot} />}
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
    gap: spacing.sm,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  outerSelected: {
    borderColor: colors.primary,
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.paragraph,
    color: colors.dark,
  },
  labelDisabled: {
    color: textColors.disabled,
  },
});
