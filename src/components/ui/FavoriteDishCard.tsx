import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { borderRadius, colors, spacing, typography } from "../../theme";

interface Dish {
  id?: number | string;
  name: string;
  image: string;
  restaurant_name?: string;
  price: string | number;
}

interface Props {
  dish: Dish;
  onToggleFavorite?: () => void;
  onPress?: () => void;
}

export default function FavoriteDishCard({
  dish,
  onToggleFavorite,
  onPress,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: dish.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{dish.name}</Text>

        {dish.restaurant_name ? (
          <Text style={styles.restaurant}>{dish.restaurant_name}</Text>
        ) : null}

        <Text style={styles.price}>{dish.price} ₾</Text>
      </View>

      <TouchableOpacity
        onPress={onToggleFavorite}
        style={styles.heartButton}
      >
        <Text style={styles.heart}>❤️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xmd,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: spacing.sm,
  },
  name: {
    ...typography.button,
    fontWeight: "600",
    color: colors.dark,
  },
  restaurant: {
    ...typography.textXs,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  price: {
    ...typography.textBase,
    fontWeight: "600",
    color: colors.dark,
    marginTop: spacing.xs,
  },
  heartButton: {
    padding: spacing.sm,
  },
  heart: {
    fontSize: typography.textLg.fontSize,
  },
});
