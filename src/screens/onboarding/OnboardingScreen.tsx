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

import { colors, typography, spacing, borderRadius } from "../../theme";
import { Button } from "../../components/Button";
import { textColors } from "../../theme/colors";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "აღმოაჩინე საუკეთესო გემოები",
    description: "იპოვე შენი საყვარელი კერძები და რესტორნები ქალაქში.",
    image: require("../../assets/onboarding/slide1.png"),
  },
  {
    id: "2",
    title: "დაჯავშნე მაგიდა მარტივად",
    description: "აირჩიე სასურველი დრო და ადგილი სულ რამდენიმე წამში.",
    image: require("../../assets/onboarding/slide2.png"),
  },
  {
    id: "3",
    title: "ისიამოვნე დაუვიწყარი გარემოთი",
    description: "გაატარე დრო მეგობრებთან ერთად საუკეთესო გარემოში.",
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
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
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
      <View style={styles.buttonRow}>
        <View style={styles.buttonLeft}>
          <Button
            title="გამოტოვება"
            onPress={handleSkip}
            variant="secondary"
            fullWidth
          />
        </View>
        <View style={styles.buttonRight}>
          <Button
            title={isLastSlide ? "დაწყება" : "შემდეგი"}
            onPress={handleNext}
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  buttonLeft: {
    flex: 1,
    marginRight: 16,
  },
  buttonRight: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    backgroundColor: colors.white,
  },
  image: {
    width: "100%",
    height: 393,
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    marginTop: -12,
  },
  title: {
    ...typography.h1,
    textAlign: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  description: {
    ...typography.textSm,
    color: textColors.tertiary,
    textAlign: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.light,
    marginHorizontal: spacing.xs,
  },
  activeDot: {
    width: 32,
    backgroundColor: colors.primary,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    marginTop: spacing.xxxl,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    marginTop: spacing.xxxl,
  },
});
