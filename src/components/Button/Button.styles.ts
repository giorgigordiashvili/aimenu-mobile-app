// Button.styles.ts
import { StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";

export const sizeStyles = {
  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    height: 36,
    typography: typography.buttonSm,
  },
  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    typography: typography.button,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    height: 52,
    typography: typography.buttonLg,
  },
};

export const variantStyles = {
  primary: {
    container: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.xl,
    },
    text: {
      color: colors.white,
      ...typography.button,
    },
  },

  secondary: {
    container: {
      backgroundColor: colors.grey,
      borderRadius: borderRadius.xl,
    },
    text: {
      color: colors.dark,
      ...typography.button,
    },
  },

  outline: {
    container: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.light,
      borderRadius: borderRadius.md,
    },
    text: {
      color: colors.dark,
      ...typography.button,
    },
  },

  ghost: {
    container: {
      backgroundColor: "transparent",
    },
    text: {
      color: colors.dark,
      ...typography.button,
    },
  },

  danger: {
    container: {
      backgroundColor: colors.error,
      borderRadius: borderRadius.md,
    },
    text: {
      color: colors.white,
      ...typography.button,
    },
  },

  success: {
    container: {
      backgroundColor: colors.greenButtonBackground,
      borderRadius: borderRadius.md,
    },
    text: {
      color: colors.white,
      ...typography.buttonLg,
    },
  },
  dangerSoft: {
    container: {
      backgroundColor: colors.dangerSoftBackground,
      borderRadius: borderRadius.md,
    },
    text: {
      color: colors.dangerSoftText,
      ...typography.button,
    },
  },
};

export const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  fullWidth: {
    width: "100%",
  },

  disabled: {
    opacity: 0.5,
  },

  iconLeft: {
    marginRight: spacing.sm,
  },

  iconRight: {
    marginLeft: spacing.sm,
  },
});
