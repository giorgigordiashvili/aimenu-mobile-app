import { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { PermissionView } from "./PermissionView";
import { QROverlay } from "./QROverlay";
import { CameraView, useCameraPermissions } from "expo-camera";
import { colors } from "../../theme";

type ScannerViewProps = {
  onScan: (code: string) => void;
};

export function ScannerView({ onScan }: ScannerViewProps) {
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
    <View style={{ flex: 1, backgroundColor: colors.darkGrey }}>
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
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <QROverlay />
      </View>
    </View>
  );
}
