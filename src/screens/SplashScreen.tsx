import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { typography } from "../theme/typography";
import { shadowColors, textColors } from "../theme/colors";
import { colors } from "../theme";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (!isMounted) return;

        const hasSeenOnboarding =
          await AsyncStorage.getItem("hasSeenOnboarding");
        if (!hasSeenOnboarding || hasSeenOnboarding !== "true") {
          router.replace("/onboarding");
        } else {
          // Check if user is logged in (implement your logic here)
          const token = await AsyncStorage.getItem("auth_token");
          if (token) {
            router.replace("/(tabs)");
          } else {
            router.replace("/login");
          }
        }
      } catch (error) {
        router.replace("/login");
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/onboarding/logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>მაგიდა</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
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
});
