import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { borderRadius, colors, spacing, typography } from "../../theme";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 4,
  error,
}) => {
  const inputs = Array.from({ length });
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, idx: number) => {
    let newValue = value.split("");
    newValue[idx] = text[text.length - 1] || "";
    onChange(newValue.join(""));
    if (text && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {inputs.map((_, idx) => (
        <TextInput
          key={idx}
          ref={(ref) => (inputRefs.current[idx] = ref)}
          style={[styles.otpInput, error && styles.otpInputError]}
          keyboardType="number-pad"
          maxLength={1}
          value={value[idx] || ""}
          onChangeText={(text) => handleChange(text, idx)}
          onKeyPress={(e) => handleKeyPress(e, idx)}
          textAlign="center"
          autoFocus={idx === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  otpInput: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: colors.state100,
    fontSize: 44,
    fontWeight: "600",
    color: colors.primary,
    marginHorizontal: spacing.xs,
  },
  otpInputError: {
    borderColor: colors.primary,
    color: colors.primary,
    borderWidth: 1,
  },
});
