import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { colors, spacing, typography, borderRadius } from "../theme";
import { SearchBar } from "../components/ui/SearchBar";
import PlusIcon from "../assets/icons/PlusIcon";
import BackArrowIcon from "../assets/icons/BackArrowIcon";

interface MenuItem {
  id: number;
  image: string | null;
  price: string;
  translations: {
    ka?: { name?: string; description?: string };
    en?: { name?: string; description?: string };
  };
}

export default function MenuItemsListScreen() {
  const { slug, categoryId, categoryName } = useLocalSearchParams<{
    slug: string;
    categoryId: string;
    categoryName?: string;
  }>();

  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchItems();
  }, [slug, categoryId]);

  useEffect(() => {
    filterItems();
  }, [searchQuery, allItems]);

  const filterItems = () => {
    let filtered = allItems;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = allItems.filter((item) => {
        const name =
          item.translations?.[i18n.language as "ka" | "en"]?.name ||
          item.translations?.ka?.name ||
          "";
        const description =
          item.translations?.[i18n.language as "ka" | "en"]?.description ||
          item.translations?.ka?.description ||
          "";
        return (
          name.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query)
        );
      });
    }

    setFilteredItems(filtered);
  };

  const fetchItems = async () => {
    try {
      const res = await fetch(
        `https://admin.aimenu.ge/api/v1/restaurants/${slug}/menu/items/?category=${categoryId}`,
      );

      const data = await res.json();

      if (data.results) {
        setAllItems(data.results);
      }
    } catch (e) {
      console.error("Failed to fetch items:", e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: MenuItem }) => {
    const name =
      item.translations?.[i18n.language as "ka" | "en"]?.name ||
      item.translations?.ka?.name;

    const description =
      item.translations?.[i18n.language as "ka" | "en"]?.description ||
      item.translations?.ka?.description;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() =>
            router.push(`/(tabs)/restaurant/${slug}/item/${item.id}`)
          }
        >
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.image} />
          )}

          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>

            {description ? (
              <Text numberOfLines={1} style={styles.description}>
                {description}
              </Text>
            ) : null}

            <Text style={styles.price}>{item.price} ₾</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}>
          <PlusIcon />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <BackArrowIcon />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{categoryName || "Menu"}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder={t("restaurant.searchPlaceholder")}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        <TouchableOpacity style={[styles.chip, styles.chipActive]}>
          <Text style={styles.chipTextActive}>{t("restaurant.all")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip}>
          <Text style={styles.chipText}>
            {categoryName || t("restaurant.category")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.subtitle}>{t("restaurant.category2")}</Text>
      {/* Items list */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
  },

  headerTitle: {
    ...typography.h3,
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },

  searchContainer: {
    paddingHorizontal: spacing.md,
  },

  tabsContainer: {
    paddingHorizontal: spacing.md,
    flexGrow: 0,
  },

  tabsContent: {
    paddingBottom: spacing.xs,
  },

  subtitle: {
    ...typography.h4,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    color: colors.dark,
    fontWeight: typography.buttonLg.fontWeight,
  },

  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 40,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.light,
  },

  chipText: {
    fontSize: typography.textXs.fontSize,
    lineHeight: typography.textSm.lineHeight,
    fontWeight: typography.buttonSm.fontWeight,
    color: colors.dark,
  },

  chipActive: {
    backgroundColor: colors.greenButtonBackground,
    borderColor: colors.greenButtonBackground,
  },

  chipTextActive: {
    fontSize: typography.textXs.fontSize,
    lineHeight: typography.textSm.lineHeight,
    fontWeight: typography.buttonSm.fontWeight,
    color: colors.white,
  },

  list: {
    padding: spacing.md,
    paddingTop: 0,
    flexGrow: 0,
  },

  card: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    overflow: "visible",
    backgroundColor: colors.white,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },

  image: {
    width: 78,
    height: 76,
    borderRadius: borderRadius.md,
  },

  info: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  name: {
    ...typography.textSm,
    marginBottom: spacing.xs,
    fontWeight: typography.h2.fontWeight,
  },

  description: {
    ...typography.textXs,
    color: colors.darkGrey,
    marginBottom: spacing.xs,
  },

  price: {
    fontSize: typography.paragraph.fontSize,
    fontWeight: typography.h1.fontWeight,
  },

  addButton: {
    width: 42,
    height: 42,
    alignSelf: "flex-start",
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    marginTop: spacing.md,
    marginRight: spacing.md,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    ...typography.body,
    color: colors.grey,
  },
});
