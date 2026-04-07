import React from "react";
import {
  Alert,
  Animated,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { useCart } from "../context/CartContext";
import { colors, spacing, borderRadius, typography } from "../theme";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";
import DropdownArrow from "../assets/icons/DropdownArrow";
import CardArrow from "../assets/icons/CardArrow";
import { textColors } from "../theme/colors";
import EditIcon from "../assets/icons/EditIcon";
import ShieldIcon from "../assets/icons/ShieldIcon";
import { GuestCountSelector } from "../components/reservation/GuestCountSelector";
import { createReservation } from "../services/reservations";
import { useAuth } from "../context/AuthContext";

export default function OrderReviewScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { items, totalPrice, updateQuantity, restaurantSlug } = useCart();
  const [guests, setGuests] = React.useState(2);
  const [reservationError, setReservationError] = React.useState<string | null>(
    null,
  );

  const ctaTranslateY = React.useRef(new Animated.Value(0)).current;
  const ctaOpacity = React.useRef(new Animated.Value(1)).current;
  const lastScrollY = React.useRef(0);
  const isCtaVisible = React.useRef(true);

  const reservationDeposit = 10;
  const grandTotal = totalPrice + reservationDeposit;

  const { token, user } = useAuth();

  const handleReservation = async () => {
    if (!token) {
      Alert.alert("Error", "You must be logged in to make a reservation.");
      return;
    }

    if (!restaurantSlug) {
      Alert.alert("Error", "No restaurant selected.");
      return;
    }

    setReservationError(null);

    console.log("[Reservation] slug:", restaurantSlug, "user:", user?.email);

    try {
      await createReservation(token, {
        restaurant_slug: restaurantSlug,
        reservation_date: new Date().toISOString().split("T")[0],
        reservation_time: "19:00:00",
        party_size: guests,
        guest_name: user ? `${user.first_name} ${user.last_name}`.trim() : "",
        guest_email: user?.email ?? "",
      });

      router.push("/reservation-success");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Reservation failed";

      if (message.includes("404")) {
        Alert.alert("Error (404)", message);
      } else if (message === "SESSION_EXPIRED") {
        router.replace("/login");
      } else {
        setReservationError(message);
        Alert.alert("Error", message);
      }
    }
  };

  const displayDate = new Date().toLocaleDateString(
    i18n.language === "ka" ? "ka-GE" : "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

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

    if (delta > 6) {
      hideCta();
    } else if (delta < -6) {
      showCta();
    }

    lastScrollY.current = currentY;
  };

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>{t("cart.empty")}</Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.emptyActionBtn}
        >
          <Text style={styles.emptyActionText}>{t("cart.browseMenu")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackArrowIcon />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t("cart.orderReview")}</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.sectionHeader}>
          <CalendarIcon />
          <Text style={styles.sectionTitle}>
            {t("cart.reservationDetails")}
          </Text>
        </View>

        <View style={styles.firstCard}>
          <View style={styles.reservationRow}>
            <View style={styles.detailTile}>
              <View style={styles.tileLabelRow}>
                <Text style={styles.tileLabel}>{t("cart.dateLabel")}</Text>
              </View>

              <Text style={styles.tileValue}>{displayDate}</Text>
            </View>

            <View style={[styles.detailTile, styles.detailTileSpacing]}>
              <View style={styles.tileLabelRow}>
                <Text style={styles.tileLabel}>{t("cart.timeLabel")}</Text>
              </View>

              <View style={styles.timeValueRow}>
                <Text style={styles.tileValue}>
                  {t("cart.timePlaceholder")}
                </Text>
                <DropdownArrow />
              </View>
            </View>
          </View>

          <GuestCountSelector
            value={guests}
            min={1}
            max={20}
            onChange={setGuests}
            label={t("cart.guestLabel")}
          />
        </View>

        <View style={[styles.sectionHeader, styles.itemsSectionHeader]}>
          <CalendarIcon />
          <Text style={styles.sectionTitle}>{t("cart.browseMenu")}</Text>
        </View>

        <View style={styles.card}>
          {items.map((item, index) => {
            const modifierTotal = item.modifiers.reduce(
              (sum, mod) => sum + mod.price,
              0,
            );
            const rowTotal = (item.price + modifierTotal) * item.quantity;

            return (
              <View
                key={item.itemId}
                style={[
                  styles.itemRow,
                  index !== items.length - 1 && styles.itemRowDivider,
                ]}
              >
                <View style={styles.itemLeftBlock}>
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityBadgeText}>
                      {item.quantity}x
                    </Text>
                  </View>

                  <View style={styles.itemTextWrap}>
                    <Text
                      style={styles.itemName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>

                    {item.modifiers.map((mod) => (
                      <Text key={mod.modifierId} style={styles.modifier}>
                        - {mod.name}
                      </Text>
                    ))}
                  </View>
                </View>

                <View style={styles.itemRightBlock}>
                  <Text style={styles.price}>{rowTotal.toFixed(2)} ₾</Text>

                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(item.itemId, item.quantity + 1)
                    }
                    style={styles.itemEditButton}
                  >
                    <EditIcon />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <View style={styles.itemsSummaryRow}>
            <Text style={styles.itemsSummaryLabel}>{t("cart.subtotal")}</Text>
            <Text style={styles.itemsSummaryValue}>
              {totalPrice.toFixed(2)} ₾
            </Text>
          </View>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalSectionTitle}>{t("cart.tax")}</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t("cart.deposit")}</Text>
            <Text style={styles.summaryValue}>
              {reservationDeposit.toFixed(2)} ₾
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t("cart.subtotal")}</Text>
            <Text style={styles.summaryValue}>{totalPrice.toFixed(2)} ₾</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t("cart.total")}</Text>
            <Text style={styles.totalValue}>{grandTotal.toFixed(2)} ₾</Text>
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
          {
            opacity: ctaOpacity,
            transform: [{ translateY: ctaTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.orderButton}
          onPress={handleReservation}
        >
          <Text style={styles.orderText}>{t("cart.button")}</Text>
          <CardArrow color={colors.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
    paddingTop: spacing.xl,
  },

  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: 132,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    ...typography.textBase,
    color: colors.dark,
  },

  emptyActionBtn: {
    marginTop: spacing.sm,
  },

  emptyActionText: {
    ...typography.button,
    color: colors.primary,
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

  sectionTitle: {
    ...typography.textSm,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    marginLeft: spacing.sm,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  itemsSectionHeader: {
    marginTop: spacing.xl,
  },

  firstCard: {},

  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light,
    overflow: "hidden",
  },

  reservationRow: {
    flexDirection: "row",
    padding: spacing.sm,
  },

  detailTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },

  detailTileSpacing: {
    marginLeft: spacing.sm,
  },

  tileLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  tileLabel: {
    ...typography.textXs,
    color: textColors.tertiary,
  },

  tileValue: {
    ...typography.textSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.dark,
  },

  timeValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },

  itemRowDivider: {
    borderBottomWidth: 1,
    borderColor: colors.light,
  },

  itemLeftBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.sm,
  },

  quantityBadge: {
    minWidth: 24,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLightest,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xs,
    marginRight: spacing.sm,
  },

  quantityBadgeText: {
    ...typography.buttonSm,
    color: colors.primary,
    fontWeight: typography.h1.fontWeight,
  },

  itemTextWrap: {
    flex: 1,
    minWidth: 0,
  },

  itemName: {
    ...typography.buttonSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.darkGrey,
  },

  modifier: {
    ...typography.textXs,
    color: colors.gray500,
    marginTop: spacing.xs,
  },

  itemRightBlock: {
    display: "flex",
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },

  price: {
    ...typography.buttonSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.darkGrey,
  },

  itemEditButton: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.state100,
    alignItems: "center",
    justifyContent: "center",
  },

  itemsSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xmd,
    paddingVertical: spacing.xmd,
    borderTopWidth: 1,
    borderColor: colors.light,
  },

  itemsSummaryLabel: {
    ...typography.button,
    color: colors.gray600,
    fontWeight: typography.button.fontWeight,
  },

  itemsSummaryValue: {
    ...typography.button,
    fontWeight: typography.buttonLg.fontWeight,
    color: colors.dark,
  },

  totalSection: {
    marginTop: spacing.xxxl,
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

  ctaContainer: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: 0,
    marginVertical: spacing.md,
    backgroundColor: "transparent",
  },

  orderButton: {
    backgroundColor: colors.greenButtonBackground,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  orderText: {
    color: colors.white,
    ...typography.buttonLg,
    fontWeight: typography.h1.fontWeight,
    marginRight: spacing.sm,
  },
});
