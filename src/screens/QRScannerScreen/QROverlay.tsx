import { View, Text, StyleSheet, Dimensions } from "react-native";
import { colors, textColors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { useTranslation } from "react-i18next";
import { borderRadius, spacing } from "../../theme";

const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.56;

export function QROverlay() {
  const { t } = useTranslation();
  return (
    <View style={styles.overlay}>
      <View style={styles.frame} />
      <Text style={styles.hint}>{t("qr-scanner.hint")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark,
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray500,
    marginTop: "auto",
  },
  hint: {
    color: textColors.tabs,
    marginTop: "auto",
    marginBottom: spacing.xl,
    ...typography.buttonSm,
    textAlign: "center",
    maxWidth: width * 0.85,
  },
});
