import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import { TextInput } from "../../components/ui/TextInput";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { textColors } from "../../theme/colors";
import FbIcon from "../../assets/icons/FbIcon";
import AppleIcon from "../../assets/icons/AppleIcon";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";

export default function LoginScreen({ navigation }: any) {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("validation.invalidEmail");
    }

    if (!password) {
      newErrors.password = t("validation.passwordRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;

    console.log("Login:", { email, password });
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
        {/* Spacer below language switcher */}
        <View style={{ marginBottom: spacing.lg }} />
        {/* Title */}
        <Text style={styles.title}>{t("auth.login")}</Text>
        <Text style={styles.subtitle}>{t("auth.loginSubtitle")}</Text>

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

        {/* Forgot password */}
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotLink}>{t("auth.forgotPassword")}</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <Button
          variant="primary"
          onPress={handleLogin}
          style={{ marginTop: spacing.lg, width: "100%" }}
          title={t("auth.loginButton")}
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

        {/* Register */}
        <Text style={styles.registerText}>
          {t("auth.noAccount")}{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            {t("auth.register")}
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
  forgotLink: {
    ...typography.textSm,
    marginLeft: "auto",
    color: textColors.defaultSecondary,
  },
  orText: {
    ...typography.textSm,
    textAlign: "center",
    marginVertical: spacing.xl,
    color: textColors.disabled,
    textTransform: "uppercase",
    paddingHorizontal: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.light,
    alignSelf: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  SocialsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
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
    color: textColors.tertiary,
  },
  registerLink: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "700",
  },
});
