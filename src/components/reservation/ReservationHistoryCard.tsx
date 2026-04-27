import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../../theme";
import { StatusBadge } from "./StatusBadge";
import type { Reservation } from "../../types/reservation";

interface Props {
  reservation: Reservation;
  onPress?: () => void;
  language: string;
}

const formatDate = (iso: string, language: string) => {
  try {
    const [y, m, d] = iso.split("-").map(Number);
    return new Intl.DateTimeFormat(language, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(y, m - 1, d));
  } catch {
    return iso;
  }
};

const formatTime = (raw: string) => raw.slice(0, 5);

export function ReservationHistoryCard({ reservation, onPress, language }: Props) {
  const { t } = useTranslation();
  const {
    restaurant_name,
    restaurant_logo,
    restaurant_city,
    reservation_date,
    reservation_time,
    party_size,
    status,
    confirmation_code,
  } = reservation;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        {restaurant_logo ? (
          <Image source={{ uri: restaurant_logo }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoFallback]}>
            <Text style={styles.logoFallbackText}>
              {(restaurant_name ?? "?").slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {restaurant_name}
          </Text>
          {restaurant_city ? (
            <Text style={styles.subtle} numberOfLines={1}>
              {restaurant_city}
            </Text>
          ) : null}
        </View>
        <StatusBadge status={status} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>{t("myReservations.date")}</Text>
          <Text style={styles.metaValue}>
            {formatDate(reservation_date, language)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>{t("myReservations.time")}</Text>
          <Text style={styles.metaValue}>{formatTime(reservation_time)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>{t("myReservations.guests")}</Text>
          <Text style={styles.metaValue}>{party_size}</Text>
        </View>
      </View>

      {confirmation_code ? (
        <Text style={styles.code} numberOfLines={1}>
          {t("myReservations.confirmationCode")}: {confirmation_code}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.state100,
  },
  logoFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  logoFallbackText: {
    ...typography.h3,
    color: colors.white,
    fontWeight: "700",
  },
  headerText: {
    flex: 1,
  },
  restaurantName: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
  },
  subtle: {
    ...typography.textXs,
    color: colors.gray500,
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  metaItem: {
    flex: 1,
    gap: 2,
  },
  metaLabel: {
    ...typography.textXs,
    color: colors.gray500,
  },
  metaValue: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
  },
  code: {
    ...typography.textXs,
    color: colors.gray500,
  },
});
