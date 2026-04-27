import { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { PermissionView } from "./PermissionView";
import { CameraView, useCameraPermissions } from "expo-camera";
import { colors } from "../../theme";

type ScannerViewProps = {
  onScan: (code: string) => void;
  borderRadius?: number;
};

export function ScannerView({ onScan, borderRadius = 0 }: ScannerViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Re-arm scanning every time the screen regains focus.
  useFocusEffect(
    useCallback(() => {
      setScanned(false);
    }, []),
  );

  if (!permission?.granted) {
    return <PermissionView onRequest={requestPermission} />;
  }

  return (
    <View
      style={[
        styles.container,
        { borderRadius, backgroundColor: colors.darkGrey },
      ]}
    >
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={
          scanned
            ? undefined
            : ({ data }) => {
                setScanned(true);
                onScan(data);
              }
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
});
