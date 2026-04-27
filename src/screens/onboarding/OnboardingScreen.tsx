import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { colors, typography, spacing, borderRadius } from "../../theme";
import { Button } from "../../components/Button";
import { textColors } from "../../theme/colors";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";

const { width } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  description: string;
  image: number;
}

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const slides: Slide[] = [
    {
      id: "1",
      title: t("onboarding.slide1Title"),
      description: t("onboarding.slide1Description"),
      image: require("../../assets/onboarding/slide1.png"),
    },
    {
      id: "2",
      title: t("onboarding.slide2Title"),
      description: t("onboarding.slide2Description"),
      image: require("../../assets/onboarding/slide2.png"),
    },
    {
      id: "3",
      title: t("onboarding.slide3Title"),
      description: t("onboarding.slide3Description"),
      image: require("../../assets/onboarding/slide3.png"),
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const isLastSlide = currentIndex === slides.length - 1;

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    if (isLastSlide) {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/login");
  };

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => {
    // 5-stop ease-out-like curve — less motion near the edges, holds content visible longer
    const inputRange = [
      (index - 1) * width,
      (index - 0.5) * width,
      index * width,
      (index + 0.5) * width,
      (index + 1) * width,
    ];

    const imageTranslateX = scrollX.interpolate({
      inputRange,
      outputRange: [
        width * 0.08,
        width * 0.02,
        0,
        -width * 0.02,
        -width * 0.08,
      ],
      extrapolate: "clamp",
    });

    const textOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 0.6, 1, 0.6, 0],
      extrapolate: "clamp",
    });

    const textTranslateY = scrollX.interpolate({
      inputRange,
      outputRange: [10, 3, 0, 3, 10],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.slide}>
        <View style={styles.imageWrapper}>
          <Animated.Image
            source={item.image}
            style={[
              styles.image,
              { transform: [{ translateX: imageTranslateX }] },
            ]}
          />
        </View>
        <View style={styles.contentContainer}>
          <Animated.View
            style={[
              styles.textWrapper,
              {
                opacity: textOpacity,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Animated.View>
        </View>
      </View>
    );
  };

  const lastSlideX = (slides.length - 1) * width;
  const primaryButtonsOpacity = scrollX.interpolate({
    inputRange: [lastSlideX - width, lastSlideX],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const getStartedOpacity = scrollX.interpolate({
    inputRange: [lastSlideX - width, lastSlideX],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Language Switcher */}
      <View style={styles.languageSwitcherContainer}>
        <LanguageSwitcher />
      </View>
      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef as any}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={handleMomentumEnd}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 32, 8],
            extrapolate: "clamp",
          });
          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: [colors.light, colors.primary, colors.light],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { width: dotWidth, backgroundColor: dotColor },
              ]}
            />
          );
        })}
      </View>

      {/* Buttons — cross-fade between skip/next and getStarted as the last slide is approached */}
      <View style={styles.buttonRow}>
        <Animated.View
          pointerEvents={isLastSlide ? "none" : "auto"}
          style={[styles.buttonStack, { opacity: primaryButtonsOpacity }]}
        >
          <View style={styles.buttonLeft}>
            <Button
              title={t("onboarding.skip")}
              onPress={handleSkip}
              variant="secondary"
              fullWidth
            />
          </View>
          <View style={styles.buttonRight}>
            <Button
              title={t("onboarding.next")}
              onPress={handleNext}
              fullWidth
            />
          </View>
        </Animated.View>
        <Animated.View
          pointerEvents={isLastSlide ? "auto" : "none"}
          style={[styles.buttonStack, { opacity: getStartedOpacity }]}
        >
          <Button
            title={t("onboarding.getStarted")}
            onPress={handleNext}
            fullWidth
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
  },
  languageSwitcherContainer: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 100,
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
  imageWrapper: {
    width: "100%",
    height: 393,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    marginTop: -12,
  },
  textWrapper: {
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    textAlign: "center",
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
    height: 8,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    marginTop: spacing.xxxl,
  },
  buttonRow: {
    height: 44,
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxl,
    marginHorizontal: spacing.lg,
  },
  buttonStack: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
