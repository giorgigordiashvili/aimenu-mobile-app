import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { textColors } from "../../theme/colors";
import LocationIcon from "../../assets/icons/LocationIcon";
import ChefIcon from "../../assets/icons/ChefIcon";
import StarIcon from "../../assets/icons/StarIcon";

interface CardProps {
  /** Restaurant cover image URL */
  imageUrl: string;
  /** Restaurant name */
  title: string;
  /** Location/address */
  location?: string;
  /** Restaurant description */
  description?: string;
  /** Array of tags/features */
  tags?: string[];
  /** Rating number (e.g., 4.8) */
  rating?: number;
  /** Cuisine type (e.g., "იტალიური, ქართული") */
  subtitle?: string;
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

export const Card: React.FC<CardProps> = ({
  imageUrl,
  title,
  location,
  description,
  tags,
  rating,
  isOpen,
  isFavorite = false,
  onPress,
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

        {/* Rating Badge (top-right) */}
        {rating !== undefined && rating !== null && !isNaN(Number(rating)) && (
          <View style={styles.ratingBadge}>
            <StarIcon />
            <Text style={styles.ratingBadgeText}>
              {Number(rating).toFixed(1)}
            </Text>
          </View>
        )}
        {/* Open/Closed Badge (top-left) - only if isOpen is defined and true/false */}
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
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {location && (
          <View style={styles.locationRow}>
            <LocationIcon />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        )}

        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        {tags && tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.slice(0, 3).map((tag, index, arr) => (
              <View key={index} style={styles.tag}>
                {index < arr.length - 1 && (
                  <Text style={styles.tagIcon}>
                    <ChefIcon />
                  </Text>
                )}
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {tags.length > 3 && (
              <View style={styles.tag}>
                <Text style={styles.tagsMore}>+{tags.length - 3}</Text>
              </View>
            )}
          </View>
        )}
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
    borderWidth: 1,
    borderColor: colors.light,
  },
  imageWrapper: {
    position: "relative",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  ratingBadgeText: {
    fontSize: typography.rating.fontSize,
    fontWeight: typography.rating.fontWeight,
    color: colors.black,
  },
  statusBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
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
    fontSize: typography.buttonSm.fontSize,
    fontWeight: typography.buttonSm.fontWeight,
  },
  infoContainer: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.black,
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  locationText: {
    fontSize: typography.buttonSm.fontSize,
    fontWeight: typography.buttonSm.fontWeight,
    color: textColors.tertiary,
  },
  description: {
    fontSize: typography.buttonSm.fontSize,
    fontWeight: typography.textXl.fontWeight,
    color: textColors.secondary,
    lineHeight: typography.textXs.lineHeight,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.state100,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    alignContent: "center",
  },
  tagIcon: {
    fontSize: typography.textXs.fontSize,
    color: colors.primary,
  },
  tagText: {
    fontSize: typography.rating.fontSize,
    fontWeight: typography.textXs.fontWeight,
    color: textColors.secondary,
  },
  tagsMore: {
    fontSize: typography.textXs.fontSize,
    fontWeight: typography.textXs.fontWeight,
    color: textColors.secondary,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
});
