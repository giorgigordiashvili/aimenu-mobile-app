import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { TextInput } from "../components/ui/TextInput";
import { colors, spacing, borderRadius, typography } from "../theme";
import { textColors } from "../theme/colors";
import BackArrowIcon from "../assets/icons/BackArrowIcon";

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + "/" + digits.slice(2);
  }
  return digits;
}

export default function AddCardScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryChange = (text: string) => {
    setExpiry(formatExpiry(text));
  };

  const getValidToken = async (): Promise<string> => {
    const refresh = await AsyncStorage.getItem("auth_refresh_token");
    if (!refresh) throw new Error(t("addCard.saveFailed"));
    const refreshRes = await fetch(
      "https://admin.aimenu.ge/api/v1/auth/token/refresh/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      },
    );
    if (!refreshRes.ok) throw new Error(t("addCard.saveFailed"));
    const refreshData = await refreshRes.json().catch(() => null);
    const newAccess: string | undefined = refreshData?.access;
    if (!newAccess) throw new Error(t("addCard.saveFailed"));
    await AsyncStorage.setItem("auth_token", newAccess);
    return newAccess;
  };

  const postAddCard = async (token: string, body: object) => {
    return fetch("https://admin.aimenu.ge/api/v1/payments/methods/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  };

  const handleSave = async () => {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 16) {
      return Alert.alert(t("addCard.error"), t("addCard.errorCardNumber"));
    }
    if (expiry.length < 5) {
      return Alert.alert(t("addCard.error"), t("addCard.errorExpiry"));
    }
    if (cvv.length < 3) {
      return Alert.alert(t("addCard.error"), t("addCard.errorCvv"));
    }
    if (!cardHolder.trim()) {
      return Alert.alert(t("addCard.error"), t("addCard.errorHolder"));
    }

    const [month, year] = expiry.split("/");
    const payload = {
      card_number: digits,
      expiry_month: parseInt(month, 10),
      expiry_year:
        year.length === 2 ? 2000 + parseInt(year, 10) : parseInt(year, 10),
      cvv,
      card_holder: cardHolder.trim(),
    };

    setLoading(true);
    try {
      let token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        token = await getValidToken();
      }
      let res = await postAddCard(token, payload);

      // Token expired — refresh and retry once
      if (res.status === 401) {
        token = await getValidToken();
        res = await postAddCard(token, payload);
      }

      if (!res.ok) {
        const text = await res.text();
        console.log("AddCard error:", res.status, text);
        let firstError: string | null = null;
        try {
          const data = JSON.parse(text);
          firstError =
            data?.error?.message ||
            data?.detail ||
            data?.message ||
            (typeof data === "object"
              ? Object.values(data).flat().join(" ")
              : null);
        } catch {}
        throw new Error(firstError || t("addCard.saveFailed"));
      }

      router.back();
    } catch (err: any) {
      Alert.alert(t("addCard.error"), err?.message ?? t("addCard.saveFailed"));
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.headerTitle}>{t("addCard.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          label={t("addCard.cardNumberLabel")}
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          placeholder="0000 0000 0000 0000"
          keyboardType="number-pad"
          maxLength={19}
        />

        <View style={styles.row}>
          <View style={styles.flex}>
            <TextInput
              label={t("addCard.expiryLabel")}
              value={expiry}
              onChangeText={handleExpiryChange}
              placeholder="MM/YY"
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
          <View style={styles.gap} />
          <View style={styles.flex}>
            <TextInput
              label={t("addCard.cvvLabel")}
              value={cvv}
              onChangeText={(text) =>
                setCvv(text.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="CVV"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>

        <TextInput
          label={t("addCard.holderLabel")}
          value={cardHolder}
          onChangeText={setCardHolder}
          placeholder={t("addCard.holderPlaceholder")}
          autoCapitalize="characters"
        />

        <Text style={styles.hint}>{t("addCard.hint")}</Text>
      </ScrollView>

      {/* SAVE BUTTON */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveText}>{t("addCard.saveButton")}</Text>
          )}
        </TouchableOpacity>
      </View>
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
    gap: spacing.md,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  flex: {
    flex: 1,
  },

  gap: {
    width: spacing.md,
  },

  hint: {
    ...typography.textXs,
    color: textColors.tertiary,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  ctaContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  saveButton: {
    backgroundColor: colors.greenButtonBackground,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveText: {
    color: colors.white,
    ...typography.buttonLg,
    fontWeight: typography.h1.fontWeight,
  },
});
