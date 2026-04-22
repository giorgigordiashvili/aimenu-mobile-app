import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { colors, spacing, typography, borderRadius } from "../theme";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - spacing.md * 2;
const BANNER_HEIGHT = 157;

const BANNER_DATA = [
  { id: 1, image: require("../assets/images/Banner.png") },
  { id: 2, image: require("../assets/images/Banner.png") },
  { id: 3, image: require("../assets/images/Banner.png") },
  { id: 4, image: require("../assets/images/Banner.png") },
  { id: 5, image: require("../assets/images/Banner.png") },
];

const HomeScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const greetingName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() ||
    user?.email ||
    t("profile.name");
  const bannerScrollX = useRef(new Animated.Value(0)).current;

  const { data: popular, isLoading: popularLoading } = useQuery({
    queryKey: ["popularRestaurants"],
    queryFn: async () => {
      const res = await fetch(
        "https://admin.aimenu.ge/api/v1/restaurants/?ordering=-rating&page_size=10",
      );
      return res.json();
    },
  });

  const { data: recommended, isLoading: recommendedLoading } = useQuery({
    queryKey: ["recommendedRestaurants"],
    queryFn: async () => {
      const res = await fetch(
        "https://admin.aimenu.ge/api/v1/restaurants/?is_recommended=true",
      );
      return res.json();
    },
  });

  const popularRestaurants = popular?.results || [];
  const recommendedRestaurants = recommended?.results || [];

  if (popularLoading || recommendedLoading) {
    return <LoadingScreen />;
  }

  const renderSectionHeader = (title: string, onPress?: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.seeAll}>{t("home.seeAll")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={recommendedRestaurants}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Card
          title={item.name}
          imageUrl={item.cover_image || item.logo}
          rating={parseFloat(item.average_rating)}
          reviewCount={item.total_reviews}
          subtitle={item.category?.translations?.ka?.name}
          isOpen={item.is_open_now}
          onPress={() =>
            router.navigate({
              pathname: "/restaurant-detail",
              params: { slug: item.slug },
            })
          }
        />
      )}
      ListHeaderComponent={
        <>
          {/* Greeting */}
          <View style={styles.header}>
            <Text style={styles.greeting}>
              {t("home.greeting", { name: greetingName })}
            </Text>
            <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
          </View>

          {/* Promo Banner Carousel — fixed frame, content slides within */}
          <View style={styles.bannerSection}>
            <View style={styles.bannerFrame}>
              <Animated.FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={BANNER_WIDTH}
                snapToAlignment="start"
                disableIntervalMomentum
                data={BANNER_DATA}
                keyExtractor={(item) => item.id.toString()}
                scrollEventThrottle={16}
                removeClippedSubviews
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: bannerScrollX } } }],
                  { useNativeDriver: false },
                )}
                renderItem={({ item, index }) => {
                  const inputRange = [
                    (index - 1) * BANNER_WIDTH,
                    (index - 0.5) * BANNER_WIDTH,
                    index * BANNER_WIDTH,
                    (index + 0.5) * BANNER_WIDTH,
                    (index + 1) * BANNER_WIDTH,
                  ];
                  const imageScale = bannerScrollX.interpolate({
                    inputRange,
                    outputRange: [0.96, 0.99, 1, 0.99, 0.96],
                    extrapolate: "clamp",
                  });
                  const titleOpacity = bannerScrollX.interpolate({
                    inputRange,
                    outputRange: [0, 0.35, 1, 0.35, 0],
                    extrapolate: "clamp",
                  });
                  const titleTranslateX = bannerScrollX.interpolate({
                    inputRange,
                    outputRange: [20, 6, 0, -6, -20],
                    extrapolate: "clamp",
                  });
                  return (
                    <View style={styles.bannerSlide}>
                      <Animated.Image
                        source={item.image}
                        style={[
                          styles.bannerImage,
                          { transform: [{ scale: imageScale }] },
                        ]}
                        resizeMode="cover"
                      />
                      <Animated.Text
                        style={[
                          styles.bannerTitle,
                          {
                            opacity: titleOpacity,
                            transform: [{ translateX: titleTranslateX }],
                          },
                        ]}
                      >
                        {t("home.bannerTitle")}
                      </Animated.Text>
                    </View>
                  );
                }}
              />
            </View>

            <View style={styles.dotsContainer}>
              {BANNER_DATA.map((_, index) => {
                const inputRange = [
                  (index - 1) * BANNER_WIDTH,
                  index * BANNER_WIDTH,
                  (index + 1) * BANNER_WIDTH,
                ];
                const dotWidth = bannerScrollX.interpolate({
                  inputRange,
                  outputRange: [8, 24, 8],
                  extrapolate: "clamp",
                });
                const dotColor = bannerScrollX.interpolate({
                  inputRange,
                  outputRange: [colors.grey, colors.primary, colors.grey],
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
          </View>

          {/* Popular Section */}
          <View style={styles.section}>
            {renderSectionHeader(t("home.popularTitle"), () =>
              router.push("/restaurants"),
            )}

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={popularRestaurants}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ width: 260, marginRight: spacing.md }}>
                  <Card
                    title={item.name}
                    imageUrl={item.cover_image || item.logo}
                    rating={parseFloat(item.average_rating)}
                    reviewCount={item.total_reviews}
                    subtitle={item.category?.translations?.ka?.name}
                    isOpen={item.is_open_now}
                    onPress={() =>
                      router.navigate({
                        pathname: "/restaurant-detail",
                        params: { slug: item.slug },
                      })
                    }
                  />
                </View>
              )}
            />
          </View>

          {/* Recommended title */}
          <View style={styles.section}>
            {renderSectionHeader(t("home.recommendedTitle"))}
          </View>
        </>
      }
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
  },

  header: {
    paddingTop: spacing.xxxl,
    marginBottom: spacing.xl,
  },

  greeting: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.placeholder,
    marginBottom: spacing.xs,
  },

  subtitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
  },

  bannerSection: {
    alignItems: "center",
  },

  bannerFrame: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },

  bannerSlide: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
  },

  bannerImage: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
  },

  bannerTitle: {
    ...typography.textBase,
    color: colors.white,
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    maxWidth: 156,
    textTransform: "uppercase",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
  },

  dot: {
    height: 8,
    borderRadius: borderRadius.full,
  },

  section: {
    marginTop: spacing.xl,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    ...typography.h2,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },

  seeAll: {
    ...typography.button,
    color: colors.primary,
  },
});
