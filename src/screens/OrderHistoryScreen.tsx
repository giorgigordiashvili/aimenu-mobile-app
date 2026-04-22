import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  StatusBar,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, typography, borderRadius } from "../theme";
import { getOrderHistory } from "../services";
import { useAuth } from "../context/AuthContext";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import StarIcon from "../assets/icons/StarIcon";
import DocumentIcon from "../assets/icons/DocumentIcon";
import CalendarIcon from "../assets/icons/CalendarIcon";
import { textColors } from "../theme/colors";

const MOCK_ITEMS = [
  { name: "სპეციალური კერძი", quantity: 1, price: 25.0 },
  { name: "სადღერი კერძი", quantity: 3, price: 18.0 },
  { name: "სექი ხარჩი", quantity: 1, price: 12.0 },
];

const MOCK_ORDER_BASE = {
  restaurant_name: "შავი ლომი",
  restaurant_city: "თბილისი",
  restaurant_type: "ქართული ფიუჟენი",
  restaurant_rating: 4.8,
  items_count: 2,
  restaurant_image: require("../assets/images/RestaurantListBackground.png"),
  reservation_date: "25 Nov, 2025",
  reservation_time: "13:00PM",
  guest_count: 2,
  items: MOCK_ITEMS,
  deposit: 10,
};

const MOCK_ORDERS = [1, 2, 3, 4].map((id) => ({
  id,
  order_number: `preview-${id}`,
  ...MOCK_ORDER_BASE,
}));

const OrderHistoryScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { token } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    loadOrders();
  }, [token]);

  const loadOrders = async () => {
    if (!token) {
      setOrders(MOCK_ORDERS);
      setLoading(false);
      return;
    }

    try {
      const data = await getOrderHistory(token);
      setOrders(data.results || []);
    } catch (error) {
      console.error("Failed to load order history:", error);
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getTagText = (item: any) => {
    const dishCount = Number(item?.items_count ?? item?.items?.length);
    if (Number.isFinite(dishCount) && dishCount > 0) {
      const suffix = t("orderHistory.tag").replace(/^\d+\s*/, "");
      return `${dishCount} ${suffix}`;
    }

    return t("orderHistory.tag");
  };

  const getSubtitle = (item: any) => {
    const location =
      item.restaurant_city ||
      item.city ||
      t("orderHistory.cardBio").split(" • ")[0];
    const cuisine =
      item.restaurant_category_name ||
      item.restaurant_cuisine ||
      item.restaurant_type ||
      t("orderHistory.cardBio").split(" • ")[1] ||
      "";

    return `${location} • ${cuisine}`;
  };

  const getRatingText = (item: any) => {
    const rating = Number(item.restaurant_rating ?? item.rating);
    if (Number.isFinite(rating) && rating > 0) {
      return rating.toFixed(1);
    }

    return "4.8";
  };

  const getImageSource = (item: any) => {
    const imageSource = item.restaurant_logo || item.restaurant_image;

    if (!imageSource) {
      return require("../assets/images/RestaurantListBackground.png");
    }

    if (typeof imageSource === "string") {
      return { uri: imageSource };
    }

    return imageSource;
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => setSelectedOrder(item)}
    >
      <Image source={getImageSource(item)} style={styles.image} />

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {item.restaurant_name || t("orderHistory.cardTitle")}
          </Text>

          <View style={styles.statusPill}>
            <Text style={styles.status}>{getTagText(item)}</Text>
          </View>
        </View>

        <Text style={styles.subtitle} numberOfLines={1}>
          {getSubtitle(item)}
        </Text>

        <View style={styles.ratingPill}>
          <Text style={styles.ratingText}>{getRatingText(item)}</Text>
          <StarIcon />
        </View>
      </View>
    </TouchableOpacity>
  );

  const listHeader = () => (
    <View style={styles.headerWrap}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <BackArrowIcon />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>{t("orderHistory.title")}</Text>

        <View style={styles.topBarSpacer} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        contentContainerStyle={[
          styles.list,
          orders.length === 0 && styles.emptyListContent,
        ]}
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <DocumentIcon />
            </View>
            <Text style={styles.emptyText}>{t("orderHistory.empty")}</Text>
          </View>
        }
      />

      <Modal
        visible={selectedOrder !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSelectedOrder(null)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {t("orderHistory.detailsTitle")}
            </Text>

            {selectedOrder && (
              <ScrollView
                contentContainerStyle={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Restaurant header */}
                <View style={styles.modalRestaurantRow}>
                  <Image
                    source={getImageSource(selectedOrder)}
                    style={styles.modalRestaurantImage}
                  />
                  <View style={styles.modalRestaurantInfo}>
                    <Text style={styles.modalRestaurantName}>
                      {selectedOrder.restaurant_name}
                    </Text>
                    <Text style={styles.modalRestaurantMeta}>
                      {getSubtitle(selectedOrder)}
                    </Text>
                    <View style={styles.ratingPill}>
                      <Text style={styles.ratingText}>
                        {getRatingText(selectedOrder)}
                      </Text>
                      <StarIcon />
                    </View>
                  </View>
                </View>

                {/* Reservation details */}
                <View style={styles.sectionHeader}>
                  <CalendarIcon />
                  <Text style={styles.sectionTitle}>
                    {t("cart.reservationDetails")}
                  </Text>
                </View>

                <View style={styles.metaCard}>
                  <View style={styles.metaRow}>
                    <View style={styles.metaCol}>
                      <Text style={styles.metaLabel}>
                        {t("cart.dateLabel")}
                      </Text>
                      <Text style={styles.metaValue}>
                        {selectedOrder.reservation_date}
                      </Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaCol}>
                      <Text style={styles.metaLabel}>
                        {t("cart.timeLabel")}
                      </Text>
                      <Text style={styles.metaValue}>
                        {selectedOrder.reservation_time}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.metaSeparator} />
                  <View style={styles.metaSingleRow}>
                    <Text style={styles.metaLabel}>
                      {t("cart.guestLabel")}
                    </Text>
                    <Text style={styles.metaValue}>
                      {selectedOrder.guest_count} პერსონა
                    </Text>
                  </View>
                </View>

                {/* Selected dishes */}
                <View style={styles.sectionHeader}>
                  <DocumentIcon />
                  <Text style={styles.sectionTitle}>
                    {t("orderHistory.selectedDishes")}
                  </Text>
                </View>

                <View style={styles.metaCard}>
                  {(selectedOrder.items ?? []).map(
                    (line: any, idx: number) => {
                      const rowTotal = line.price * line.quantity;
                      const isLast =
                        idx === (selectedOrder.items ?? []).length - 1;
                      return (
                        <View
                          key={`${line.name}-${idx}`}
                          style={[
                            styles.itemRow,
                            !isLast && styles.itemRowDivider,
                          ]}
                        >
                          <View style={styles.itemLeft}>
                            <View style={styles.quantityBadge}>
                              <Text style={styles.quantityBadgeText}>
                                {line.quantity}x
                              </Text>
                            </View>
                            <Text
                              style={styles.itemName}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {line.name}
                            </Text>
                          </View>
                          <Text style={styles.itemPrice}>
                            {rowTotal.toFixed(2)} ₾
                          </Text>
                        </View>
                      );
                    },
                  )}
                  <View style={styles.summaryRowInCard}>
                    <Text style={styles.summaryLabelStrong}>
                      {t("cart.subtotal")}
                    </Text>
                    <Text style={styles.summaryValueStrong}>
                      {computeSubtotal(selectedOrder).toFixed(2)} ₾
                    </Text>
                  </View>
                </View>

                {/* Payment summary */}
                <Text style={styles.paymentSummaryTitle}>
                  {t("orderHistory.paymentSummary")}
                </Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {t("cart.deposit")}
                  </Text>
                  <Text style={styles.summaryValue}>
                    {(selectedOrder.deposit ?? 0).toFixed(2)} ₾
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {t("cart.subtotal")}
                  </Text>
                  <Text style={styles.summaryValue}>
                    {computeSubtotal(selectedOrder).toFixed(2)} ₾
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>{t("cart.total")}</Text>
                  <Text style={styles.totalValue}>
                    {(
                      computeSubtotal(selectedOrder) +
                      (selectedOrder.deposit ?? 0)
                    ).toFixed(2)}{" "}
                    ₾
                  </Text>
                </View>

                <TouchableOpacity style={styles.helpButton}>
                  <Text style={styles.helpButtonText}>
                    {t("orderHistory.help")}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

function computeSubtotal(order: any): number {
  const items: any[] = order.items ?? [];
  return items.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
  },

  loadingWrap: {
    flex: 1,
    backgroundColor: colors.state50,
    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.state50,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  headerWrap: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.md,
  },

  topBar: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  topBarSpacer: {
    width: 44,
    height: 44,
  },

  screenTitle: {
    ...typography.textSm,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xmd,
    borderWidth: 1,
    borderColor: colors.light,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    backgroundColor: colors.grey,
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },

  name: {
    ...typography.buttonLg,
    color: colors.dark,
    marginRight: spacing.sm,
    flex: 1,
  },

  statusPill: {
    backgroundColor: colors.dangerSoftBackground,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.error2,
  },

  status: {
    ...typography.buttonSm,
    color: colors.rose,
  },

  subtitle: {
    ...typography.textXs,
    color: colors.gray500,
    marginBottom: spacing.sm,
  },

  ratingPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light,
    gap: spacing.xs,
  },

  ratingText: {
    ...typography.textSm,
    color: colors.dark,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: spacing.xxl,
  },

  emptyIconWrap: {
    width: 112,
    height: 112,
    borderRadius: borderRadius.full,
    backgroundColor: colors.state100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },

  emptyText: {
    ...typography.button,
    color: colors.gray500,
    textAlign: "center",
    maxWidth: 240,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: "90%",
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  modalHandle: {
    width: 60,
    height: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light,
    alignSelf: "center",
    marginBottom: spacing.md,
  },

  modalTitle: {
    ...typography.textLg,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    textAlign: "center",
    marginBottom: spacing.md,
  },

  modalContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },

  modalRestaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  modalRestaurantImage: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    backgroundColor: colors.grey,
  },

  modalRestaurantInfo: {
    flex: 1,
    minWidth: 0,
  },

  modalRestaurantName: {
    ...typography.buttonLg,
    color: colors.dark,
    marginBottom: 2,
  },

  modalRestaurantMeta: {
    ...typography.textXs,
    color: colors.gray500,
    marginBottom: spacing.xs,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  sectionTitle: {
    ...typography.textSm,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    marginLeft: spacing.sm,
  },

  metaCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  metaCol: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  metaDivider: {
    width: 1,
    backgroundColor: colors.light,
  },

  metaSeparator: {
    height: 1,
    backgroundColor: colors.light,
  },

  metaSingleRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  metaLabel: {
    ...typography.textXs,
    color: textColors.tertiary,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  metaValue: {
    ...typography.textSm,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  itemRowDivider: {
    borderBottomWidth: 1,
    borderColor: colors.light,
  },

  itemLeft: {
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

  itemName: {
    ...typography.buttonSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.darkGrey,
    flex: 1,
    minWidth: 0,
  },

  itemPrice: {
    ...typography.buttonSm,
    fontWeight: typography.h2.fontWeight,
    color: colors.darkGrey,
  },

  summaryRowInCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.light,
  },

  summaryLabelStrong: {
    ...typography.button,
    color: colors.gray600,
  },

  summaryValueStrong: {
    ...typography.button,
    fontWeight: typography.buttonLg.fontWeight,
    color: colors.dark,
  },

  paymentSummaryTitle: {
    ...typography.h4,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    marginTop: spacing.md,
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
    color: colors.dark,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: colors.light,
    marginVertical: spacing.sm,
  },

  totalLabel: {
    ...typography.h3,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
  },

  totalValue: {
    ...typography.text2xl,
    fontWeight: typography.h1.fontWeight,
    color: colors.primary,
  },

  helpButton: {
    marginTop: spacing.lg,
    height: 48,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  helpButtonText: {
    ...typography.button,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },
});
