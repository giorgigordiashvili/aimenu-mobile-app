import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacing, borderRadius, typography } from "../../theme";
import { textColors } from "../../theme/colors";
import { getDateLocale } from "../../i18n";

interface Props {
  visible: boolean;
  selectedDate: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
  onClose: () => void;
  title: string;
  availableDates?: string[]; // YYYY-MM-DD list from API
  loadingDates?: boolean;
  daysAhead?: number; // fallback when availableDates not provided
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const DatePickerModal: React.FC<Props> = ({
  visible,
  selectedDate,
  onSelect,
  onClose,
  title,
  availableDates,
  loadingDates = false,
  daysAhead = 30,
}) => {
  const { i18n } = useTranslation();
  const todayLabelMap: Record<string, string> = {
    ka: "დღეს",
    ru: "Сегодня",
    en: "Today",
  };
  const locale = getDateLocale(i18n.language);
  const todayKey = toIsoDate(new Date());
  const todayLabel = todayLabelMap[i18n.language] ?? "Today";

  const dates = React.useMemo(() => {
    if (availableDates) {
      return availableDates
        .map((iso) => {
          const [y, m, d] = iso.split("-").map(Number);
          return new Date(y, m - 1, d);
        })
        .filter((d) => !isNaN(d.getTime()));
    }
    const result: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < daysAhead; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d);
    }
    return result;
  }, [availableDates, daysAhead]);

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

          {loadingDates ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : dates.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.emptyText}>No available dates</Text>
            </View>
          ) : (
            <FlatList
              data={dates}
              keyExtractor={(item) => toIsoDate(item)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => {
                const key = toIsoDate(item);
                const isSelected = key === selectedDate;
                const isToday = key === todayKey;

                const weekday = item.toLocaleDateString(locale, {
                  weekday: "long",
                });
                const dayNum = item.getDate();
                const month = item.toLocaleDateString(locale, {
                  month: "long",
                });
                const year = item.getFullYear();

                return (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(key);
                      onClose();
                    }}
                    style={[styles.row, isSelected && styles.rowSelected]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.rowLeft}>
                      <Text
                        style={[
                          styles.weekday,
                          isSelected && styles.weekdaySelected,
                        ]}
                      >
                        {weekday}
                      </Text>
                      <Text
                        style={[
                          styles.dateText,
                          isSelected && styles.dateTextSelected,
                        ]}
                      >
                        {dayNum} {month}, {year}
                      </Text>
                    </View>

                    <View style={styles.rowRight}>
                      {isToday && (
                        <View
                          style={[
                            styles.todayBadge,
                            isSelected && styles.todayBadgeSelected,
                          ]}
                        >
                          <Text style={styles.todayBadgeText}>
                            {todayLabel}
                          </Text>
                        </View>
                      )}

                      <View
                        style={[
                          styles.radio,
                          isSelected && styles.radioSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
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

  loadingContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    ...typography.textSm,
    color: textColors.tertiary,
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

  rowLeft: {
    flex: 1,
  },

  weekday: {
    ...typography.textXs,
    color: textColors.tertiary,
    marginBottom: 2,
  },

  weekdaySelected: {
    color: colors.primaryDark,
  },

  dateText: {
    ...typography.textSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.dark,
  },

  dateTextSelected: {
    color: colors.primary,
    fontWeight: typography.h1.fontWeight,
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  todayBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLightest,
  },

  todayBadgeSelected: {
    backgroundColor: "rgba(236,0,63,0.12)",
  },

  todayBadgeText: {
    ...typography.textXs,
    color: colors.primary,
    fontWeight: typography.h2.fontWeight,
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
