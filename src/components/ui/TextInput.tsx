import React, { useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
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
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  disabled = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.light;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          { borderColor: getBorderColor() },
          disabled && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <RNTextInput
          style={[styles.input, style]}
          editable={!disabled}
          placeholderTextColor={textColors.placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
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
    ...typography.textBase,
    color: textColors.primary,
  },
  icon: {
    marginHorizontal: spacing.xs,
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
