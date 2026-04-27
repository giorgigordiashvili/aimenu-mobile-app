import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { borderRadius, colors, spacing, typography } from "../theme";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import StarIcon from "../assets/icons/StarIcon";

const STEP_KEYS = ["step1", "step2", "step3"] as const;
const TIER_KEYS = ["gourmand", "silver", "gold", "platinum"] as const;
const EARNING_KEYS = ["earningRule1", "earningRule2", "earningRule3"] as const;

const TIER_COLORS: Record<(typeof TIER_KEYS)[number], string> = {
  gourmand: "#94A3B8",
  silver: "#CBD5E1",
  gold: "#F0B100",
  platinum: "#A78BFA",
};

export default function LoyaltyRulesScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("loyalty.rules.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <StarIcon size={32} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>{t("loyalty.rules.heroTitle")}</Text>
          <Text style={styles.heroLead}>{t("loyalty.rules.heroLead")}</Text>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("loyalty.rules.howItWorksTitle")}
          </Text>
          {STEP_KEYS.map((key, index) => (
            <View key={key} style={styles.stepRow}>
              <View style={styles.stepBullet}>
                <Text style={styles.stepBulletText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>
                {t(`loyalty.rules.${key}`)}
              </Text>
            </View>
          ))}
        </View>

        {/* Tiers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("loyalty.rules.tiersTitle")}
          </Text>
          {TIER_KEYS.map((key) => (
            <View key={key} style={styles.tierRow}>
              <View
                style={[styles.tierDot, { backgroundColor: TIER_COLORS[key] }]}
              />
              <View style={styles.tierContent}>
                <Text style={styles.tierName}>
                  {t(`loyalty.rules.tier.${key}.name`)}
                </Text>
                <Text style={styles.tierMeta}>
                  {t(`loyalty.rules.tier.${key}.meta`)}
                </Text>
              </View>
              <Text style={styles.tierDiscount}>
                {t(`loyalty.rules.tier.${key}.discount`)}
              </Text>
            </View>
          ))}
        </View>

        {/* Earning rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("loyalty.rules.earningRulesTitle")}
          </Text>
          {EARNING_KEYS.map((key) => (
            <View key={key} style={styles.earningRow}>
              <Text style={styles.earningDot}>•</Text>
              <Text style={styles.earningText}>
                {t(`loyalty.rules.${key}`)}
              </Text>
            </View>
          ))}
        </View>

        {/* Note */}
        <View style={styles.note}>
          <Text style={styles.noteText}>{t("loyalty.rules.optInNote")}</Text>
        </View>

        {/* CTAs */}
        <View style={styles.ctaRow}>
          <Button
            title={t("loyalty.rules.myLoyaltyCta")}
            onPress={() => router.push("/loyalty")}
            variant="primary"
            size="md"
            style={styles.cta}
          />
          <Button
            title={t("loyalty.rules.findRestaurantsCta")}
            onPress={() => router.push("/search")}
            variant="outline"
            size="md"
            style={styles.cta}
          />
        </View>
      </ScrollView>
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
  headerSpacer: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLightest,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.dark,
    fontWeight: "700",
    textAlign: "center",
  },
  heroLead: {
    ...typography.textSm,
    color: colors.gray500,
    textAlign: "center",
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  stepBullet: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBulletText: {
    ...typography.button,
    color: colors.white,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    ...typography.textSm,
    color: colors.dark,
  },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  tierDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
  },
  tierContent: {
    flex: 1,
    gap: 2,
  },
  tierName: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
  },
  tierMeta: {
    ...typography.textXs,
    color: colors.gray500,
  },
  tierDiscount: {
    ...typography.textBase,
    color: colors.primary,
    fontWeight: "700",
  },
  earningRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  earningDot: {
    ...typography.textBase,
    color: colors.primary,
    fontWeight: "700",
  },
  earningText: {
    flex: 1,
    ...typography.textSm,
    color: colors.dark,
  },
  note: {
    backgroundColor: colors.primaryLightest,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  noteText: {
    ...typography.textSm,
    color: colors.dark,
  },
  ctaRow: {
    gap: spacing.sm,
  },
  cta: {
    borderRadius: borderRadius.full,
    minHeight: 48,
  },
});
