// src/screens/QRScannerScreen/ScannerView.tsx
import {
  Camera,
  CameraType,
  useCameraPermissions,
  BarCodeScannedCallback,
} from "expo-camera";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { PermissionView } from "./PermissionView";
import { QROverlay } from "./QROverlay";

type ScannerViewProps = {
  onScan: (code: string) => void;
};

export function ScannerView({ onScan }: ScannerViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission?.granted) {
    return <PermissionView onRequest={requestPermission} />;
  }

  const handleBarCodeScanned: BarCodeScannedCallback = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      onScan(data);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={StyleSheet.absoluteFill}
        type={CameraType.back}
        onBarCodeScanned={handleBarCodeScanned}
      >
        <QROverlay />
      </Camera>
    </View>
  );
}
