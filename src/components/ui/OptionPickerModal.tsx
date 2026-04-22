import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { colors, spacing, borderRadius, typography } from "../../theme";

export interface PickerOption {
  value: string;
  label: string;
}

interface Props {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export const OptionPickerModal: React.FC<Props> = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
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

          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const isSelected = item.value === selectedValue;
              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item.value);
                    onClose();
                  }}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.label,
                      isSelected && styles.labelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>

                  <View
                    style={[styles.radio, isSelected && styles.radioSelected]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "65%",
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
    marginBottom: spacing.sm,
  },

  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
  },

  rowSelected: {
    backgroundColor: colors.primaryLightest,
  },

  label: {
    ...typography.textSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.dark,
  },

  labelSelected: {
    color: colors.primary,
    fontWeight: typography.h1.fontWeight,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: colors.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
