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
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 300;

export default function MenuItemDetailScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();

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

  const handleAddToCart = () => {
    if (!item || quantity === 0) return;

    const modifiers = Object.entries(selectedModifiers).map(
      ([groupId, modifierId]) => {
        const group = item.modifier_groups.find(
          (g: any) => g.id === Number(groupId),
        );

        const modifier = group?.modifiers.find((m: any) => m.id === modifierId);

        const modifierName =
          modifier?.translations?.[i18n.language]?.name ||
          modifier?.translations?.ka?.name;

        return {
          groupId: Number(groupId),
          modifierId: modifierId,
          name: modifierName,
          price: modifier?.price || 0,
        };
      },
    );

    const itemName =
      item.translations?.[i18n.language]?.name || item.translations?.ka?.name;

    addItem({
      itemId: item.id,
      slug: slug,
      name: itemName,
      price: item.price,
      quantity: quantity,
      image: item.image,
      modifiers,
    });

    router.back();
  };

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
            <BackArrowIcon />
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

      <View style={styles.bottomSection}>
        {quantity === 0 ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setQuantity(1)}
          >
            <Text style={styles.addButtonText}>{t("menuItem.add")}</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.bottomBar}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={decrementQty}
                  style={styles.qtyButton}
                >
                  <Text
                    style={[
                      styles.qtyButtonText,
                      quantity === 1 && styles.qtyButtonTextDisabled,
                    ]}
                  >
                    −
                  </Text>
                </TouchableOpacity>

                <Text style={styles.qtyNumber}>{quantity}</Text>

                <TouchableOpacity
                  onPress={incrementQty}
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.cartButton}
                onPress={handleAddToCart}
              >
                <Text style={styles.cartButtonText}>
                  {t("menuItem.update")}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.addMoreText}>{t("menuItem.addMore")}</Text>
          </>
        )}
      </View>
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

  heroImage: {
    width,
    height: IMAGE_HEIGHT,
  },

  backButton: {
    position: "absolute",
    top: spacing.xxxl,
    left: spacing.md,
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  infoSection: {
    marginTop: -20,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },

  itemName: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },

  itemDescription: {
    fontSize: 14,
    color: colors.gray600,
  },

  modifierSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray500,
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
    color: colors.gray800,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.gray500,
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
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },

  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 16,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    alignItems: "center",
  },

  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },

  bottomSection: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 107,
    height: 52,
    borderWidth: 1,
    borderColor: colors.quantityControlBorder,
    borderRadius: 30,
    paddingHorizontal: spacing.md,
    marginRight: spacing.md,
  },

  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },

  qtyButtonText: {
    fontSize: 30,
    lineHeight: 30,
    color: colors.quantityControlIcon,
  },

  qtyButtonTextDisabled: {
    color: colors.quantityControlIconDisabled,
  },

  qtyNumber: {
    marginHorizontal: spacing.xs,
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
  },

  cartButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.dangerSoftBackground,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  cartButtonText: {
    color: colors.dangerSoftText,
    fontWeight: "600",
  },

  addMoreText: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    textAlign: "center",
    color: colors.gray600,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.15,
  },
});
