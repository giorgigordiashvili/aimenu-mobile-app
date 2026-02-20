import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { router, useRouter } from "expo-router";
import { colors } from "../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");

      setTimeout(() => {
        if (seen === "true") {
          router.replace("/login");
        } else {
          router.replace("/onboarding");
        }
      }, 2000);
    };

    checkOnboarding();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/onboarding/logo.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: "contain",
  },
});
