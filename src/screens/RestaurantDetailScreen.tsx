import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { borderRadius, colors, spacing, typography } from "../theme";
import { SearchBar } from "../components/ui/SearchBar";
import { Button } from "../components/Button";
import { debounce } from "lodash";
import LocationIcon from "../assets/icons/LocationIcon";
import ChefIcon from "../assets/icons/ChefIcon";
import StarIcon from "../assets/icons/StarIcon";
import CardArrow from "../assets/icons/CardArrow";

const { width } = Dimensions.get("window");
const HEADER_IMAGE_HEIGHT = 363;

interface RestaurantCategory {
  translations?: {
    ka?: { name?: string };
    en?: { name?: string };
  };
  name?: string;
}

interface MenuCategory {
  id: string;
  translations: {
    ka?: { name?: string; description?: string };
    en?: { name?: string; description?: string };
  };
  image: string | null;
  display_order: number;
  is_active: boolean;
  items_count: number;
}

interface RestaurantDetail {
  category?: string | RestaurantCategory | null;
  id: number;
  name: string;
  slug: string;
  description?: string;
  cuisine_type: string;
  rating: number;
  review_count: number;
  address?: string;
  location?: string;
  phone: string;
  cover_image: string;
  is_open: boolean;
  operating_hours: { day: string; open: string; close: string }[];
  tags?: string[];
}

export default function RestaurantDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "menu" | "reviews">(
    "info",
  );
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);

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
  useEffect(() => {
    fetchRestaurant();
    fetchMenuCategories();
  }, [slug]);

  const fetchRestaurant = async () => {
    try {
      const res = await fetch(
        `https://admin.aimenu.ge/api/v1/restaurants/${slug}/`,
      );
      const data = await res.json();
      setRestaurant(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuCategories = async () => {
    try {
      setMenuLoading(true);
      const res = await fetch(
        `https://admin.aimenu.ge/api/v1/restaurants/${slug}/menu/categories/`,
      );
      const response = await res.json();

      if (response.results && Array.isArray(response.results)) {
        // Filter active categories and sort by display order
        const activeCategories = response.results
          .filter((cat: MenuCategory) => cat.is_active)
          .sort(
            (a: MenuCategory, b: MenuCategory) =>
              a.display_order - b.display_order,
          );
        setMenuCategories(activeCategories);
      }
    } catch (e) {
      console.error("Failed to fetch menu categories:", e);
    } finally {
      setMenuLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>{t("common.loading")}</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text>{t("common.error")}</Text>
      </View>
    );
  }

  const categoryName =
    typeof restaurant.category === "string"
      ? restaurant.category
      : restaurant.category?.translations?.ka?.name ||
        restaurant.category?.translations?.en?.name ||
        restaurant.category?.name ||
        "";

  // Use menu categories from API if available, otherwise show empty state
  const cardItems = menuCategories.map((category) => {
    // Get category name based on current language
    const currentLang = i18n.language as "ka" | "en";
    const categoryName =
      category.translations?.[currentLang]?.name ||
      category.translations?.ka?.name ||
      category.translations?.en?.name ||
      "";

    return {
      id: category.id,
      title: categoryName,
      image: category.image || restaurant.cover_image,
      itemsCount: category.items_count,
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: restaurant.cover_image }}
            style={styles.heroImage}
          />

          {/* Gradient overlay */}
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "#000000"]}
            style={styles.gradient}
          />

          <BlurView intensity={68} style={styles.backButton}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ transform: [{ rotate: "180deg" }] }}
            >
              <CardArrow color={colors.white} />
            </TouchableOpacity>
          </BlurView>

          {/* Overlay content */}
          <View style={styles.heroOverlay}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <View style={styles.locationRow}>
              <LocationIcon color={colors.white} />
              <Text style={styles.location}>
                {restaurant.location ||
                  restaurant.address ||
                  t("restaurant.location")}
              </Text>
            </View>
            <Text style={styles.description}>
              {restaurant.description || t("restaurant.description")}
            </Text>

            {/* Badges row */}
            <View style={styles.badgesRow}>
              {restaurant.tags &&
                Array.isArray(restaurant.tags) &&
                restaurant.tags.length > 0 && (
                  <>
                    {restaurant.tags
                      .slice(0, 2)
                      .map((tag: string, index: number) => (
                        <View key={index} style={styles.heroBadge}>
                          <ChefIcon />
                          <Text style={styles.heroBadgeText}>{tag}</Text>
                        </View>
                      ))}
                    {restaurant.tags.length > 2 && (
                      <View style={styles.heroBadge}>
                        <Text style={styles.heroBadgeText}>
                          +{restaurant.tags.length - 2}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              {restaurant.rating !== undefined &&
                restaurant.rating !== null &&
                !isNaN(Number(restaurant.rating)) && (
                  <View style={styles.ratingBadge}>
                    <StarIcon />
                    <Text style={styles.ratingBadgeText}>
                      {Number(restaurant.rating).toFixed(1)}
                    </Text>
                  </View>
                )}
            </View>
          </View>
        </View>

        <Text style={styles.category}>
          {categoryName || t("restaurant.category")}
        </Text>

        {/* Restaurant Info */}
        <View style={styles.infoContainer}>
          <View style={styles.searchBar}>
            <SearchBar
              placeholder={t("restaurant.searchPlaceholder")}
              value={inputValue}
              onChangeText={handleSearch}
            />
          </View>

          {menuLoading ? (
            <View style={styles.center}>
              <Text>{t("common.loading")}</Text>
            </View>
          ) : cardItems.length > 0 ? (
            <View style={styles.cardsContainer}>
              {cardItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.infoCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: `/restaurant/${slug}/category/${item.id}`,
                      params: { categoryName: item.title },
                    })
                  }
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.infoCardImage}
                  />
                  <Text numberOfLines={1} style={styles.infoCardTitle}>
                    {item.title}
                  </Text>
                  <View style={styles.infoCardArrow}>
                    <CardArrow />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {t("restaurant.noCategories") || "No menu categories available"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footerActions}>
        <Button
          title={t("restaurant.button1")}
          onPress={() => {}}
          variant="outline"
          size="md"
          style={styles.footerButtonOutline}
          textStyle={styles.footerButtonText}
        />
        <Button
          title={t("restaurant.button2")}
          variant="primary"
          size="md"
          style={styles.footerButtonPrimary}
          textStyle={styles.footerButtonText}
          onPress={() => router.push("/order-review")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.state50 },

  scrollContent: {
    paddingBottom: spacing.md,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  heroContainer: { position: "relative" },

  heroImage: {
    width: width,
    height: HEADER_IMAGE_HEIGHT,
  },

  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: HEADER_IMAGE_HEIGHT,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: spacing.md,
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light,
    overflow: "hidden",
  },

  heroOverlay: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
  },

  name: {
    ...typography.h4,
    fontWeight: typography.h1.fontWeight,
    color: colors.white,
    marginBottom: spacing.md,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },

  category: {
    ...typography.h1,
    fontWeight: typography.h2.fontWeight,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },

  location: {
    ...typography.body,
    color: colors.white,
  },

  description: {
    ...typography.body,
    color: colors.white,
    marginBottom: spacing.md,
  },

  badgesRow: {
    flexDirection: "row",
    gap: spacing.xs,
    flexWrap: "wrap",
  },

  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },

  heroBadgeText: {
    fontSize: typography.textXs.fontSize,
    fontWeight: typography.textXs.fontWeight,
    color: colors.white,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },

  ratingBadgeText: {
    fontSize: typography.rating.fontSize,
    fontWeight: typography.rating.fontWeight,
    color: colors.black,
  },

  infoContainer: {
    padding: spacing.md,
  },

  searchBar: {},

  cardsContainer: {
    marginTop: spacing.xs,
    gap: spacing.sm,
  },

  infoCard: {
    height: 81,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  infoCardImage: {
    width: 54,
    height: 53,
    borderRadius: borderRadius.md,
  },

  infoCardTitle: {
    ...typography.button,
    color: colors.dark,
    flex: 1,
    marginHorizontal: spacing.md,
  },

  infoCardArrow: {
    marginRight: spacing.md,
  },

  footerActions: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    backgroundColor: colors.white,
  },

  footerButtonOutline: {
    flex: 1,
    borderRadius: borderRadius.full,
    minHeight: 52,
    height: undefined,
  },

  footerButtonPrimary: {
    flex: 1,
    borderRadius: borderRadius.full,
    minHeight: 52,
    height: undefined,
  },

  footerButtonText: {
    textAlign: "center",
  },

  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },

  emptyStateText: {
    ...typography.body,
    color: colors.grey,
    textAlign: "center",
  },
});
