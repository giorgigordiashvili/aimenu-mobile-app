import { StyleSheet, View } from "react-native";
import { borderRadius, colors, spacing } from "../../theme";

interface Props {
  filled: number;
  total: number;
}

export function PunchDots({ filled, total }: Props) {
  const capped = Math.max(0, Math.min(filled, total));
  const dots = Array.from({ length: total }, (_, i) => i < capped);

  return (
    <View style={styles.row}>
      {dots.map((isFilled, i) => (
        <View
          key={i}
          style={[styles.dot, isFilled ? styles.dotFilled : styles.dotEmpty]}
        />
      ))}
    </View>
  );
}

const DOT_SIZE = 18;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
  },
  dotFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dotEmpty: {
    backgroundColor: "transparent",
    borderColor: colors.light,
  },
});
