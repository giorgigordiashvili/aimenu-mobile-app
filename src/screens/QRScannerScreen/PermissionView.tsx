import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { useTranslation } from "react-i18next";
import { borderRadius, spacing } from "../../theme";

type PermissionViewProps = {
  onRequest: () => void;
};

export function PermissionView({ onRequest }: PermissionViewProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Icon name="camera-off" size={64} color={colors.gray600} />
      <Text style={styles.title}>{t("qr-scanner.permission_title")}</Text>
      <Text style={styles.desc}>{t("qr-scanner.permission_desc")}</Text>
      <TouchableOpacity onPress={onRequest} style={styles.button}>
        <Text style={styles.buttonText}>
          {t("qr-scanner.permission_button")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
  title: {
    ...typography.h2,
    marginVertical: spacing.sm,
    color: colors.white,
    textAlign: "center",
  },
  desc: {
    ...typography.textBase,
    color: colors.gray600,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    color: colors.white,
    ...typography.buttonLg,
    textAlign: "center",
  },
});
