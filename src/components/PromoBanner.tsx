import React from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import { borderRadius, spacing, colors, typography } from "../theme";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - spacing.md * 2;
const BANNER_HEIGHT = 157;

interface Props {
  image: string | number;
  title?: string;
  currentIndex?: number;
  totalCount?: number;
}

export const PromoBanner: React.FC<Props> = ({
  image,
  title,
  currentIndex = 0,
  totalCount = 1,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={typeof image === "string" ? { uri: image } : image}
        style={styles.image}
        resizeMode="cover"
      />
      {title ? <Text style={styles.title}>{title}</Text> : null}

      {totalCount > 1 && (
        <View style={styles.dotsContainer}>
          {Array.from({ length: totalCount }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    ...typography.textBase,
    color: colors.white,
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    maxWidth: 156,
    textTransform: "uppercase",
  },
  dotsContainer: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -38.5 }],
    bottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: "center",
    width: 77,
    borderWidth: 1,
    borderColor: colors.grey,
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    backgroundColor: colors.grey,
    opacity: 0.5,
  },
});
