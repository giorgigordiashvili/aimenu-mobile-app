import React, { useState, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { useCart } from "../context/CartContext";
import { TextInput } from "../components/ui/TextInput";
import { colors, spacing, borderRadius, typography } from "../theme";
import { textColors } from "../theme/colors";

import BackArrowIcon from "../assets/icons/BackArrowIcon";
import PersonIcon from "../assets/icons/PersonIcon";
import PhoneIcon from "../assets/icons/PhoneIcon";
import ShieldIcon from "../assets/icons/ShieldIcon";
import MailIcon from "../assets/icons/MailIcon";

export default function PaymentScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { totalPrice } = useCart();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("auth_token").then(setToken);
  }, []);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"new" | "saved" | "apple">(
    "saved",
  );

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const ctaTranslateY = React.useRef(new Animated.Value(0)).current;
  const ctaOpacity = React.useRef(new Animated.Value(1)).current;
  const lastScrollY = React.useRef(0);
  const isCtaVisible = React.useRef(true);

  const reservationDeposit = 10;
  const finalTotal = totalPrice + reservationDeposit;

  // 🔌 Fetch cards
  const fetchCards = async () => {
    try {
      const res = await fetch("https://admin.aimenu.ge/api/payments/methods/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setCards(data.results || []);

      const defaultCard = data.results?.find((c: any) => c.is_default);
      if (defaultCard) setSelectedCardId(defaultCard.id);
    } catch (e) {
      Alert.alert("Error", "ბარათების მიღება ვერ მოხერხდა");
    }
  };

  useEffect(() => {
    if (token) {
      fetchCards();
    }
  }, [token]);

  // 💳 Handle Payment
  const handlePay = async () => {
    if (paymentMethod === "saved" && !selectedCardId) {
      return Alert.alert("Error", "აირჩიეთ ბარათი");
    }

    if (paymentMethod === "new") {
      return Alert.alert("Error", "გთხოვთ დაამატოთ ბარათი");
    }

    try {
      setLoading(true);

      console.log("Paying with card:", selectedCardId);

      setTimeout(() => {
        router.replace("/payment/success");
      }, 1000);
    } catch (e) {
      router.replace("/payment/failed");
    } finally {
      setLoading(false);
    }
  };

  // 🎬 CTA animations
  const showCta = () => {
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
  };

  const hideCta = () => {
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
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const delta = currentY - lastScrollY.current;

    if (currentY <= 0) return showCta();

    if (delta > 6) hideCta();
    else if (delta < -6) showCta();

    lastScrollY.current = currentY;
  };

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

        <Text style={styles.headerTitle}>{t("payment.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* USER INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("payment.subtitle")}</Text>

          <TextInput
            leftIcon={<PersonIcon />}
            value={fullName}
            onChangeText={setFullName}
            placeholder={t("payment.namePlaceholder")}
          />

          <TextInput
            leftIcon={<PhoneIcon />}
            value={phone}
            onChangeText={setPhone}
            placeholder={t("payment.phonePlaceholder")}
          />

          <TextInput
            leftIcon={<MailIcon />}
            value={email}
            onChangeText={setEmail}
            placeholder={t("payment.emailPlaceholder")}
          />
        </View>

        {/* PAYMENT METHODS */}
        <View style={styles.section}>
          <Text style={styles.methodTitle}>{t("payment.method")}</Text>

          {/* ➕ ADD CARD */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              paymentMethod === "new" && styles.methodCardSelected,
            ]}
            onPress={() => router.push("/payment-methods")}
          >
            <View style={styles.methodIconCircle} />
            <View style={styles.methodTextWrap}>
              <Text style={styles.methodLabel}>{t("payment.addCard")}</Text>
            </View>
          </TouchableOpacity>

          {/* 💳 SAVED CARDS */}
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.methodCard,
                selectedCardId === card.id && styles.methodCardSelected,
              ]}
              onPress={() => {
                setPaymentMethod("saved");
                setSelectedCardId(card.id);
              }}
            >
              <View style={styles.savedCardMark}>
                <View style={styles.dotYellow} />
                <View style={styles.dotRed} />
              </View>

              <View style={styles.methodTextWrap}>
                <Text style={styles.methodLabel}>•••• {card.last_four}</Text>
                <Text style={styles.methodSubtext}>
                  {String(card.expiry_month).padStart(2, "0")}/
                  {card.expiry_year}
                </Text>
              </View>

              <View style={styles.radioOuter}>
                {selectedCardId === card.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* TOTAL */}
        <View style={styles.totalSection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Deposit</Text>
            <Text style={styles.summaryValue}>
              {reservationDeposit.toFixed(2)} ₾
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{finalTotal.toFixed(2)} ₾</Text>
          </View>

          <View style={styles.safeRow}>
            <ShieldIcon />
            <Text style={styles.safeText}>{t("cart.safe")}</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <Animated.View
        pointerEvents={loading ? "none" : "auto"}
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
          onPress={handlePay}
          disabled={loading || (paymentMethod === "saved" && !selectedCardId)}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.orderText}>{t("payment.button")}</Text>
          )}
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },

  section: {
    marginBottom: spacing.md,
  },

  sectionTitle: {
    ...typography.button,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
    marginBottom: spacing.xs,
  },

  sectionDescription: {
    ...typography.textXs,
    color: textColors.tertiary,
    marginBottom: spacing.lg,
  },

  noteWrapper: {
    height: 100,
    alignItems: "flex-start",
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
  },

  noteInput: {
    minHeight: 76,
    textAlignVertical: "top",
  },

  methodTitle: {
    ...typography.h4,
    color: colors.gray900,
    fontWeight: typography.h1.fontWeight,
    marginBottom: spacing.xmd,
  },

  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  methodCardSelected: {
    borderColor: colors.dark,
    borderWidth: 1.75,
  },

  methodIconCircle: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xmd,
    backgroundColor: colors.white,
  },

  methodIconLine: {
    width: 16,
    height: 2,
    backgroundColor: colors.darkGrey,
  },

  savedCardMark: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xmd,
    backgroundColor: colors.white,
  },

  dotYellow: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    backgroundColor: "#F59E0B",
    marginRight: -4,
  },

  dotRed: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },

  methodTextWrap: {
    flex: 1,
    minWidth: 0,
  },

  methodLabel: {
    ...typography.button,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },

  methodSubtext: {
    ...typography.textXs,
    color: textColors.tertiary,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray900,
  },

  totalSection: {
    marginTop: spacing.xl,
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
    alignItems: "center",
    justifyContent: "center",
  },

  orderText: {
    color: colors.white,
    ...typography.buttonLg,
    fontWeight: typography.h1.fontWeight,
  },
});
