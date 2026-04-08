import React from "react";
import {
  Alert,
  Animated,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { colors, spacing, borderRadius, typography } from "../theme";
import { textColors } from "../theme/colors";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";
import StarIcon from "../assets/icons/StarIcon";
import ShieldIcon from "../assets/icons/ShieldIcon";
import { GuestCounter } from "../components/reservation/GuestCounter";
import { DateChip } from "../components/reservation/DateChip";
import { TimeSlotChip } from "../components/reservation/TimeSlotChip";
import { DatePickerModal } from "../components/reservation/DatePickerModal";
import { TimeSlotModal, Slot } from "../components/reservation/TimeSlotModal";
import { PrimaryCTA } from "../components/reservation/PrimaryCTA";
import { createReservation, getAvailability } from "../services/reservations";
import { useAuth } from "../context/AuthContext";

const RESERVATION_DEPOSIT = 10;

export default function ReservationScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { token, user } = useAuth();

  const { slug, name, cuisine_type, rating, cover_image } =
    useLocalSearchParams<{
      slug: string;
      name: string;
      cuisine_type: string;
      rating: string;
      cover_image: string;
    }>();

  const [guests, setGuests] = React.useState(2);

  const todayIso = React.useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const [selectedDate, setSelectedDate] = React.useState<string>(todayIso);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [slots, setSlots] = React.useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);

  const ctaTranslateY = React.useRef(new Animated.Value(0)).current;
  const ctaOpacity = React.useRef(new Animated.Value(1)).current;
  const lastScrollY = React.useRef(0);
  const isCtaVisible = React.useRef(true);

  React.useEffect(() => {
    if (!slug || !token) return;

    let cancelled = false;
    setLoadingSlots(true);
    setSelectedTime(null);

    getAvailability(token, slug, selectedDate, guests)
      .then((data) => {
        if (cancelled) return;
        console.log("[Availability] raw response:", JSON.stringify(data));
        const raw: any[] = Array.isArray(data)
          ? data
          : (data.slots ??
            data.time_slots ??
            data.available_slots ??
            data.results ??
            data.available_times ??
            data.times ??
            []);
        console.log("[Availability] parsed slots:", raw);
        setSlots(
          raw.map((s) => ({
            time: s.time ?? s.start_time ?? s.slot ?? s,
            available: s.available !== undefined ? Boolean(s.available) : true,
          })),
        );
      })
      .catch((err) => {
        console.log("[Availability] error:", err?.message);
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, guests, slug, token]);

  const displayDate = React.useMemo(() => {
    const [y, mo, d] = selectedDate.split("-").map(Number);
    const date = new Date(y, mo - 1, d);
    return date.toLocaleDateString(i18n.language === "ka" ? "ka-GE" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [selectedDate, i18n.language]);

  const showCta = React.useCallback(() => {
    if (isCtaVisible.current) return;
    isCtaVisible.current = true;
    Animated.parallel([
      Animated.timing(ctaTranslateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [ctaOpacity, ctaTranslateY]);

  const hideCta = React.useCallback(() => {
    if (!isCtaVisible.current) return;
    isCtaVisible.current = false;
    Animated.parallel([
      Animated.timing(ctaTranslateY, {
        toValue: 120,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(ctaOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [ctaOpacity, ctaTranslateY]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const delta = currentY - lastScrollY.current;
    if (currentY <= 0) {
      showCta();
      lastScrollY.current = currentY;
      return;
    }
    if (delta > 6) hideCta();
    else if (delta < -6) showCta();
    lastScrollY.current = currentY;
  };

  const handleReserve = async () => {
    if (!token) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }
    if (!slug) {
      Alert.alert("Error", "No restaurant selected.");
      return;
    }
    if (!selectedTime) {
      Alert.alert("Error", "Please select a time slot.");
      return;
    }

    const payload = {
      restaurant_slug: slug,
      reservation_date: selectedDate,
      reservation_time: selectedTime,
      party_size: guests,
      guest_name: user ? `${user.first_name} ${user.last_name}`.trim() : "",
      guest_email: user?.email ?? "",
      guest_phone: user?.phone ?? "",
    };

    try {
      await createReservation(token, payload, slug);
      router.push("/reservation-success");
    } catch (err: any) {
      Alert.alert("Reservation failed", err.message);
    }
  };

  const parsedRating = rating ? parseFloat(rating) : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("cart.reservationTitle")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Restaurant info card */}
        <View style={styles.restaurantCard}>
          {cover_image ? (
            <Image
              source={{ uri: cover_image }}
              style={styles.restaurantImage}
            />
          ) : (
            <View
              style={[
                styles.restaurantImage,
                styles.restaurantImagePlaceholder,
              ]}
            />
          )}

          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName} numberOfLines={1}>
              {name ?? ""}
            </Text>
            {cuisine_type ? (
              <Text style={styles.restaurantCuisine} numberOfLines={1}>
                {cuisine_type}
              </Text>
            ) : null}
            {parsedRating !== null ? (
              <View style={styles.ratingBadge}>
                <StarIcon />
                <Text style={styles.ratingText}>{parsedRating.toFixed(1)}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <CalendarIcon />
          <Text style={styles.sectionTitle}>
            {t("cart.reservationDetails")}
          </Text>
        </View>

        {/* Date / Time / Guests card */}
        <View style={styles.reservationRow}>
          <DateChip
            label={t("cart.dateLabel")}
            value={displayDate}
            onPress={() => setDatePickerOpen(true)}
          />
          <TimeSlotChip
            label={t("cart.timeLabel")}
            value={
              loadingSlots
                ? "..."
                : selectedTime
                  ? selectedTime.substring(0, 5)
                  : t("cart.timePlaceholder")
            }
            style={styles.timeChipSpacing}
            onPress={() => setTimePickerOpen(true)}
          />
        </View>

        <GuestCounter
          value={guests}
          min={1}
          max={20}
          onChange={setGuests}
          title={t("cart.guestLabel")}
        />

        <View style={styles.spacer} />

        {/* Total section */}
        <View style={styles.totalSection}>
          <Text style={styles.totalSectionTitle}>{t("cart.tax")}</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t("cart.deposit")}</Text>
            <Text style={styles.summaryValue}>
              {RESERVATION_DEPOSIT.toFixed(2)} ₾
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t("cart.total")}</Text>
            <Text style={styles.totalValue}>
              {RESERVATION_DEPOSIT.toFixed(2)} ₾
            </Text>
          </View>

          <View style={styles.safeRow}>
            <ShieldIcon />
            <Text style={styles.safeText}>{t("cart.safe")}</Text>
          </View>
        </View>
      </ScrollView>

      <Animated.View
        style={[
          styles.ctaContainer,
          { opacity: ctaOpacity, transform: [{ translateY: ctaTranslateY }] },
        ]}
      >
        <PrimaryCTA
          label={t("cart.button")}
          onPress={handleReserve}
          loading={false}
        />
      </Animated.View>

      <DatePickerModal
        visible={datePickerOpen}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        onClose={() => setDatePickerOpen(false)}
        title={t("cart.dateLabel")}
      />

      <TimeSlotModal
        visible={timePickerOpen}
        title={t("cart.timeLabel")}
        slots={slots}
        selectedTime={selectedTime}
        loading={loadingSlots}
        onSelect={setSelectedTime}
        onClose={() => setTimePickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
    paddingTop: spacing.xl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },

  headerSpacer: {
    width: 44,
    height: 44,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: 132,
  },

  // Restaurant card
  restaurantCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  restaurantImage: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.light,
  },

  restaurantImagePlaceholder: {
    backgroundColor: colors.grey,
  },

  restaurantInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  restaurantName: {
    ...typography.h3,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    marginBottom: spacing.xs,
  },

  restaurantCuisine: {
    ...typography.textSm,
    color: textColors.secondary,
    marginBottom: spacing.sm,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.state100,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },

  ratingText: {
    ...typography.buttonSm,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
  },

  divider: {
    height: 1,
    backgroundColor: colors.light,
    marginBottom: spacing.lg,
  },

  // Section
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  sectionTitle: {
    ...typography.textSm,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    marginLeft: spacing.sm,
  },

  // Details card
  detailsCard: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },

  reservationRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },

  timeChipSpacing: {
    marginLeft: spacing.sm,
  },

  spacer: {
    flex: 1,
  },

  // Total section
  totalSection: {
    borderTopWidth: 1,
    borderColor: colors.light,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },

  totalSectionTitle: {
    ...typography.h4,
    fontWeight: typography.h1.fontWeight,
    color: colors.gray900,
    marginBottom: spacing.md,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  summaryLabel: {
    ...typography.textSm,
    color: colors.gray600,
  },

  summaryValue: {
    ...typography.textSm,
    color: colors.gray800,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: colors.light,
    marginVertical: spacing.sm,
  },

  totalLabel: {
    ...typography.h3,
    fontWeight: typography.h1.fontWeight,
    color: colors.gray900,
  },

  totalValue: {
    ...typography.text2xl,
    fontWeight: typography.h1.fontWeight,
    color: colors.primary,
  },

  safeRow: {
    marginTop: spacing.md,
    backgroundColor: colors.privacyBackground,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },

  safeText: {
    ...typography.textXs,
    color: colors.privacyText,
    marginLeft: spacing.sm,
  },

  // CTA
  ctaContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.state50,
  },
});
