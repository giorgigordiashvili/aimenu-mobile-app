import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../../theme";

const STEPS = ["howItWorks1", "howItWorks2", "howItWorks3"] as const;

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("referral.howItWorksTitle")}</Text>
      {STEPS.map((key, index) => (
        <View key={key} style={styles.row}>
          <View style={styles.bullet}>
            <Text style={styles.bulletText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{t(`referral.${key}`)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  bulletText: {
    ...typography.buttonSm,
    color: colors.white,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    ...typography.textSm,
    color: colors.dark,
  },
});
