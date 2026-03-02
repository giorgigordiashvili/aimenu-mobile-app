import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button";
import { OtpInput } from "../../components/ui/OtpInput";
import { colors, typography, spacing } from "../../theme";
import { textColors } from "../../theme/colors";
import BackArrowIcon from "../../assets/icons/BackArrowIcon";
import ResendIcon from "../../assets/icons/ResendIcon";
import { useRouter } from "expo-router";

export default function OtpScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = () => {
    if (otp.length !== 4) {
      setError(t("otp.invalidCode"));
      return;
    }
    setError("");
    router.push({ pathname: "/reset-sent" });
  };

  const handleResend = () => {
    setResendLoading(true);
    setTimeout(() => {
      setResendLoading(false);
      // Simulate resend
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity
        onPress={() => router.push("/forgot")}
        style={styles.backButton}
      >
        <BackArrowIcon />
      </TouchableOpacity>

      <Text style={styles.title}>{t("forgot.title")}</Text>

      <Text style={styles.description}>
        {t("otp.description")}{" "}
        <Text style={styles.phoneNumber}>+995 577 48 88 96</Text>
      </Text>

      <OtpInput value={otp} onChange={setOtp} error={!!error} />
      {!!error && <Text style={styles.otpError}>{error}</Text>}

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={styles.resendRow}
        onPress={handleResend}
        disabled={resendLoading}
      >
        <ResendIcon />
        <Text style={styles.resendText}>{t("otp.resend")}</Text>
      </TouchableOpacity>

      <Button
        title={t("otp.button")}
        onPress={handleSubmit}
        loading={loading}
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
  phoneNumber: {
    color: colors.dark,
    fontWeight: "bold",
  },
  otpError: {
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.md,
    ...typography.textSm,
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  resendText: {
    color: textColors.defaultSecondary,
    ...typography.buttonSm,
  },
});
