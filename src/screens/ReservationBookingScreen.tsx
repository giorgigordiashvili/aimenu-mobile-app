import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  getAvailability,
  getReservationSettings,
  createReservation,
} from "../services/reservations";
import { GuestCountSelector } from "../components/reservation/GuestCountSelector";
import { ReservationStatusBadge } from "../components/reservation/ReservationStatusBadge";
import { colors, spacing, typography, borderRadius } from "../theme";
import { useRouter } from "expo-router";

export default function ReservationBookingScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const { restaurantSlug } = useCart();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);

  const [settings, setSettings] = useState<any>(null);
  const [slots, setSlots] = useState<string[]>([]);

  const [loadingSettings, setLoadingSettings] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservationStatus, setReservationStatus] = useState<
    "pending" | "confirmed" | "cancelled" | null
  >(null);

  const isValid = selectedDate && selectedTime && guests;

  // 🔹 Load reservation settings
  useEffect(() => {
    if (!token || !restaurantSlug) return;

    setLoadingSettings(true);
    getReservationSettings(token, restaurantSlug)
      .then((res) => setSettings(res))
      .catch(() =>
        setError(t("reservation.settingsError") || "Failed to load settings"),
      )
      .finally(() => setLoadingSettings(false));
  }, [token, restaurantSlug]);

  // 🔹 Load availability when date or guest count changes
  useEffect(() => {
    if (!token || !restaurantSlug || !selectedDate) return;

    setLoadingSlots(true);
    setError(null);

    getAvailability(token, restaurantSlug, selectedDate, guests)
      .then((res) => {
        setSlots(res?.slots || []);
      })
      .catch(() =>
        setError(
          t("reservation.availabilityError") || "Failed to load availability",
        ),
      )
      .finally(() => setLoadingSlots(false));
  }, [token, restaurantSlug, selectedDate, guests]);

  const handleReservation = async () => {
    if (!token || !restaurantSlug || !selectedDate || !selectedTime) return;

    try {
      await createReservation(token, {
        restaurant_slug: restaurantSlug,
        reservation_date: selectedDate,
        reservation_time: selectedTime,
        party_size: guests,
        guest_name: user ? `${user.first_name} ${user.last_name}`.trim() : "",
        guest_email: user?.email ?? "",
      });
      setReservationStatus("confirmed");
      Alert.alert(t("reservation.success") || "Reservation confirmed!");
      router.push("/reservation-success");
    } catch (err: any) {
      if (err.message === "SESSION_EXPIRED") {
        router.replace("/login");
        return;
      }
      setReservationStatus("cancelled");
      Alert.alert(
        t("common.error") || "Error",
        err.message || t("reservation.failed"),
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {t("reservation.booking") || "Reservation"}
      </Text>

      {/* 🔹 DATE SELECTOR */}
      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => setSelectedDate("2025-11-25")} // Replace with date picker modal if needed
      >
        <Text style={styles.dateText}>
          {selectedDate || t("reservation.selectDate") || "Select Date"}
        </Text>
      </TouchableOpacity>

      {/* 🔹 TIME SLOTS */}
      <View style={styles.slotsContainer}>
        {loadingSlots ? (
          <ActivityIndicator color={colors.primary} />
        ) : slots.length === 0 ? (
          <Text style={styles.emptyText}>
            {t("reservation.noSlots") || "No available time slots"}
          </Text>
        ) : (
          slots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[styles.slot, selectedTime === slot && styles.slotActive]}
              onPress={() => setSelectedTime(slot)}
            >
              <Text
                style={[
                  styles.slotText,
                  selectedTime === slot && styles.slotTextActive,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* 🔹 GUEST SELECTOR */}
      {loadingSettings ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <GuestCountSelector
          value={guests}
          min={settings?.min_party_size ?? 1}
          max={settings?.max_party_size ?? 20}
          onChange={setGuests}
          label={t("reservation.guestLabel") || "Guests"}
        />
      )}

      {/* 🔹 ERROR */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* 🔹 RESERVATION STATUS */}
      {reservationStatus && (
        <ReservationStatusBadge status={reservationStatus} />
      )}

      {/* 🔹 CONTINUE BUTTON */}
      <TouchableOpacity
        disabled={!isValid}
        style={[styles.button, !isValid && { opacity: 0.5 }]}
        onPress={handleReservation}
      >
        <Text style={styles.buttonText}>
          {t("reservation.continue") || "Continue"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  dateBox: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  dateText: {
    ...typography.textSm,
  },
  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  slot: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  slotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotText: {
    ...typography.textSm,
  },
  slotTextActive: {
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: "center",
    marginTop: spacing.md,
  },
  buttonText: {
    color: colors.white,
    ...typography.button,
  },
  error: {
    color: colors.rose,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
});
