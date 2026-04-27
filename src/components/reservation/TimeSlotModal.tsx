import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, borderRadius, typography } from "../../theme";
import { textColors } from "../../theme/colors";

export interface Slot {
  time: string; // "HH:MM:SS" or "HH:MM"
  available: boolean;
}

interface Props {
  visible: boolean;
  title: string;
  slots: Slot[];
  selectedTime: string | null;
  loading: boolean;
  onSelect: (time: string) => void;
  onClose: () => void;
}

const SKELETON_COUNT = 9;

export const TimeSlotModal: React.FC<Props> = ({
  visible,
  title,
  slots,
  selectedTime,
  loading,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
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
                      onPress={() => {
                        onSelect(slot.time);
                        onClose();
                      }}
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "60%",
    paddingBottom: 40,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.light,
    borderRadius: borderRadius.full,
    alignSelf: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  title: {
    ...typography.h4,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },

  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
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
    minHeight: 44,
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
    paddingVertical: spacing.xl,
    alignItems: "center",
  },

  emptyText: {
    ...typography.textSm,
    color: textColors.tertiary,
  },
});
