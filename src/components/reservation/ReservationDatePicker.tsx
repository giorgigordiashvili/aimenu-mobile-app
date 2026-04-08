import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, borderRadius, typography } from "../../theme";
import { textColors } from "../../theme/colors";

interface Props {
  label: string;
  selectedDate: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
  daysAhead?: number;
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const ReservationDatePicker: React.FC<Props> = ({
  label,
  selectedDate,
  onSelect,
  daysAhead = 30,
}) => {
  const { i18n } = useTranslation();
  const locale = i18n.language === "ka" ? "ka-GE" : "en-GB";

  const dates = React.useMemo(() => {
    const result: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < daysAhead; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d);
    }
    return result;
  }, [daysAhead]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <FlatList
        data={dates}
        keyExtractor={(item) => toIsoDate(item)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const key = toIsoDate(item);
          const isSelected = key === selectedDate;
          const dayName = item.toLocaleDateString(locale, {
            weekday: "short",
          });
          const dayNum = item.getDate();
          const monthName = item.toLocaleDateString(locale, {
            month: "short",
          });
          return (
            <TouchableOpacity
              onPress={() => onSelect(key)}
              style={[styles.chip, isSelected && styles.chipSelected]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayName, isSelected && styles.textSelected]}>
                {dayName}
              </Text>
              <Text style={[styles.dayNum, isSelected && styles.textSelected]}>
                {dayNum}
              </Text>
              <Text
                style={[styles.monthName, isSelected && styles.textSelected]}
              >
                {monthName}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
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

  list: {
    paddingRight: spacing.sm,
  },

  chip: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },

  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  dayName: {
    ...typography.textXs,
    color: textColors.tertiary,
  },

  dayNum: {
    ...typography.textSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.dark,
    marginVertical: 2,
  },

  monthName: {
    ...typography.textXs,
    color: textColors.tertiary,
  },

  textSelected: {
    color: colors.white,
  },
});
