import React from "react";
import { View, Image, StyleSheet, Text, ActivityIndicator } from "react-native";
import { typography } from "../theme/typography";
import { shadowColors } from "../theme/colors";
import { colors, spacing } from "../theme";

interface LoadingScreenProps {
  showBranding?: boolean;
}

export default function LoadingScreen({
  showBranding = true,
}: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      {showBranding && (
        <>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../assets/onboarding/logo.png")}
              style={styles.logo}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.title}>მაგიდა</Text>
          </View>
        </>
      )}
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spinner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 114,
    height: 108,
    resizeMode: "contain",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: 28,
    shadowColor: shadowColors.color,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 16,
  },
  textWrapper: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.splashTitle,
    color: colors.dark,
  },
  spinner: {
    marginTop: spacing.xl,
  },
});
