import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { colors, spacing, typography, borderRadius } from "../theme";

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
  const { slug, categoryId } = useLocalSearchParams<{
    slug: string;
    categoryId: string;
  }>();

  const router = useRouter();
  const { i18n } = useTranslation();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [slug, categoryId]);

  const fetchItems = async () => {
    try {
      const res = await fetch(
        `https://admin.aimenu.ge/api/v1/restaurants/${slug}/menu/items/?category=${categoryId}`,
      );

      const data = await res.json();

      if (data.results) {
        setItems(data.results);
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
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/restaurant/${slug}/item/${item.id}`)}
      >
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>

          {description ? (
            <Text numberOfLines={2} style={styles.description}>
              {description}
            </Text>
          ) : null}

          <Text style={styles.price}>{item.price} ₾</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Menu</Text>
      </View>

      {/* Items list */}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },

  back: {
    fontSize: 24,
    marginRight: spacing.md,
  },

  headerTitle: {
    ...typography.h3,
  },

  list: {
    padding: spacing.md,
  },

  card: {
    flexDirection: "row",
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    overflow: "hidden",
    backgroundColor: colors.white,
  },

  image: {
    width: 90,
    height: 90,
  },

  info: {
    flex: 1,
    padding: spacing.sm,
  },

  name: {
    ...typography.button,
    marginBottom: spacing.xs,
  },

  description: {
    ...typography.textSm,
    color: colors.grey,
    marginBottom: spacing.xs,
  },

  price: {
    ...typography.body,
    fontWeight: "600",
  },
});
