import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScannerView } from "./ScannerView";
import { useTranslation } from "react-i18next";
import { spacing } from "../../theme";
import { useRouter } from "expo-router";

function parseRestaurantSlug(qr: string): string | null {
  const trimmed = qr.trim();
  if (!trimmed) return null;

  // URL form: try to pull the segment after /restaurant(s)/ or /r/
  try {
    if (trimmed.includes("://")) {
      const url = new URL(trimmed);
      const segments = url.pathname.split("/").filter(Boolean);
      const idx = segments.findIndex(
        (s) => s === "restaurant" || s === "restaurants" || s === "r",
      );
      if (idx >= 0 && segments[idx + 1]) return segments[idx + 1];
      // Fallback: last non-empty segment
      const last = segments[segments.length - 1];
      if (last) return last;
      return null;
    }
  } catch {
    // not a URL, fall through to plain-slug handling
  }

  // Plain slug form: lowercase letters/digits/hyphens/underscores only
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

      router.push({
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            color={colors.white}
            size={24}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{t("qr-scanner.title")}</Text>
      </View>

      <ScannerView onScan={handleScan} />

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
      <TouchableOpacity
        onPress={() => handleScan("gordumlo")}
        style={{ backgroundColor: "red", padding: 10 }}
      >
        <Text style={{ color: "white" }}>TEST SCAN</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default QRScannerScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  title: {
    color: colors.white,
    ...typography.h2,
    fontWeight: typography.h2.fontWeight || "700",
    marginLeft: spacing.md,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.darkGrey,
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
