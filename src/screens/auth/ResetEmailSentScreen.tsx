import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button";
import { colors, typography, spacing } from "../../theme";
import { textColors } from "../../theme/colors";
import BackArrowIcon from "../../assets/icons/BackArrowIcon";
import { useRouter } from "expo-router";
import { TextInput } from "../../components/ui/TextInput";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError(t("resetPassword.emptyPassword"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("resetPassword.passwordsDontMatch"));
      return;
    }
    setLoading(true);
    try {
      router.push({ pathname: "/reset-sent" });
    } catch (err) {
      Alert.alert(t("forgot.error"), t("forgot.resetFailed"));
    } finally {
      setLoading(false);
    }
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
        {t("resetPassword.passwordDescription")}
      </Text>

      <TextInput
        label={t("resetPassword.password")}
        placeholder="********"
        placeholderTextColor={textColors.placeholder}
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError("");
        }}
      />

      <TextInput
        label={t("resetPassword.confirmNewPassword")}
        placeholder="********"
        placeholderTextColor={textColors.placeholder}
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setError("");
        }}
      />

      {error ? (
        <Text
          style={{
            color: colors.error,
            marginBottom: spacing.md,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      ) : null}

      <View style={{ flex: 1 }} />

      <Button
        title={t("resetPassword.changePasswordButton")}
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
});
