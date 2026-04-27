import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, borderRadius, typography } from "../../theme";
import { textColors } from "../../theme/colors";

export interface Slot {
  time: string; // "HH:MM:SS" or "HH:MM"
  available: boolean;
}

interface Props {
  label: string;
  slots: Slot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  loading: boolean;
}

const SKELETON_COUNT = 12;

export const TimeSlotPicker: React.FC<Props> = ({
  label,
  slots,
  selectedTime,
  onSelect,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {loading ? (
        <View style={styles.grid}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <View key={i} style={[styles.chip, styles.skeleton]} />
          ))}
        </View>
      ) : slots.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t("reservation.noSlots")}</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {slots.map((slot) => {
            const display = slot.time.substring(0, 5);
            const isSelected = selectedTime === slot.time;
            return (
              <TouchableOpacity
                key={slot.time}
                disabled={!slot.available}
                onPress={() => onSelect(slot.time)}
                activeOpacity={0.7}
                style={[
                  styles.chip,
                  !slot.available && styles.chipDisabled,
                  isSelected && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.slotText,
                    !slot.available && styles.slotTextDisabled,
                    isSelected && styles.slotTextSelected,
                  ]}
                >
                  {display}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },

  label: {
    ...typography.textXs,
    color: textColors.tertiary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  chip: {
    width: "30%",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },

  chipDisabled: {
    backgroundColor: colors.state100,
    borderColor: colors.light,
  },

  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  skeleton: {
    backgroundColor: colors.grey,
    borderColor: colors.grey,
  },

  slotText: {
    ...typography.textSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.dark,
  },

  slotTextDisabled: {
    color: textColors.disabled,
  },

  slotTextSelected: {
    color: colors.white,
  },

  empty: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },

  emptyText: {
    ...typography.textSm,
    color: textColors.tertiary,
  },
});
