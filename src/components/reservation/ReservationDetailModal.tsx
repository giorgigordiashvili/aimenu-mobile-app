import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { StatusBadge } from "./StatusBadge";
import { useCancelReservation } from "../../hooks/useMyReservations";
import { borderRadius, colors, spacing, typography } from "../../theme";
import type { Reservation } from "../../types/reservation";

interface Props {
  reservation: Reservation | null;
  visible: boolean;
  onClose: () => void;
  language: string;
}

const formatDate = (iso: string, language: string) => {
  try {
    const [y, m, d] = iso.split("-").map(Number);
    return new Intl.DateTimeFormat(language, {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(y, m - 1, d));
  } catch {
    return iso;
  }
};

const formatTime = (raw: string) => raw.slice(0, 5);

export function ReservationDetailModal({
  reservation,
  visible,
  onClose,
  language,
}: Props) {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useCancelReservation();

  if (!reservation) {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
      />
    );
  }

  const canCancel =
    reservation.can_cancel ??
    (reservation.status !== "cancelled" &&
      reservation.status !== "completed" &&
      reservation.status !== "no_show");

  const handleCancel = async () => {
    try {
      await mutateAsync(reservation.id);
      onClose();
    } catch {
      // hook + service surface error; keep sheet open
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {reservation.restaurant_cover_image ? (
              <Image
                source={{ uri: reservation.restaurant_cover_image }}
                style={styles.cover}
              />
            ) : null}

            <View style={styles.header}>
              <Text style={styles.restaurantName} numberOfLines={1}>
                {reservation.restaurant_name}
              </Text>
              <StatusBadge status={reservation.status} />
            </View>

            <View style={styles.fieldGrid}>
              <Field
                label={t("myReservations.date")}
                value={formatDate(reservation.reservation_date, language)}
              />
              <Field
                label={t("myReservations.time")}
                value={formatTime(reservation.reservation_time)}
              />
              <Field
                label={t("myReservations.guests")}
                value={String(reservation.party_size)}
              />
            </View>

            {reservation.confirmation_code ? (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>
                  {t("myReservations.confirmationCode")}
                </Text>
                <Text style={styles.code} selectable>
                  {reservation.confirmation_code}
                </Text>
              </View>
            ) : null}

            {reservation.special_requests ? (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>
                  {t("myReservations.specialRequests")}
                </Text>
                <Text style={styles.fieldValue}>
                  {reservation.special_requests}
                </Text>
              </View>
            ) : null}

            {canCancel ? (
              <Button
                title={
                  isPending ? "..." : t("myReservations.cancelReservation")
                }
                onPress={handleCancel}
                variant="dangerSoft"
                size="md"
                disabled={isPending}
                style={styles.cancelButton}
              />
            ) : null}

            <Button
              title={t("loyalty.close")}
              onPress={onClose}
              variant="outline"
              size="md"
              style={styles.closeButton}
            />
          </ScrollView>

          {isPending ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldGridItem}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  cover: {
    width: "100%",
    height: 140,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  restaurantName: {
    flex: 1,
    ...typography.h3,
    color: colors.dark,
    fontWeight: "700",
  },
  fieldGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  fieldGridItem: {
    flex: 1,
    backgroundColor: colors.state50,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 2,
  },
  field: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  fieldLabel: {
    ...typography.textXs,
    color: colors.gray500,
  },
  fieldValue: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
  },
  code: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "700",
    letterSpacing: 2,
  },
  cancelButton: {
    borderRadius: borderRadius.full,
    minHeight: 48,
    marginTop: spacing.sm,
  },
  closeButton: {
    borderRadius: borderRadius.full,
    minHeight: 48,
    marginTop: spacing.sm,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
});
