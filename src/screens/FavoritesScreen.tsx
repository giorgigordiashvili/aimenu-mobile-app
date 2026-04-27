import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card } from "../components/ui/Card";
import FavoriteDishCard from "../components/ui/FavoriteDishCard";
import { useRouter } from "expo-router";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import { TabButton } from "../components/ui/TabButton";
import { borderRadius, spacing } from "../theme";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { api } from "../services";

type TabType = "restaurants" | "dishes";

export default function FavoritesScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("restaurants");
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  // Restaurants
  const { data: restaurants, isLoading: loadingRestaurants } = useQuery({
    queryKey: ["favorites", "restaurants"],
    queryFn: () => api.get("/api/favorites/restaurants/"),
  });

  // Dishes
  const { data: dishes, isLoading: loadingDishes } = useQuery({
    queryKey: ["favorites", "dishes"],
    queryFn: () => api.get("/api/favorites/menu-items/"),
  });

  // Toggle restaurant
  const toggleRestaurant = useMutation({
    mutationFn: (id: number) =>
      api.post(`/api/favorites/restaurants/${id}/toggle/`),
    onSuccess: () => queryClient.invalidateQueries(["favorites"]),
  });

  // Toggle dish
  const toggleDish = useMutation({
    mutationFn: (id: number) =>
      api.post(`/api/favorites/menu-items/${id}/toggle/`),
    onSuccess: () => queryClient.invalidateQueries(["favorites"]),
  });

  const isEmpty =
    activeTab === "restaurants"
      ? !restaurants?.data?.length
      : !dishes?.data?.length;

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{t("favorites.empty")}</Text>
      <Text style={styles.emptyDescription}>
        {t("favorites.emptyDescription")}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("favorites.title")}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TabButton
          title={t("favorites.restaurants")}
          active={activeTab === "restaurants"}
          onPress={() => setActiveTab("restaurants")}
        />
        <TabButton
          title={t("favorites.dishes")}
          active={activeTab === "dishes"}
          onPress={() => setActiveTab("dishes")}
        />
      </View>

      {/* Content */}
      {isEmpty ? (
        <EmptyState />
      ) : (
        <FlatList
          data={activeTab === "restaurants" ? restaurants?.data : dishes?.data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) =>
            activeTab === "restaurants" ? (
              <Card
                restaurant={item}
                isFavorite
                onPress={() =>
                  router.navigate({
                    pathname: "/restaurant-detail",
                    params: { slug: item.slug },
                  })
                }
                onToggleFavorite={() => toggleRestaurant.mutate(item.id)}
              />
            ) : (
              <FavoriteDishCard
                dish={item}
                onToggleFavorite={() => toggleDish.mutate(item.id)}
                onPress={() => {
                  const dishSlug =
                    item.restaurant_slug || item.restaurant?.slug;
                  if (!dishSlug) return;
                  router.push(`/restaurant/${dishSlug}/item/${item.id}`);
                }}
              />
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.state50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: typography.textSm.fontSize,
    fontWeight: typography.h1.fontWeight,
    flex: 1,
    textAlign: "center",
    marginLeft: "auto",
  },
  tabsRow: {
    flexDirection: "row",
    marginVertical: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  emptyDescription: {
    fontSize: typography.textSm.fontSize,
    color: colors.gray500,
  },
});
