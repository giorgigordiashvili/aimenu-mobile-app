import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button";
import { TextInput } from "../../components/ui/TextInput";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { textColors } from "../../theme/colors";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";
import { useRouter } from "expo-router";
import AppleIcon from "../../assets/icons/AppleIcon";
import FbIcon from "../../assets/icons/FbIcon";
import GoogleIcon from "../../assets/icons/GoogleIcon";

export default function RegisterScreen() {
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState<{
    firstName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) newErrors.firstName = t("validation.required");

    if (!email.trim()) {
      newErrors.email = t("validation.required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("validation.invalidEmail");
    }

    if (password.length < 8) {
      newErrors.password = t("validation.passwordMin");
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t("validation.passwordMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://admin.aimenu.ge/api/auth/registration/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            email: email,
            password1: password,
            password2: confirmPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", JSON.stringify(data));
        return;
      }

      Alert.alert("Success", t("auth.registerSuccess"));
      router.push("/login");
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Language Switcher */}
        <View style={styles.languageWrapper}>
          <LanguageSwitcher />
        </View>

        <View style={{ marginBottom: spacing.lg }} />

        {/* Title */}
        <Text style={styles.title}>{t("register")}</Text>
        <Text style={styles.subtitle}>{t("registerSubtitle")}</Text>

        {/* First Name */}
        <TextInput
          label={t("firstName")}
          value={firstName}
          onChangeText={setFirstName}
          error={errors.firstName}
          placeholder={t("firstNamePlaceholder")}
        />
        {/* Email */}
        <TextInput
          label={t("auth.email")}
          placeholder={t("auth.emailPlaceholder")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        {/* Password */}
        <TextInput
          label={t("auth.password")}
          placeholder={t("auth.passwordPlaceholder")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          error={errors.password}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ color: colors.primary }}>
                {showPassword ? t("auth.hide") : t("auth.show")}
              </Text>
            </TouchableOpacity>
          }
        />

        {/* Confirm Password */}
        <TextInput
          label={t("confirmPassword")}
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          error={errors.confirmPassword}
        />

        {/* Register Button */}
        <Button
          variant="primary"
          onPress={handleRegister}
          style={{ marginTop: spacing.lg, width: "100%" }}
          title={loading ? "..." : t("registerButton")}
          disabled={loading}
        />

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.orText}>{t("auth.or")}</Text>
          <View style={styles.dividerLine} />
        </View>
        {/* Social Buttons */}
        <View style={styles.SocialsRow}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <GoogleIcon size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <FbIcon size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <AppleIcon size={16} />
          </TouchableOpacity>
        </View>

        {/* Bottom Link */}
        <Text style={styles.registerText}>
          {t("hasAccount")}
          <Text
            style={styles.registerLink}
            onPress={() => router.push("/login")}
          >
            {t("loginLink")}
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  languageWrapper: {
    alignItems: "flex-end",
    marginTop: spacing.xxxl,
    marginBottom: 0,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    ...typography.textSm,
    marginBottom: spacing.xxl,
    textAlign: "center",
    color: textColors.tertiary,
  },
  orText: {
    ...typography.textSm,
    textAlign: "center",
    marginVertical: spacing.xl,
    color: textColors.disabled,
    textTransform: "uppercase",
    paddingHorizontal: spacing.sm,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.light,
    alignSelf: "center",
  },
  SocialsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  registerText: {
    ...typography.textSm,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: spacing.md,
    color: textColors.tertiary,
  },
  registerLink: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "700",
  },
});
