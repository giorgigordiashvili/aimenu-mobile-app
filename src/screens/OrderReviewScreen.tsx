import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { useCart } from "../context/CartContext";
import { colors, spacing, borderRadius } from "../theme";
import BackArrowIcon from "../assets/icons/BackArrowIcon";

export default function OrderReviewScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { items, totalPrice, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text>{t("cart.empty")}</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ marginTop: 10, color: colors.primary }}>
            {t("cart.browseMenu")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const serviceFee = totalPrice * 0.1;
  const grandTotal = totalPrice + serviceFee;

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackArrowIcon />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t("cart.orderReview")}</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {items.map((item) => (
          <View key={item.itemId} style={styles.itemRow}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>

              {item.modifiers.map((mod) => (
                <Text key={mod.modifierId} style={styles.modifier}>
                  + {mod.name} ({mod.price}₾)
                </Text>
              ))}

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.itemId, item.quantity - 1)}
                >
                  <Text style={styles.qtyBtn}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qtyText}>{item.quantity}</Text>

                <TouchableOpacity
                  onPress={() => updateQuantity(item.itemId, item.quantity + 1)}
                >
                  <Text style={styles.qtyBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.price}>
              {(item.price * item.quantity).toFixed(2)}₾
            </Text>
          </View>
        ))}

        {/* SUMMARY */}

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>{t("cart.subtotal")}</Text>
            <Text>{totalPrice.toFixed(2)}₾</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>{t("cart.serviceFee")}</Text>
            <Text>{serviceFee.toFixed(2)}₾</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.total}>{t("cart.total")}</Text>
            <Text style={styles.total}>{grandTotal.toFixed(2)}₾</Text>
          </View>
        </View>
      </ScrollView>

      {/* ORDER BUTTON */}

      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => router.push("/payment")}
      >
        <Text style={styles.orderText}>
          {t("cart.placeOrder")} — {grandTotal.toFixed(2)}₾
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
  },

  headerTitle: { fontSize: 18, fontWeight: "600" },

  itemRow: {
    flexDirection: "row",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderColor: colors.gray500,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },

  itemName: { fontWeight: "600" },

  modifier: { fontSize: 13, color: colors.gray600 },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  qtyBtn: {
    fontSize: 20,
    paddingHorizontal: 10,
  },

  qtyText: {
    marginHorizontal: 10,
  },

  price: {
    fontWeight: "600",
  },

  summary: {
    padding: spacing.lg,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  total: {
    fontWeight: "700",
  },

  orderButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    alignItems: "center",
  },

  orderText: {
    color: colors.white,
    fontWeight: "600",
  },
});
