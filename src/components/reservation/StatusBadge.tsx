import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../../theme";
import type { ReservationStatus } from "../../types/reservation";

interface Props {
  status: ReservationStatus;
}

const PALETTE: Record<
  ReservationStatus,
  { bg: string; fg: string }
> = {
  pending: { bg: colors.warningLight, fg: colors.warning },
  confirmed: { bg: colors.accentGreenLight, fg: colors.success },
  completed: { bg: colors.state100, fg: colors.gray600 },
  cancelled: { bg: colors.dangerSoftBackground, fg: colors.error },
  no_show: { bg: colors.state100, fg: colors.gray500 },
};

export function StatusBadge({ status }: Props) {
  const { t } = useTranslation();
  const palette = PALETTE[status] ?? PALETTE.pending;

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.text, { color: palette.fg }]}>
        {t(`myReservations.status.${status}`, { defaultValue: status })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  text: {
    ...typography.textXs,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
