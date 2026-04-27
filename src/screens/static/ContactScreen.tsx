import {
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../../theme";
import BackArrowIcon from "../../assets/icons/BackArrowIcon";
import MailIcon from "../../assets/icons/MailIcon";
import PhoneIcon from "../../assets/icons/PhoneIcon";

const SUPPORT_EMAIL = "support@aimenu.ge";
const SUPPORT_PHONE = "+995322000000";

export default function ContactScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const openEmail = () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  const openPhone = () => Linking.openURL(`tel:${SUPPORT_PHONE}`);

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
        <Text style={styles.headerTitle}>{t("static.contact.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>{t("static.contact.intro")}</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={openEmail}
          activeOpacity={0.85}
        >
          <View style={styles.iconCircle}>
            <MailIcon />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>{t("static.contact.email")}</Text>
            <Text style={styles.rowValue}>{SUPPORT_EMAIL}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={openPhone}
          activeOpacity={0.85}
        >
          <View style={styles.iconCircle}>
            <PhoneIcon />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowLabel}>{t("static.contact.phone")}</Text>
            <Text style={styles.rowValue}>{SUPPORT_PHONE}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.note}>
          <Text style={styles.noteText}>{t("static.contact.hours")}</Text>
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
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
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
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  intro: {
    ...typography.textSm,
    color: colors.darkGrey,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLightest,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    ...typography.textXs,
    color: colors.gray500,
  },
  rowValue: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: "600",
  },
  note: {
    backgroundColor: colors.primaryLightest,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  noteText: {
    ...typography.textSm,
    color: colors.dark,
  },
});
