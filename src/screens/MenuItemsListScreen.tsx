import React, { useContext, useEffect, useRef, useState } from "react";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
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
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing, typography, borderRadius } from "../theme";
import { SearchBar } from "../components/ui/SearchBar";
import {
  OptionPickerModal,
  PickerOption,
} from "../components/ui/OptionPickerModal";
import PlusIcon from "../assets/icons/PlusIcon";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import ButtonArrowIcon from "../assets/icons/ButtonArrowIcon";
import DropdownArrowIcon from "../assets/icons/DropdownArrowIcon";
import FilterIcon from "../assets/icons/FilterIcon";
import { useCart } from "../context/CartContext";
import { Button } from "../components/Button";

type ItemSort = "default" | "nameAsc" | "priceAsc" | "priceDesc";


interface MenuItem {
  id: number;
  image: string | null;
  price: string;
  translations: {
    [lang: string]: { name?: string; description?: string } | undefined;
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
  const { addItem, updateQuantity, items, totalItems } = useCart();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;

  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<ItemSort>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (totalItems === 0) {
      setExpanded(false);
    }
  }, [totalItems]);

  const checkoutAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(checkoutAnim, {
      toValue: totalItems > 0 ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [totalItems, checkoutAnim]);

  const arrowRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(arrowRotation, {
      toValue: expanded ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [expanded, arrowRotation]);

  const ctaTranslateY = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);
  const isCtaVisible = useRef(true);

  const showCta = React.useCallback(() => {
    if (isCtaVisible.current) return;
    isCtaVisible.current = true;

    Animated.parallel([
      Animated.timing(ctaTranslateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [ctaOpacity, ctaTranslateY]);

  const hideCta = React.useCallback(() => {
    if (!isCtaVisible.current) return;
    isCtaVisible.current = false;

    Animated.parallel([
      Animated.timing(ctaTranslateY, {
        toValue: 120,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(ctaOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [ctaOpacity, ctaTranslateY]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const delta = currentY - lastScrollY.current;

    if (currentY <= 0) {
      showCta();
      lastScrollY.current = currentY;
      return;
    }

    if (delta > 6) {
      hideCta();
    } else if (delta < -6) {
      showCta();
    }

    lastScrollY.current = currentY;
  };

  useEffect(() => {
    fetchItems();
  }, [slug, categoryId]);

  useEffect(() => {
    filterItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sort, allItems, i18n.language]);

  const getItemName = (item: MenuItem) =>
    item.translations?.[i18n.language]?.name ||
    item.translations?.ka?.name ||
    "";

  const filterItems = () => {
    let filtered = allItems;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = allItems.filter((item) => {
        const name = getItemName(item);
        const description =
          item.translations?.[i18n.language]?.description ||
          item.translations?.ka?.description ||
          "";
        return (
          name.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query)
        );
      });
    }

    if (sort !== "default") {
      filtered = [...filtered].sort((a, b) => {
        if (sort === "nameAsc") {
          return getItemName(a).localeCompare(getItemName(b), i18n.language);
        }
        const pa = parseFloat(a.price);
        const pb = parseFloat(b.price);
        return sort === "priceAsc" ? pa - pb : pb - pa;
      });
    }

    setFilteredItems(filtered);
  };

  const sortOptions: PickerOption[] = [
    { value: "default", label: t("sort.default") },
    { value: "nameAsc", label: t("sort.nameAsc") },
    { value: "priceAsc", label: t("sort.priceAsc") },
    { value: "priceDesc", label: t("sort.priceDesc") },
  ];

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
      item.translations?.[i18n.language]?.name ||
      item.translations?.ka?.name;

    const description =
      item.translations?.[i18n.language]?.description ||
      item.translations?.ka?.description;

    const cartItem = items.find((i) => i.itemId === item.id);
    const quantity = cartItem?.quantity ?? 0;
    const isSelected = quantity > 0;

    return (
      <View style={[styles.card, isSelected && styles.cardSelected]}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => router.push(`/restaurant/${slug}/item/${item.id}`)}
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

        {isSelected ? (
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => updateQuantity(item.id, quantity - 1)}
            >
              <Text style={styles.stepperMinus}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepperQty}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.stepperBtn, styles.stepperBtnPlus]}
              onPress={() => updateQuantity(item.id, quantity + 1)}
            >
              <PlusIcon color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              addItem({
                itemId: item.id,
                slug,
                name: name || "",
                price: parseFloat(item.price),
                quantity: 1,
                image: item.image || undefined,
                modifiers: [],
              })
            }
          >
            <PlusIcon />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const ListHeader = (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <BackArrowIcon />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{categoryName || "Menu"}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.searchFlex}>
            <SearchBar
              placeholder={t("restaurant.searchPlaceholder")}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortOpen(true)}
            activeOpacity={0.8}
            accessibilityLabel={t("sort.button")}
          >
            <FilterIcon color={colors.dark} />
          </TouchableOpacity>
        </View>
      </View>

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
    </>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          {ListHeader}
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.list}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t("common.noItemsFound")}</Text>
            </View>
          }
        />
      )}

      {totalItems > 0 && expanded && (
        <View
          style={[
            styles.summaryPanel,
            {
              paddingBottom:
                tabBarHeight > 0
                  ? spacing.md
                  : Math.max(insets.bottom, spacing.md),
            },
          ]}
        >
          <TouchableOpacity
            style={styles.summaryHandle}
            activeOpacity={0.7}
            onPress={() => setExpanded(false)}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: arrowRotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "180deg"],
                    }),
                  },
                ],
              }}
            >
              <DropdownArrowIcon
                width={12}
                height={6}
                color={colors.black}
                opacity={1}
              />
            </Animated.View>
          </TouchableOpacity>

          {items.map((cartItem, index) => (
            <View
              key={cartItem.itemId}
              style={[
                styles.summaryRow,
                index !== items.length - 1 && styles.summaryRowDivider,
              ]}
            >
              <View style={styles.summaryQtyBadge}>
                <Text style={styles.summaryQtyText}>{cartItem.quantity}x</Text>
              </View>
              <Text
                style={styles.summaryName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {cartItem.name}
              </Text>
              <Text style={styles.summaryPrice}>
                {(cartItem.price * cartItem.quantity).toFixed(2)} ₾
              </Text>
            </View>
          ))}

          <View style={styles.summaryButtons}>
            <Button
              title={t("restaurant.button1")}
              onPress={() =>
                router.push({
                  pathname: "/reservation",
                  params: { slug },
                })
              }
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
              onPress={() => router.push({ pathname: "/order-review" })}
            />
          </View>
        </View>
      )}

      <OptionPickerModal
        visible={sortOpen}
        title={t("sort.title")}
        options={sortOptions}
        selectedValue={sort}
        onSelect={(v) => setSort(v as ItemSort)}
        onClose={() => setSortOpen(false)}
      />

      {!(totalItems > 0 && expanded) && (
        <Animated.View
          style={[
            styles.footerActions,
            totalItems > 0 && styles.footerActionsCheckout,
            {
              opacity: ctaOpacity,
              transform: [{ translateY: ctaTranslateY }],
            },
          ]}
        >
          {totalItems > 0 ? (
            <Animated.View
              style={{
                flex: 1,
                opacity: checkoutAnim,
                transform: [
                  {
                    translateY: checkoutAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [80, 0],
                    }),
                  },
                ],
              }}
            >
              <Button
                title={t("restaurant.button2")}
                variant="primary"
                size="md"
                style={styles.footerButtonPrimary}
                textStyle={styles.footerButtonText}
                onPress={() => setExpanded(true)}
                leftIcon={
                  <View style={styles.checkoutBadge}>
                    <Text style={styles.checkoutBadgeText}>x{totalItems}</Text>
                  </View>
                }
                rightIcon={
                  <View style={styles.checkoutArrow}>
                    <ButtonArrowIcon />
                  </View>
                }
              />
            </Animated.View>
          ) : (
            <>
              <Button
                title={t("restaurant.button1")}
                onPress={() =>
                  router.push({
                    pathname: "/reservation",
                    params: { slug },
                  })
                }
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
                onPress={() =>
                  router.push({
                    pathname: "/order-review",
                  })
                }
              />
            </>
          )}
        </Animated.View>
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

  searchRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },

  searchFlex: {
    flex: 1,
  },

  sortButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
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
    paddingBottom: spacing.md,
    flexGrow: 1,
  },

  card: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    overflow: "visible",
    backgroundColor: colors.white,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -15 },
        shadowOpacity: 0.05,
        shadowRadius: 42.5,
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

  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: colors.primaryLightest,
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: spacing.md,
    marginRight: spacing.md,
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light,
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -15 },
        shadowOpacity: 0.05,
        shadowRadius: 42.5,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  stepperBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  stepperBtnPlus: {
    backgroundColor: colors.dangerSoftBackground,
    borderRadius: borderRadius.md,

  },

  stepperMinus: {
    ...typography.buttonLg,
    color: colors.dark,
    lineHeight: 20,
  },

  stepperPlus: {
    ...typography.buttonLg,
    color: colors.primary,
    lineHeight: 20,
  },

  stepperQty: {
    ...typography.buttonLg,
    minWidth: 24,
    textAlign: "center",
    color: colors.dark,
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

  footerActions: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },

  footerActionsCheckout: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderTopColor: "transparent",
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: spacing.xxl,
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
    justifyContent: "space-between",
  },

  footerButtonText: {
    textAlign: "center",
   ...typography.buttonSm,
   fontWeight: typography.h1.fontWeight,

  },

  checkoutBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  checkoutBadgeText: {
    ...typography.buttonSm,
    color: colors.black,
  },

  checkoutArrow: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryPanel: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -15 },
        shadowOpacity: 0.05,
        shadowRadius: 42.5,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  summaryHandle: {
    position: "absolute",
    top: -14,
    alignSelf: "center",
    width: 55,
    height: 30,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
   
    }),
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },

  summaryRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.state100,
  },

  summaryQtyBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.dangerSoftBackground,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  summaryQtyText: {
    ...typography.buttonSm,
    color: colors.primary,
    fontWeight: typography.h1.fontWeight,
  },

  summaryName: {
    flex: 1,
    ...typography.textXs,
    color: colors.darkGrey,
  },

  summaryPrice: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: typography.h2.fontWeight,
  },

  summaryButtons: {
    flexDirection: "row",
    gap: spacing.md,
    paddingTop: spacing.md,
  },
});
