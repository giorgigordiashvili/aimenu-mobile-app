import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../theme";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const seen = await AsyncStorage.getItem("hasSeenOnboarding");

        // Optional splash delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (!isMounted) return;

        router.replace(seen === "true" ? "/login" : "/onboarding");
      } catch (error) {
        // Fallback in case of error
        router.replace("/onboarding");
      }
    };

    init();

    return () => {
      isMounted = false;
    };
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
