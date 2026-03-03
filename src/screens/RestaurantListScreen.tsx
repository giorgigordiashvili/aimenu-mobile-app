import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";

import { Card } from "../components/ui/Card";
import { SearchBar } from "../components/ui/SearchBar";
import { colors, spacing, borderRadius, typography } from "../theme";

const RestaurantListScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    [],
  );

  const handleSearch = (text: string) => {
    setInputValue(text);
    debouncedSearch(text);
  };

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const categoryMap = new Map();
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(
          `https://admin.aimenu.ge/api/v1/restaurants/?page=${page}`,
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();

        data.results?.forEach((restaurant: any) => {
          if (restaurant.category && restaurant.category.id) {
            const categoryName =
              restaurant.category.translations?.ka?.name ||
              restaurant.category.slug;
            categoryMap.set(restaurant.category.id, {
              id: restaurant.category.id,
              slug: restaurant.category.slug,
              name: categoryName,
            });
          }
        });

        hasMore = !!data.next;
        page++;
      }

      return Array.from(categoryMap.values());
    },
  });

  const fetchRestaurants = async ({ pageParam = 1 }) => {
    let url = `https://admin.aimenu.ge/api/v1/restaurants/?page=${pageParam}`;

    if (selectedCategory) {
      url += `&category=${selectedCategory}`;
    }

    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch restaurants");
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["restaurants", selectedCategory, searchQuery],
      queryFn: fetchRestaurants,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;

        const match = lastPage.next.match(/page=(\d+)/);
        return match ? Number(match[1]) : undefined;
      },
    });

  const restaurants = data?.pages.flatMap((page) => page.results) || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {t("home.greeting", { name: "გაგი" })}
        </Text>
        <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
      </View>

      <View style={styles.searchBar}>
        <SearchBar
          placeholder={t("home.searchPlaceholder")}
          value={inputValue}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              selectedCategory === item.id && styles.chipActive,
            ]}
            onPress={() =>
              setSelectedCategory(selectedCategory === item.id ? null : item.id)
            }
          >
            <Text
              style={
                selectedCategory === item.id
                  ? styles.chipTextActive
                  : styles.chipText
              }
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              title={item.name}
              imageUrl={item.logo}
              rating={parseFloat(item.average_rating)}
              reviewCount={item.total_reviews}
              subtitle={
                item.category?.translations?.ka?.name || item.description
              }
              isOpen={item.is_open_now}
              onPress={() =>
                router.push({
                  pathname: "/restaurant-detail",
                  params: { slug: item.slug },
                })
              }
            />
          )}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator /> : null
          }
        />
      )}
    </View>
  );
};

export default RestaurantListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: spacing.xxxl,
    marginHorizontal: spacing.md,
  },
  searchBar: {
    marginTop: spacing.md,
  },
  header: {},
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
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.lg,
  },
  chipActive: {
    backgroundColor: colors.greenButtonBackground,
  },
  chipText: {},
  chipTextActive: {
    color: colors.white,
  },
});
