import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import { useCart } from "../../../src/context/CartContext";
import { colors, spacing, typography } from "../../../src/theme";

export default function PaymentScreen() {
  const router = useRouter();
  const { totalPrice, clearCart } = useCart();

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const serviceFee = totalPrice * 0.1;
  const total = totalPrice + serviceFee;

  const paymentMethods = [
    { id: "card", label: "ბანკის ბარათი", icon: "💳" },
    { id: "apple", label: "Apple Pay", icon: "🍎" },
    { id: "google", label: "Google Pay", icon: "🔵" },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    // mock payment delay
    setTimeout(() => {
      clearCart();
      router.replace("/payment/success");
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text>← უკან</Text>
      </TouchableOpacity>

      <Text style={styles.title}>გადახდა</Text>

      <Text style={styles.sectionTitle}>აირჩიეთ გადახდის მეთოდი</Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            selectedMethod === method.id && styles.methodCardSelected,
          ]}
          onPress={() => setSelectedMethod(method.id)}
        >
          <Text>
            {method.icon} {method.label}
          </Text>
        </TouchableOpacity>
      ))}

      <View style={styles.summary}>
        <Text style={styles.sectionTitle}>შეკვეთის ჯამი</Text>

        <View style={styles.row}>
          <Text>ქვეჯამი</Text>
          <Text>{totalPrice.toFixed(2)}₾</Text>
        </View>

        <View style={styles.row}>
          <Text>სერვისის საკომისიო</Text>
          <Text>{serviceFee.toFixed(2)}₾</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.total}>სულ</Text>
          <Text style={styles.total}>{total.toFixed(2)}₾</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.payButton, !selectedMethod && styles.payButtonDisabled]}
        disabled={!selectedMethod || isProcessing}
        onPress={handlePayment}
      >
        <Text style={styles.payText}>
          {isProcessing ? "მიმდინარეობს..." : `გადახდა ${total.toFixed(2)}₾`}
        </Text>
      </TouchableOpacity>

      <Text style={styles.secure}>🔒 უსაფრთხო გადახდა</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.lg,
  },

  title: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    ...typography.textBase,
    marginBottom: spacing.md,
  },

  methodCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },

  methodCardSelected: {
    borderColor: colors.primary,
  },

  summary: {
    marginTop: 24,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  secure: {
    textAlign: "center",
    marginTop: 12,
    color: colors.gray500,
  },

  total: {
    fontWeight: "700",
    fontSize: 18,
  },

  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  payButtonDisabled: {
    opacity: 0.5,
  },

  payText: {
    color: colors.white,
    fontWeight: "600",
  },
});
