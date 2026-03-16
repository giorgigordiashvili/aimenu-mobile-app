import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { useCart } from "../context/CartContext";
import { TextInput } from "../components/ui/TextInput";
import { colors, spacing, borderRadius } from "../theme";

export default function PaymentScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { items, totalPrice } = useCart();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [tipPercent, setTipPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  const tipAmount = (totalPrice * tipPercent) / 100;
  const finalTotal = totalPrice + tipAmount;

  const handlePay = async () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)/payment/success");
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* ORDER SUMMARY */}

        <View style={styles.section}>
          <Text style={styles.title}>{t("payment.orderSummary")}</Text>

          {items.map((item) => (
            <View key={item.itemId} style={styles.row}>
              <Text>
                {item.name} x{item.quantity}
              </Text>

              <Text>{(item.price * item.quantity).toFixed(2)}₾</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.total}>{t("payment.total")}</Text>
            <Text style={styles.total}>{totalPrice.toFixed(2)}₾</Text>
          </View>
        </View>

        {/* CARD INPUT */}

        <View style={styles.section}>
          <Text style={styles.title}>{t("payment.paymentMethod")}</Text>

          <TextInput
            label={t("payment.cardNumber")}
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
            maxLength={19}
          />

          <View style={{ flexDirection: "row" }}>
            <TextInput
              label={t("payment.expiry")}
              value={expiry}
              onChangeText={setExpiry}
              keyboardType="number-pad"
              maxLength={5}
              style={{ flex: 1, marginRight: 12 }}
            />

            <TextInput
              label="CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="number-pad"
              maxLength={3}
              secureTextEntry
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* TIP */}

        <View style={styles.section}>
          <Text style={styles.title}>{t("payment.tip")}</Text>

          <View style={styles.tipRow}>
            {[0, 10, 15, 20].map((pct) => (
              <TouchableOpacity
                key={pct}
                style={[
                  styles.tipButton,
                  tipPercent === pct && styles.tipActive,
                ]}
                onPress={() => setTipPercent(pct)}
              >
                <Text
                  style={[
                    styles.tipText,
                    tipPercent === pct && styles.tipTextActive,
                  ]}
                >
                  {pct === 0 ? t("payment.noTip") : `${pct}%`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* PAY BUTTON */}

      <TouchableOpacity
        style={styles.payButton}
        onPress={handlePay}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payText}>
            {t("payment.pay")} ₾{finalTotal.toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  section: {
    padding: spacing.lg,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.md,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  total: {
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: colors.light,
    marginVertical: spacing.md,
  },

  tipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  tipButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: borderRadius.md,
    width: 70,
    alignItems: "center",
  },

  tipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  tipText: {
    color: colors.dark,
  },

  tipTextActive: {
    color: colors.white,
  },

  payButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    alignItems: "center",
  },

  payText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
});
