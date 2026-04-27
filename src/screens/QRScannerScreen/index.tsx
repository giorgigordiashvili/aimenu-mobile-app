import { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { ScannerView } from "./ScannerView";
import { useTranslation } from "react-i18next";
import { spacing } from "../../theme";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const FRAME_SIZE = Math.min(width * 0.62, 260);
const FRAME_RADIUS = 40;

function parseRestaurantSlug(qr: string): string | null {
  const trimmed = qr.trim();
  if (!trimmed) return null;

  try {
    if (trimmed.includes("://")) {
      const url = new URL(trimmed);
      const segments = url.pathname.split("/").filter(Boolean);
      const idx = segments.findIndex(
        (s) => s === "restaurant" || s === "restaurants" || s === "r",
      );
      if (idx >= 0 && segments[idx + 1]) return segments[idx + 1];
      const last = segments[segments.length - 1];
      if (last) return last;
      return null;
    }
  } catch {
    // not a URL, fall through
  }

  if (/^[A-Za-z0-9_-]+$/.test(trimmed)) return trimmed;
  return null;
}

function QRScannerScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleScan = async (qrCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const slug = parseRestaurantSlug(qrCode);
      if (!slug) throw new Error("invalid_qr");

      const res = await fetch(
        `https://admin.aimenu.ge/api/v1/restaurants/${encodeURIComponent(slug)}/`,
      );
      if (!res.ok) throw new Error("not_found");

      router.navigate({
        pathname: "/restaurant-detail",
        params: { slug },
      });
    } catch (err: any) {
      const message =
        err?.message === "not_found"
          ? t("qr-scanner.notFound")
          : t("qr-scanner.error_invalid");
      setError(message);
      setTimeout(() => setError(null), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>{t("qr-scanner.title")}</Text>

      <View style={styles.frameWrap}>
        <View
          style={[
            styles.frame,
            { width: FRAME_SIZE, height: FRAME_SIZE, borderRadius: FRAME_RADIUS },
          ]}
        >
          <ScannerView onScan={handleScan} borderRadius={FRAME_RADIUS} />
        </View>
      </View>

      <Text style={styles.hint}>{t("qr-scanner.hint")}</Text>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.white} />
          <Text style={styles.loadingText}>{t("qr-scanner.loading")}</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default QRScannerScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  title: {
    ...typography.h3,
    color: colors.white,
    textAlign: "center",
    marginTop: spacing.lg,
  },
  frameWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    backgroundColor: colors.darkGrey,
    overflow: "hidden",
  },
  hint: {
    ...typography.textXs,
    color: colors.gray500,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15,23,43,0.85)",
  },
  loadingText: {
    color: colors.white,
    marginTop: spacing.sm,
    ...typography.textBase,
  },
  errorBanner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xmd,
    backgroundColor: colors.error,
    alignItems: "center",
  },
  errorText: {
    color: colors.white,
    ...typography.buttonLg,
    textAlign: "center",
  },
});
