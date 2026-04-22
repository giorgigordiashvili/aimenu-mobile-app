import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import { Card } from "../components/ui/Card";
import { SearchBar } from "../components/ui/SearchBar";
import {
  OptionPickerModal,
  PickerOption,
} from "../components/ui/OptionPickerModal";
import { DatePickerModal } from "../components/reservation/DatePickerModal";
import { TimeSlotModal, Slot } from "../components/reservation/TimeSlotModal";
import { getDateLocale } from "../i18n";
import { colors, spacing, borderRadius, typography } from "../theme";
import CalendarIcon from "../assets/icons/CalendarIcon";
import TimeIcon from "../assets/icons/TimeIcon";
import PersonIcon from "../assets/icons/PersonIcon";
import DropdownArrowIcon from "../assets/icons/DropdownArrowIcon";
import LocationIcon from "../assets/icons/LocationIcon";
import SearchIcon from "../assets/icons/SearchIcon";

const CITY_VALUES = ["tbilisi", "batumi", "kutaisi", "rustavi", "gori"];
const GUEST_VALUES = ["1", "2", "3", "4", "5", "6", "7", "8"];

const TIME_SLOTS: Slot[] = (() => {
  const slots: Slot[] = [];
  for (let h = 12; h <= 23; h++) {
    for (const m of [0, 30]) {
      slots.push({
        time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        available: true,
      });
    }
  }
  return slots;
})();

const HeroImage = require("../assets/images/RestaurantListBackground.png");

const { width } = Dimensions.get("window");
const HERO_HEIGHT = 351;

const RestaurantListScreen = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<string | null>(null);

  const [openPicker, setOpenPicker] = useState<
    "city" | "date" | "time" | "guests" | null
  >(null);

  type AppliedFilters = {
    city: string | null;
    date: string | null;
    time: string | null;
    guests: string | null;
  };
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    city: null,
    date: null,
    time: null,
    guests: null,
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      city: selectedLocation,
      date: selectedDate,
      time: selectedTime,
      guests: selectedGuests,
    });
    // Flush any unflushed search-bar input so Search reflects what's typed.
    if (inputValue !== searchQuery) {
      setSearchQuery(inputValue);
    }
  };

  const placeholder = t("restaurantList.selectPlaceholder");

  const cityOptions: PickerOption[] = CITY_VALUES.map((value) => ({
    value,
    label: t(`restaurantList.cities.${value}`),
  }));

  const guestOptions: PickerOption[] = GUEST_VALUES.map((value) => ({
    value,
    label: t("restaurantList.guestsCount", { count: Number(value) }),
  }));

  const cityLabel = selectedLocation
    ? t(`restaurantList.cities.${selectedLocation}`)
    : placeholder;

  const dateLabel = selectedDate
    ? (() => {
        const [y, m, d] = selectedDate.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString(
          getDateLocale(i18n.language),
          { day: "2-digit", month: "short" },
        );
      })()
    : placeholder;

  const timeLabel = selectedTime ?? placeholder;

  const guestsLabel = selectedGuests
    ? t("restaurantList.guestsCount", { count: Number(selectedGuests) })
    : placeholder;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearch = (text: string) => {
    setInputValue(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(text);
    }, 600);
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
    const params = new URLSearchParams();
    params.set("page", String(pageParam));

    if (selectedCategory) params.set("category", String(selectedCategory));
    if (searchQuery) params.set("search", searchQuery);
    if (appliedFilters.city) params.set("city", appliedFilters.city);
    if (appliedFilters.date) params.set("date", appliedFilters.date);
    if (appliedFilters.time) params.set("time", appliedFilters.time);
    if (appliedFilters.guests) params.set("guests", appliedFilters.guests);

    const res = await fetch(
      `https://admin.aimenu.ge/api/v1/restaurants/?${params.toString()}`,
    );
    if (!res.ok) throw new Error("Failed to fetch restaurants");
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["restaurants", selectedCategory, searchQuery, appliedFilters],
      queryFn: fetchRestaurants,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return undefined;

        const match = lastPage.next.match(/page=(\d+)/);
        return match ? Number(match[1]) : undefined;
      },
    });

  const restaurants = data?.pages.flatMap((page) => page.results) || [];

  const renderHeader = () => (
    <>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image source={HeroImage} style={styles.heroImage} />

        {/* Gradient overlay */}
        <LinearGradient
          colors={[
            "rgba(248, 250, 252, 0)",
            "rgba(248, 250, 252, 0.0940881)",
            "#F8FAFC",
          ]}
          locations={[0, 0.5442, 1]}
          style={styles.gradient}
        />

        {/* Filter overlay */}
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{t("restaurantList.title")}</Text>

          {/* Filter Card */}
          <View style={styles.filterCard}>
            {/* Location */}
            <View style={styles.filterRow}>
              <View style={styles.filterItem}>
                <LocationIcon />
                <View style={styles.filterContent}>
                  <Text style={styles.filterLabel}>
                    {t("restaurantList.city")}
                  </Text>
                  <TouchableOpacity
                    style={styles.filterValueContainer}
                    onPress={() => setOpenPicker("city")}
                  >
                    <Text
                      style={[
                        styles.filterValue,
                        !selectedLocation && styles.filterValuePlaceholder,
                      ]}
                      numberOfLines={1}
                    >
                      {cityLabel}
                    </Text>
                    <DropdownArrowIcon />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Date and Time */}
            <View style={styles.filterRowTwoColumns}>
              {/* Date */}
              <View style={[styles.filterItem, styles.filterItemHalf]}>
                <CalendarIcon />
                <View style={styles.filterContent}>
                  <Text style={styles.filterLabel}>
                    {t("restaurantList.date")}
                  </Text>
                  <TouchableOpacity
                    style={styles.filterValueContainer}
                    onPress={() => setOpenPicker("date")}
                  >
                    <Text
                      style={[
                        styles.filterValue,
                        !selectedDate && styles.filterValuePlaceholder,
                      ]}
                      numberOfLines={1}
                    >
                      {dateLabel}
                    </Text>
                    <DropdownArrowIcon />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.columnDivider} />

              {/* Time */}
              <View style={[styles.filterItem, styles.filterItemHalf]}>
                <TimeIcon />
                <View style={styles.filterContent}>
                  <Text style={styles.filterLabel}>
                    {t("restaurantList.time")}
                  </Text>
                  <TouchableOpacity
                    style={styles.filterValueContainer}
                    onPress={() => setOpenPicker("time")}
                  >
                    <Text
                      style={[
                        styles.filterValue,
                        !selectedTime && styles.filterValuePlaceholder,
                      ]}
                      numberOfLines={1}
                    >
                      {timeLabel}
                    </Text>
                    <DropdownArrowIcon />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Guests */}
            <View style={[styles.filterRow, styles.filterRowLast]}>
              <View style={styles.filterItem}>
                <PersonIcon />
                <View style={styles.filterContent}>
                  <Text style={styles.filterLabel}>
                    {t("restaurantList.guest")}
                  </Text>
                  <TouchableOpacity
                    style={styles.filterValueContainer}
                    onPress={() => setOpenPicker("guests")}
                  >
                    <Text
                      style={[
                        styles.filterValue,
                        !selectedGuests && styles.filterValuePlaceholder,
                      ]}
                      numberOfLines={1}
                    >
                      {guestsLabel}
                    </Text>
                    <DropdownArrowIcon />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Search Button */}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleApplyFilters}
            >
              <SearchIcon color={colors.white} />
              <Text style={styles.searchButtonText}>
                {t("restaurantList.search")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <SearchBar
          placeholder={t("home.searchPlaceholder")}
          value={inputValue}
          onChangeText={handleSearch}
        />
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.categoriesSection}
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
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }) => (
          <View style={styles.restaurantCardWrapper}>
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
          </View>
        )}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t("restaurantList.empty")}</Text>
            </View>
          )
        }
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      />

      <OptionPickerModal
        visible={openPicker === "city"}
        title={t("restaurantList.selectCityTitle")}
        options={cityOptions}
        selectedValue={selectedLocation}
        onSelect={setSelectedLocation}
        onClose={() => setOpenPicker(null)}
      />

      <DatePickerModal
        visible={openPicker === "date"}
        selectedDate={selectedDate ?? ""}
        title={t("restaurantList.selectDateTitle")}
        onSelect={setSelectedDate}
        onClose={() => setOpenPicker(null)}
      />

      <TimeSlotModal
        visible={openPicker === "time"}
        title={t("restaurantList.selectTimeTitle")}
        slots={TIME_SLOTS}
        selectedTime={selectedTime}
        loading={false}
        onSelect={setSelectedTime}
        onClose={() => setOpenPicker(null)}
      />

      <OptionPickerModal
        visible={openPicker === "guests"}
        title={t("restaurantList.selectGuestsTitle")}
        options={guestOptions}
        selectedValue={selectedGuests}
        onSelect={setSelectedGuests}
        onClose={() => setOpenPicker(null)}
      />
    </View>
  );
};

export default RestaurantListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    position: "relative",
    width: "100%",
    height: HERO_HEIGHT,
    marginBottom: spacing.sm,
  },
  heroImage: {
    width: width,
    height: HERO_HEIGHT,
    resizeMode: "contain",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: HERO_HEIGHT,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
    justifyContent: "flex-start",
  },
  heroTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.white,
    marginBottom: spacing.lg,
    marginTop: spacing.xl,
  },
  filterCard: {
    borderRadius: borderRadius.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light,
  },
  filterRow: {
    minHeight: 68,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    paddingVertical: spacing.sm,
  },
  filterRowLast: {
    borderBottomWidth: 0,
    minHeight: 60,
  },
  filterRowTwoColumns: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    minHeight: 68,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  filterItemHalf: {
    flex: 1,
  },
  columnDivider: {
    width: 1,
    backgroundColor: colors.light,
    marginHorizontal: spacing.sm,
  },
  filterContent: {
    flex: 1,
    gap: 2,
  },
  filterLabel: {
    fontSize: typography.textXs.fontSize,
    fontWeight: "500",
    color: colors.placeholder,
    textTransform: "uppercase",
  },
  filterValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterValue: {
    fontSize: typography.textSm.fontSize,
    lineHeight: typography.textSm.lineHeight,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    flex: 1,
    marginRight: spacing.xs,
  },
  filterValuePlaceholder: {
    color: colors.placeholder,
    fontWeight: "500",
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
    shadowColor: "#FFCCD3",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 7.5,
    elevation: 10,
  },
  searchButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.white,
    textTransform: "uppercase",
  },
  searchBar: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
  },
  categoriesSection: {
    paddingBottom: spacing.xxl,
    marginHorizontal: spacing.md,
    flexGrow: 0,
  },
  restaurantCardWrapper: {
    marginHorizontal: spacing.md,
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
    paddingHorizontal: spacing.md,
    minHeight: 40,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    backgroundColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light,
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
  emptyState: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    ...typography.button,
    color: colors.gray500,
    textAlign: "center",
  },
});
