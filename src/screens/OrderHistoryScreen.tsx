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
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, spacing, typography, borderRadius } from "../theme";
import { getOrderHistory } from "../services";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import StarIcon from "../assets/icons/StarIcon";
import DocumentIcon from "../assets/icons/DocumentIcon";

const MOCK_ORDERS = [
  {
    id: 1,
    order_number: "preview-1",
    restaurant_name: "შავი ლომი",
    restaurant_city: "თბილისი",
    restaurant_type: "ქართული ფიუჟენი",
    restaurant_rating: 4.8,
    items_count: 2,
    restaurant_image: require("../assets/images/RestaurantListBackground.png"),
  },
  {
    id: 2,
    order_number: "preview-2",
    restaurant_name: "შავი ლომი",
    restaurant_city: "თბილისი",
    restaurant_type: "ქართული ფიუჟენი",
    restaurant_rating: 4.8,
    items_count: 2,
    restaurant_image: require("../assets/images/RestaurantListBackground.png"),
  },
  {
    id: 3,
    order_number: "preview-3",
    restaurant_name: "შავი ლომი",
    restaurant_city: "თბილისი",
    restaurant_type: "ქართული ფიუჟენი",
    restaurant_rating: 4.8,
    items_count: 2,
    restaurant_image: require("../assets/images/RestaurantListBackground.png"),
  },
  {
    id: 4,
    order_number: "preview-4",
    restaurant_name: "შავი ლომი",
    restaurant_city: "თბილისი",
    restaurant_type: "ქართული ფიუჟენი",
    restaurant_rating: 4.8,
    items_count: 2,
    restaurant_image: require("../assets/images/RestaurantListBackground.png"),
  },
];

const OrderHistoryScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const token = "REPLACE_WITH_REAL_TOKEN";

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const hasRealToken = token !== "REPLACE_WITH_REAL_TOKEN";

    if (!hasRealToken) {
      setOrders(MOCK_ORDERS);
      setLoading(false);
      return;
    }

    try {
      const data = await getOrderHistory(token);
      setOrders(data.results || []);
    } catch (error) {
      console.log(error);
      // Keep a stable preview state when backend/auth is not ready yet.
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
      onPress={() =>
        router.push({
          pathname: "/order-detail",
          params: { orderNumber: item.order_number },
        })
      }
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
    </View>
  );
};

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
});
