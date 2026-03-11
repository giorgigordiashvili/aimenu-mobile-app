import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { PromoBanner } from "../components/PromoBanner";
import { colors, spacing, typography, borderRadius } from "../theme";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - spacing.md * 2;

// Banner data constant - moved outside component to avoid recreation on render
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
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Stable reference for viewabilityConfig
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Stable callback reference using useCallback
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentBannerIndex(viewableItems[0].index);
    }
  }, []);

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
    return <ActivityIndicator style={{ flex: 1 }} />;
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
            router.push({
              pathname: "/(tabs)/restaurant-detail",
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
              {t("home.greeting", { name: "გაგი" })}
            </Text>
            <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
          </View>

          {/* Promo Banner Carousel */}
          <View style={styles.bannerWrapper}>
            <FlatList
              horizontal
              data={BANNER_DATA}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={BANNER_WIDTH + spacing.md}
              decelerationRate="fast"
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              renderItem={({ item, index }) => (
                <View style={{ marginRight: spacing.md }}>
                  <PromoBanner
                    image={item.image}
                    title={t("home.bannerTitle")}
                    currentIndex={currentBannerIndex}
                    totalCount={BANNER_DATA.length}
                  />
                </View>
              )}
            />
          </View>

          {/* Popular Section */}
          <View style={styles.section}>
            {renderSectionHeader(t("home.popularTitle"), () =>
              router.push("/(tabs)/restaurants"),
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
                      router.push({
                        pathname: "/(tabs)/restaurant-detail",
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

  bannerWrapper: {},

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
