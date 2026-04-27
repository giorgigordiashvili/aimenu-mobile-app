import { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { borderRadius, colors, spacing, typography } from "../theme";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import StarIcon from "../assets/icons/StarIcon";
import { useAuth } from "../context/AuthContext";
import { getOrderDetail } from "../services";

interface OrderItem {
  id?: string | number;
  name?: string;
  item_name?: string;
  quantity?: number;
  price?: string | number;
  unit_price?: string | number;
  total?: string | number;
  subtotal?: string | number;
}

interface OrderDetail {
  order_number: string;
  status?: string;
  created_at?: string;
  restaurant_name?: string;
  restaurant_city?: string;
  restaurant_type?: string;
  restaurant_cuisine?: string;
  restaurant_rating?: number | string;
  restaurant_image?: string | null;
  restaurant_logo?: string | null;
  items?: OrderItem[];
  subtotal?: number | string;
  total_amount?: number | string;
  deposit?: number | string;
  service_fee?: number | string;
  tax?: number | string;
  wallet_amount?: number | string;
}

const STATUS_PALETTE: Record<string, { bg: string; fg: string }> = {
  pending: { bg: colors.warningLight, fg: colors.warning },
  processing: { bg: colors.warningLight, fg: colors.warning },
  confirmed: { bg: colors.accentGreenLight, fg: colors.success },
  in_progress: { bg: colors.accentGreenLight, fg: colors.success },
  ready: { bg: colors.accentGreenLight, fg: colors.success },
  completed: { bg: colors.state100, fg: colors.gray600 },
  delivered: { bg: colors.state100, fg: colors.gray600 },
  cancelled: { bg: colors.dangerSoftBackground, fg: colors.error },
  failed: { bg: colors.dangerSoftBackground, fg: colors.error },
};

const toNumber = (v: number | string | undefined | null) => {
  if (v == null || v === "") return 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (v: number | string | undefined | null) =>
  `${toNumber(v).toFixed(2)} ₾`;

export default function OrderDetailScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { token } = useAuth();
  const { orderNumber } = useLocalSearchParams<{ orderNumber?: string }>();

  const { data, isLoading, isRefetching, refetch, error } = useQuery<OrderDetail>(
    {
      queryKey: ["orders", "detail", orderNumber],
      queryFn: async () => {
        if (!token || !orderNumber) {
          throw new Error("missing");
        }
        return (await getOrderDetail(token, orderNumber)) as OrderDetail;
      },
      enabled: !!token && !!orderNumber,
      staleTime: 30_000,
      // Live status: poll every 30s while the order is still in-flight.
      refetchInterval: (q) => {
        const status = (q.state.data?.status ?? "").toLowerCase();
        const active = [
          "pending",
          "processing",
          "confirmed",
          "in_progress",
          "ready",
        ].includes(status);
        return active ? 30_000 : false;
      },
    },
  );

  const items = data?.items ?? [];

  const subtotal = useMemo(() => {
    if (data?.subtotal != null) return toNumber(data.subtotal);
    return items.reduce((sum, it) => {
      if (it.subtotal != null) return sum + toNumber(it.subtotal);
      if (it.total != null) return sum + toNumber(it.total);
      const unit = toNumber(it.unit_price ?? it.price);
      const qty = it.quantity ?? 1;
      return sum + unit * qty;
    }, 0);
  }, [data, items]);

  const total = data?.total_amount != null ? toNumber(data.total_amount) : null;
  const deposit = toNumber(data?.deposit);
  const serviceFee = toNumber(data?.service_fee);
  const tax = toNumber(data?.tax);
  const walletApplied = toNumber(data?.wallet_amount);

  const statusKey = (data?.status ?? "").toLowerCase();
  const palette = STATUS_PALETTE[statusKey];

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Intl.DateTimeFormat(i18n.language, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const subtitle = [
    data?.restaurant_city,
    data?.restaurant_type ?? data?.restaurant_cuisine,
  ]
    .filter(Boolean)
    .join(" • ");

  const rating = toNumber(data?.restaurant_rating);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {orderNumber
            ? t("orderDetail.orderNumber", { number: orderNumber })
            : t("orderHistory.detailsTitle")}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !data ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error || !data ? (
          <Text style={styles.empty}>{t("orderDetail.notFound")}</Text>
        ) : (
          <>
            {/* Status + meta */}
            <View style={styles.metaCard}>
              <View style={styles.metaTopRow}>
                {data.status && palette ? (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: palette.bg },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: palette.fg }]}>
                      {t(`orderDetail.status.${statusKey}`, {
                        defaultValue: data.status,
                      })}
                    </Text>
                  </View>
                ) : null}
                {data.created_at ? (
                  <Text style={styles.placedAt}>
                    {formatDate(data.created_at)}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.orderNumber}>#{data.order_number}</Text>
            </View>

            {/* Restaurant */}
            {data.restaurant_name ? (
              <View style={styles.restaurantCard}>
                {data.restaurant_image || data.restaurant_logo ? (
                  <Image
                    source={{
                      uri:
                        (data.restaurant_image as string) ||
                        (data.restaurant_logo as string),
                    }}
                    style={styles.restaurantImage}
                  />
                ) : (
                  <View
                    style={[styles.restaurantImage, styles.restaurantFallback]}
                  >
                    <Text style={styles.restaurantFallbackText}>
                      {data.restaurant_name.slice(0, 1).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName} numberOfLines={1}>
                    {data.restaurant_name}
                  </Text>
                  {subtitle ? (
                    <Text style={styles.restaurantSubtitle} numberOfLines={1}>
                      {subtitle}
                    </Text>
                  ) : null}
                </View>
                {rating > 0 ? (
                  <View style={styles.ratingPill}>
                    <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                    <StarIcon />
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* Items */}
            {items.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {t("orderHistory.selectedDishes")}
                </Text>
                {items.map((it, idx) => {
                  const name = it.name ?? it.item_name ?? "—";
                  const qty = it.quantity ?? 1;
                  const unit = toNumber(it.unit_price ?? it.price);
                  const lineTotal =
                    it.subtotal != null
                      ? toNumber(it.subtotal)
                      : it.total != null
                      ? toNumber(it.total)
                      : unit * qty;
                  return (
                    <View
                      key={String(it.id ?? idx)}
                      style={[
                        styles.itemRow,
                        idx > 0 && styles.itemRowDivider,
                      ]}
                    >
                      <View style={styles.qtyBadge}>
                        <Text style={styles.qtyText}>{qty}×</Text>
                      </View>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {name}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {formatMoney(lineTotal)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : null}

            {/* Payment summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t("orderHistory.paymentSummary")}
              </Text>
              <SummaryRow
                label={t("cart.subtotal")}
                value={formatMoney(subtotal)}
              />
              {deposit > 0 ? (
                <SummaryRow
                  label={t("cart.deposit")}
                  value={formatMoney(deposit)}
                />
              ) : null}
              {serviceFee > 0 ? (
                <SummaryRow
                  label={t("cart.serviceFee")}
                  value={formatMoney(serviceFee)}
                />
              ) : null}
              {tax > 0 ? (
                <SummaryRow label={t("cart.tax")} value={formatMoney(tax)} />
              ) : null}
              {walletApplied > 0 ? (
                <SummaryRow
                  label={t("referral.walletApplied")}
                  value={`−${formatMoney(walletApplied)}`}
                  highlight
                />
              ) : null}
              <View style={styles.summaryDivider} />
              <SummaryRow
                label={t("cart.total")}
                value={formatMoney(
                  total ??
                    subtotal + deposit + serviceFee + tax - walletApplied,
                )}
                bold
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && styles.summaryStrong]}>
        {label}
      </Text>
      <Text
        style={[
          styles.summaryValue,
          bold && styles.summaryStrong,
          highlight && { color: colors.primary },
        ]}
      >
        {value}
      </Text>
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
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  loading: {
    paddingVertical: spacing.xxxl,
    alignItems: "center",
  },
  empty: {
    ...typography.textSm,
    color: colors.gray500,
    textAlign: "center",
    paddingVertical: spacing.xxxl,
  },
  metaCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
    gap: spacing.xs,
  },
  metaTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  statusText: {
    ...typography.textXs,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  placedAt: {
    ...typography.textXs,
    color: colors.gray500,
  },
  orderNumber: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "700",
  },
  restaurantCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
  },
  restaurantImage: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.state100,
  },
  restaurantFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  restaurantFallbackText: {
    ...typography.h2,
    color: colors.white,
    fontWeight: "700",
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
  },
  restaurantSubtitle: {
    ...typography.textXs,
    color: colors.gray500,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.state100,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  ratingText: {
    ...typography.textXs,
    color: colors.dark,
    fontWeight: "700",
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  itemRowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  qtyBadge: {
    minWidth: 28,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.dangerSoftBackground,
    alignItems: "center",
  },
  qtyText: {
    ...typography.textXs,
    color: colors.primary,
    fontWeight: "700",
  },
  itemName: {
    flex: 1,
    ...typography.textSm,
    color: colors.dark,
  },
  itemPrice: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    ...typography.textSm,
    color: colors.gray500,
  },
  summaryValue: {
    ...typography.textSm,
    color: colors.dark,
  },
  summaryStrong: {
    color: colors.dark,
    fontWeight: "700",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.light,
    marginVertical: spacing.xs,
  },
});
