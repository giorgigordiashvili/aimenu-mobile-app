import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { textColors } from "../../theme/colors";

interface CardProps {
  /** Restaurant cover image URL */
  imageUrl: string;
  /** Restaurant name */
  title: string;
  /** Cuisine type (e.g., "იტალიური, ქართული") */
  subtitle?: string;
  /** Rating number (e.g., 4.8) */
  rating?: number;
  /** Review count */
  reviewCount?: number;
  /** Price range ("₾", "₾₾", "₾₾₾") */
  priceRange?: string;
  /** Whether restaurant is currently open */
  isOpen?: boolean;
  /** Favorite/heart toggle */
  isFavorite?: boolean;
  /** Callback when card is pressed */
  onPress?: () => void;
  /** Callback when heart is pressed */
  onFavoritePress?: () => void;
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  title,
  subtitle,
  rating,
  reviewCount,
  priceRange,
  isOpen,
  isFavorite = false,
  onPress,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image Section */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favorite Button (top-right) */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
        >
          <Text style={{ fontSize: 20 }}>{isFavorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
        {/* Open/Closed Badge (top-left) */}
        {isOpen !== undefined && (
          <View
            style={[
              styles.statusBadge,
              isOpen ? styles.openBadge : styles.closedBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isOpen ? styles.openText : styles.closedText,
              ]}
            >
              {isOpen ? "ღიაა" : "დაკეტილია"}
            </Text>
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}

        <View style={styles.metaRow}>
          {rating !== undefined && (
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
              {reviewCount !== undefined && (
                <Text style={styles.reviewCount}>({reviewCount})</Text>
              )}
            </View>
          )}

          {priceRange && <Text style={styles.priceRange}>{priceRange}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    position: "relative",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  openBadge: {
    backgroundColor: colors.accentGreenLight,
  },
  closedBadge: {
    backgroundColor: colors.primaryLightest,
  },
  openText: {
    color: colors.accentGreen,
  },
  closedText: {
    color: colors.error2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  infoContainer: {
    padding: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.gray900,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray800,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.gray500,
  },
  priceRange: {
    fontSize: 13,
    fontWeight: "500",
    color: textColors.secondary,
  },
});

export default Card;
