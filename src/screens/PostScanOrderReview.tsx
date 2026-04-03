import { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, spacing, typography, borderRadius } from "../theme";
import { textColors } from "../theme/colors";
import { useTranslation } from "react-i18next";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";
import CardArrow from "../assets/icons/CardArrow";
import ShieldIcon from "../assets/icons/ShieldIcon";

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends MenuItem {
  qty: number;
}

export default function PostScanOrderReview() {
  const { tableSessionId, restaurantSlug, tableNumber } =
    useLocalSearchParams();

  const router = useRouter();
  const { t } = useTranslation();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const ctaTranslateY = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);
  const isCtaVisible = useRef(true);

  useEffect(() => {
    if (!restaurantSlug) {
      console.error("restaurantSlug is undefined. Cannot fetch menu.");
      setLoading(false);
      return;
    }
    fetchMenu();
  }, [restaurantSlug]);

  const fetchMenu = async () => {
    if (!restaurantSlug) {
      console.error("restaurantSlug is undefined. Cannot fetch menu.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `https://admin.aimenu.ge/api/restaurants/${restaurantSlug}/menu/`,
      );
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        const text = await res.text();
        console.error(
          `Menu fetch failed: ${res.status} ${res.statusText}\n${text}`,
        );
        setFetchError(`${res.status} ${res.statusText}`);
        return;
      }
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        const items = data.results ?? (Array.isArray(data) ? data : []);
        setMenuItems(items);
        if (items.length === 0) {
          setFetchError(`No menu items returned for "${restaurantSlug}"`);
        }
      } else {
        const text = await res.text();
        setFetchError("Unexpected response (not JSON)");
        console.error("Menu fetch did not return JSON:", text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0),
    );
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const showCta = useCallback(() => {
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

  const hideCta = useCallback(() => {
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

  const placeOrder = async () => {
    try {
      const res = await fetch("https://admin.aimenu.ge/api/orders/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_session: tableSessionId,
          items: cart.map((c) => ({
            menu_item: c.id,
            quantity: c.qty,
          })),
        }),
      });
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        console.error("STATUS:", res.status);
        console.error("STATUS TEXT:", res.statusText);
        const text = await res.text();
        console.error("RESPONSE BODY:", text);
        return;
      }
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        router.push({
          pathname: "/postScanPayment",
          params: { orderId: data.id },
        });
      } else {
        const text = await res.text();
        console.error("Order response was not JSON:", text);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>{t("qr-scanner.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackArrowIcon />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t("postScanOrder.title")}</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* MENU SECTION */}
        <View style={styles.sectionHeader}>
          <CalendarIcon />
          <Text style={styles.sectionTitle}>
            {t("postScanOrder.selectedItems")}
          </Text>
        </View>

        <View style={styles.card}>
          {fetchError && menuItems.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>{fetchError}</Text>
            </View>
          )}
          {menuItems.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index !== menuItems.length - 1 && styles.itemRowDivider,
              ]}
            >
              <View style={styles.itemLeftBlock}>
                <View style={styles.itemTextWrap}>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
              </View>

              <View style={styles.itemRightBlock}>
                <Text style={styles.price}>{item.price.toFixed(2)} ₾</Text>

                <TouchableOpacity
                  onPress={() => addToCart(item)}
                  style={styles.addBtn}
                >
                  <Text style={styles.addText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* SELECTED ITEMS SECTION */}
        {cart.length > 0 && (
          <>
            <View style={[styles.sectionHeader, styles.cartSectionHeader]}>
              <CalendarIcon />
              <Text style={styles.sectionTitle}>
                {t("postScanOrder.selectedItems")}
              </Text>
            </View>

            <View style={styles.card}>
              {cart.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.itemRow,
                    index !== cart.length - 1 && styles.itemRowDivider,
                  ]}
                >
                  <View style={styles.itemLeftBlock}>
                    <View style={styles.quantityBadge}>
                      <Text style={styles.quantityBadgeText}>{item.qty}x</Text>
                    </View>

                    <View style={styles.itemTextWrap}>
                      <Text
                        style={styles.itemName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.itemRightBlock}>
                    <Text style={styles.price}>
                      {(item.price * item.qty).toFixed(2)} ₾
                    </Text>

                    <View style={styles.qtyControls}>
                      <TouchableOpacity
                        onPress={() => updateQty(item.id, -1)}
                        style={styles.qtyButton}
                      >
                        <Text style={styles.qtySymbol}>-</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => updateQty(item.id, 1)}
                        style={[styles.qtyButton, styles.qtyButtonPrimary]}
                      >
                        <Text
                          style={[styles.qtySymbol, styles.qtySymbolPrimary]}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              <View style={styles.itemsSummaryRow}>
                <Text style={styles.itemsSummaryLabel}>
                  {t("cart.subtotal")}
                </Text>
                <Text style={styles.itemsSummaryValue}>
                  {total.toFixed(2)} ₾
                </Text>
              </View>
            </View>

            <View style={styles.totalSection}>
              <Text style={styles.totalSectionTitle}>
                {t("postScanOrder.tax")}
              </Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t("cart.subtotal")}</Text>
                <Text style={styles.summaryValue}>{total.toFixed(2)} ₾</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>{t("cart.total")}</Text>
                <Text style={styles.totalValue}>{total.toFixed(2)} ₾</Text>
              </View>

              <View style={styles.safeRow}>
                <ShieldIcon />
                <Text style={styles.safeText}>{t("cart.safe")}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* CTA */}
      {cart.length > 0 && (
        <Animated.View
          style={[
            styles.ctaContainer,
            {
              opacity: ctaOpacity,
              transform: [{ translateY: ctaTranslateY }],
            },
          ]}
        >
          <TouchableOpacity style={styles.orderButton} onPress={placeOrder}>
            <Text style={styles.orderText}>{t("postScanOrder.payButton")}</Text>
            <CardArrow color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
      )}
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  cartSectionHeader: {
    marginTop: spacing.xl,
  },

  sectionTitle: {
    ...typography.textSm,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    marginLeft: spacing.sm,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light,
    overflow: "hidden",
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

  emptyCard: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: "center",
  },

  emptyCardText: {
    ...typography.textSm,
    color: colors.placeholder,
    textAlign: "center",
  },

  itemLeftBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.sm,
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

  itemRightBlock: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },

  price: {
    ...typography.buttonSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.darkGrey,
  },

  addBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.dangerSoftBackground,
    backgroundColor: colors.primaryLightest,
    alignItems: "center",
    justifyContent: "center",
  },

  addText: {
    ...typography.textLg,
    color: colors.primary,
    lineHeight: 22,
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

  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.quantityControlBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    marginLeft: spacing.sm,
  },

  qtyButtonPrimary: {
    borderColor: colors.dangerSoftBackground,
    backgroundColor: colors.primaryLightest,
  },

  qtySymbol: {
    ...typography.textLg,
    color: colors.quantityControlIcon,
    lineHeight: 22,
  },

  qtySymbolPrimary: {
    color: colors.primary,
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
