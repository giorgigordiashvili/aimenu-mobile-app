import { StyleSheet, TouchableOpacity, View } from "react-native";
import StarIcon from "../../assets/icons/StarIcon";
import { colors, spacing } from "../../theme";

interface Props {
  value: number;
  size?: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
}

export function StarRating({ value, size = 20, onChange, disabled }: Props) {
  const interactive = !!onChange && !disabled;

  return (
    <View style={[styles.row, { gap: Math.max(2, size / 6) }]}>
      {[1, 2, 3, 4, 5].map((index) => {
        const filled = index <= Math.round(value);
        const star = (
          <StarIcon
            size={size}
            color={filled ? colors.yellow : colors.light}
            filled={filled}
          />
        );
        if (!interactive) {
          return <View key={index}>{star}</View>;
        }
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChange?.(index)}
            activeOpacity={0.7}
            hitSlop={{ top: 4, bottom: 4, left: 2, right: 2 }}
          >
            {star}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
