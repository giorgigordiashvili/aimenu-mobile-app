import { View, Text, StyleSheet, Dimensions } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { spacing } from "../../theme";

const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.7;

export function QROverlay() {
  const scanLine = useSharedValue(0);
  const { t } = useTranslation();

  useEffect(() => {
    scanLine.value = withRepeat(
      withTiming(FRAME_SIZE, { duration: 1500 }),
      -1,
      true,
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLine.value }] as any,
    };
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.frame}>
        <Animated.View style={[styles.scanLine, scanLineStyle]} />
      </View>
      <Text style={styles.hint}>{t("qr-scanner.hint")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderColor: colors.white,
    borderWidth: 2,
    position: "relative",
  },
  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: colors.primary,
    position: "absolute",
    top: 0,
  },
  hint: {
    color: colors.white,
    marginTop: spacing.md,
    ...typography.textBase,
    textAlign: "center",
  },
});
