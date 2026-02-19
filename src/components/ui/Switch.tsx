import React, { useEffect, useRef } from "react";
import { Pressable, View, StyleSheet, Animated } from "react-native";
import { colors } from "../../theme";

interface SwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled,
}) => {
  const translateX = useRef(new Animated.Value(value ? 22 : 2)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 22 : 2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={[
        styles.track,
        {
          backgroundColor: value ? colors.primary : colors.light,
        },
        disabled && styles.disabled,
      ]}
    >
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    position: "absolute",
  },
  disabled: {
    opacity: 0.5,
  },
});
