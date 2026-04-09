import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, borderRadius, typography } from "../../theme";

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  title?: string;
}

export const GuestCounterStepper: React.FC<Props> = ({
  value,
  min = 1,
  max = 20,
  onChange,
  title,
}) => {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <View style={styles.guestCard}>
      {title && <Text style={styles.label}>{title}</Text>}

      <View style={styles.guestRow}>
        <Text style={styles.guestValue}>{value}</Text>

        <View style={styles.guestControls}>
          <TouchableOpacity
            onPress={decrease}
            disabled={value === min}
            style={[
              styles.guestControlButton,
              value === min && styles.disabledButton,
            ]}
          >
            <Text style={styles.guestControlSymbol}>-</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={increase}
            disabled={value === max}
            style={[
              styles.guestControlButton,
              styles.guestControlPrimary,
              value === max && styles.disabledButton,
            ]}
          >
            <Text
              style={[
                styles.guestControlSymbol,
                styles.guestControlPrimarySymbol,
              ]}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  guestCard: {
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    padding: spacing.sm,
  },

  label: {
    ...typography.textXs,
    color: colors.gray500,
    marginBottom: spacing.sm,
  },

  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  guestValue: {
    ...typography.textSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.gray900,
  },

  guestControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.4,
  },
  guestControlButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.quantityControlBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    marginLeft: spacing.sm,
  },

  guestControlPrimary: {
    borderColor: colors.dangerSoftBackground,
    backgroundColor: colors.primaryLightest,
  },

  guestControlSymbol: {
    ...typography.textLg,
    color: colors.quantityControlIcon,
    lineHeight: 22,
  },

  guestControlPrimarySymbol: {
    color: colors.primary,
  },
});
