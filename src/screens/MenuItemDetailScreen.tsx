import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { colors, spacing, borderRadius } from "../theme";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 300;

export default function MenuItemDetailScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const { slug, itemId } = useLocalSearchParams<{
    slug: string;
    itemId: string;
  }>();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedModifiers, setSelectedModifiers] = useState<
    Record<number, number>
  >({});

  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `https://admin.aimenu.ge/api/v1/restaurants/${slug}/menu/items/${itemId}/`,
        );

        const data = await response.json();

        setItem(data);
      } catch (error) {
        console.error("Failed to fetch menu item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [slug, itemId]);

  const incrementQty = () => setQuantity((q) => q + 1);

  const decrementQty = () => setQuantity((q) => (q > 0 ? q - 1 : 0));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Item not found</Text>
      </View>
    );
  }

  const name =
    item.translations?.[i18n.language]?.name || item.translations?.ka?.name;

  const description =
    item.translations?.[i18n.language]?.description ||
    item.translations?.ka?.description;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO IMAGE */}

        <View>
          <Image
            source={{ uri: item.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        {/* ITEM INFO */}

        <View style={styles.infoSection}>
          <Text style={styles.itemName}>{name}</Text>

          {description ? (
            <Text style={styles.itemDescription}>{description}</Text>
          ) : null}
        </View>

        {/* MODIFIER GROUPS */}

        {item.modifier_groups?.map((group: any) => {
          const groupName =
            group.translations?.[i18n.language]?.name ||
            group.translations?.ka?.name;

          return (
            <View key={group.id} style={styles.modifierSection}>
              <Text style={styles.sectionTitle}>{groupName}</Text>

              {group.modifiers
                .filter((m: any) => m.is_available)
                .map((modifier: any) => {
                  const modifierName =
                    modifier.translations?.[i18n.language]?.name ||
                    modifier.translations?.ka?.name;

                  const isSelected =
                    selectedModifiers[group.id] === modifier.id;

                  return (
                    <TouchableOpacity
                      key={modifier.id}
                      style={styles.modifierRow}
                      onPress={() =>
                        setSelectedModifiers((prev) => ({
                          ...prev,
                          [group.id]: modifier.id,
                        }))
                      }
                    >
                      {/* RADIO BUTTON */}

                      <View
                        style={[
                          styles.radio,
                          isSelected && styles.radioSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>

                      <Text style={styles.modifierName}>{modifierName}</Text>

                      <Text style={styles.modifierPrice}>
                        + {modifier.price} ₾
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          );
        })}
      </ScrollView>

      {/* BOTTOM ACTION BAR */}

      {quantity === 0 ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setQuantity(1)}
        >
          <Text style={styles.addButtonText}>{t("menuItem.add")}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.bottomBar}>
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={decrementQty} style={styles.qtyButton}>
              <Text style={styles.qtyButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.qtyNumber}>{quantity}</Text>

            <TouchableOpacity onPress={incrementQty} style={styles.qtyButton}>
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.cartButtonText}>{t("menuItem.update")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  heroImage: {
    width,
    height: IMAGE_HEIGHT,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  backArrow: {
    fontSize: 20,
  },

  infoSection: {
    padding: spacing.lg,
  },

  itemName: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },

  itemDescription: {
    fontSize: 14,
    color: "#666",
  },

  modifierSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },

  modifierRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },

  modifierName: {
    flex: 1,
    fontSize: 15,
  },

  modifierPrice: {
    fontSize: 14,
    color: "#444",
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },

  radioSelected: {
    borderColor: colors.primary,
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },

  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.md,
  },

  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyButtonText: {
    fontSize: 20,
  },

  qtyNumber: {
    marginHorizontal: spacing.md,
    fontSize: 16,
    fontWeight: "600",
  },

  cartButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
  },

  cartButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
