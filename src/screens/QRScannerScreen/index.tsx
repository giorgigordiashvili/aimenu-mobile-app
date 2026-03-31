import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScannerView } from "./ScannerView";
import { tablesScanCreate } from "../../api";
import { useTranslation } from "react-i18next";
import { spacing } from "../../theme";

function QRScannerScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleScan = async (qrCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tablesScanCreate({ qr_code: qrCode });
      navigation.navigate("RestaurantDetail", {
        slug: response.data.restaurant_slug,
        sessionId: response.data.session_id,
        tableId: response.data.table_id,
      });
    } catch (err) {
      setError(t("qr-scanner.error_invalid"));
      setTimeout(() => setError(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.dark }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
