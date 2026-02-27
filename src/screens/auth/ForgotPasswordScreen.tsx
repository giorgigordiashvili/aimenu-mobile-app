import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { TextInput } from "../../components/ui/TextInput";
import PhoneIcon from "../../assets/icons/PhoneIcon";
import { Button } from "../../components/Button";
import { colors, typography, spacing } from "../../theme";
import { textColors } from "../../theme/colors";
import BackArrowIcon from "../../assets/icons/BackArrowIcon";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    return /^\d{9,12}$/.test(cleaned);
  };

  const handleGoToReset = () => {
    router.push({
      pathname: "/reset-sent",
      params: { phone },
    });
  };

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={styles.backButton}
      >
        <BackArrowIcon />
      </TouchableOpacity>

      <Text style={styles.title}>{t("forgot.title")}</Text>
      <Text style={styles.description}>{t("forgot.description")}</Text>
      <TextInput
        label={t("forgot.inputLabel")}
        placeholder="577 XX XX XX"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          setError("");
        }}
        keyboardType="phone-pad"
        error={error}
        leftIcon={
          <View>
            <PhoneIcon />
          </View>
        }
      />

      <View style={{ flex: 1 }} />

      <Button
        title={t("forgot.button")}
        onPress={handleGoToReset}
        style={{ marginTop: spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.white,
    textAlign: "center",
  },
  backButton: {
    padding: spacing.md,
    borderRadius: 120,
    textAlign: "center",
    width: 44,
    height: 44,
    marginTop: spacing.lg,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 3,
    // Border
    borderWidth: 1,
    borderColor: colors.state100,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    fontWeight: typography.h1.fontWeight,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  description: {
    ...typography.body,
    color: textColors.secondary,
    marginBottom: spacing.xxl,
    textAlign: "center",
  },
});
