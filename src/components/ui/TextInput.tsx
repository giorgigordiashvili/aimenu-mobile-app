import React, { useRef, useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { textColors } from "../../theme/colors";

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  disabled = false,
  inputWrapperStyle,
  containerStyle,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<RNTextInput>(null);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.light;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      )}

      <Pressable
        onPress={() => inputRef.current?.focus()}
        disabled={disabled}
        style={[
          styles.inputWrapper,
          { borderColor: getBorderColor() },
          inputWrapperStyle,
          disabled && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <RNTextInput
          ref={inputRef}
          style={[styles.input, style]}
          editable={!disabled}
          placeholderTextColor={textColors.placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </Pressable>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xmd,
  },
  label: {
    ...typography.textSm,
    color: textColors.primary,
    marginBottom: spacing.xs,
  },
  labelError: {
    color: colors.error,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: borderRadius.md, // 8
    paddingHorizontal: spacing.md, // 16
    height: 48,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    ...typography.textXs,
    color: textColors.primary,
    textAlignVertical: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  leftIcon: {
    marginRight: spacing.xmd,
  },
  rightIcon: {
    marginLeft: spacing.xmd,
  },
  disabled: {
    backgroundColor: colors.state50,
    opacity: 0.6,
  },
  errorText: {
    ...typography.textXs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  hintText: {
    ...typography.textXs,
    color: textColors.secondary,
    marginTop: spacing.xs,
  },
});
