import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { colors, typography, spacing } from "../../theme";
import { Button } from "../../components/Button";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "აღმოაჩინე რესტორნები",
    description: "იპოვე საუკეთესო რესტორნები შენს გარშემო",
    image: require("../../assets/onboarding/slide1.png"),
  },
  {
    id: "2",
    title: "დაჯავშნე მაგიდა",
    description: "მარტივად დაჯავშნე მაგიდა რამდენიმე დაჭერით",
    image: require("../../assets/onboarding/slide2.png"),
  },
  {
    id: "3",
    title: "შეუკვეთე საჭმელი",
    description: "დაასკანერე QR და შეუკვეთე პირდაპირ აპიდან",
    image: require("../../assets/onboarding/slide3.png"),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const isLastSlide = currentIndex === slides.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    if (isLastSlide) {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/login");
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <Text style={styles.skipText} onPress={handleSkip}>
          გამოტოვება
        </Text>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const active = index === currentIndex;
          return (
            <View
              key={index}
              style={[styles.dot, active && styles.activeDot]}
            />
          );
        })}
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isLastSlide ? "დაწყება" : "შემდეგი"}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipContainer: {
    alignItems: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  skipText: {
    color: colors.gray500,
    ...typography.paragraph,
  },
  slide: {
    width,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  image: {
    width: 280,
    height: 280,
    resizeMode: "contain",
  },
  title: {
    ...typography.h1,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  description: {
    ...typography.paragraph,
    color: colors.gray500,
    textAlign: "center",
    marginTop: spacing.md,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray500,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    marginTop: spacing.lg,
  },
});
