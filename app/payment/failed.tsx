import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import ErrorCircleIcon from "../../src/assets/icons/ErrorCircleIcon";
import { Button } from "../../src/components/Button";
import { borderRadius, colors, spacing, typography } from "../../src/theme";
import { textColors } from "../../src/theme/colors";

export default function PaymentFailedScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <ErrorCircleIcon />

        <Text style={styles.title}>{t("failedPayment.title")}</Text>

        <Text style={styles.subtitle}>{t("failedPayment.subtitle")}</Text>
      </View>

      <Button
        title={t("failedPayment.cta")}
        onPress={() => router.back()}
        variant="success"
        fullWidth
        size="md"
        style={styles.ctaButton}
        textStyle={styles.ctaText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.state50,
    paddingHorizontal: spacing.md,
    padding: spacing.xxxl,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.h2,
    marginTop: spacing.md,
    color: colors.dark,
    textAlign: "center",
    fontWeight: typography.h1.fontWeight,
  },
  subtitle: {
    ...typography.textXs,
    marginTop: spacing.md,
    maxWidth: 360,
    textAlign: "center",
    color: textColors.tertiary,
  },
  ctaButton: {
    height: 48,
    borderRadius: borderRadius.full,
  },
  ctaText: {
    ...typography.button,
    color: colors.white,
    fontWeight: typography.h1.fontWeight,
  },
});
