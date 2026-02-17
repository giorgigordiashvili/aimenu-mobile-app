export const colors = {
  // Primary
  primary: "#EC003F", // Main brand red
  primaryLight: "#FF1A56",
  primaryDark: "#C70035",

  // Neutral
  white: "#FFFFFF",
  black: "#000000",
  dark: "#0F172B", // Headings, primary text
  darkGrey: "#314158", // Subheadings, secondary text
  state100: "#F1F5F9", // Lightest background
  light: "#E2E8F0", // Borders, dividers
  grey: "#EBEBEB", // Button backgrounds, disabled states
  state50: "#F8FAFC", // Card backgrounds
  yellow: "#F0B100", // Ratings, stars
  success: "#00A63E", // Success messages, indicators
  greenButtonBackground: "#7CCF00", // Green button background
  dangerSoftText: "#FF0000", // Text on red buttons
  dangerSoftBackground: "#FDDEDE", // Background for red buttons
  info: "#0084D1", // Informational messages, accents

  // Error
  error: "#E7000B", // Error messages, indicators
  rose: "#C70036", // Error states, accents

  // Privacy
  privacyBackground: "#ECFCCA", // Privacy policy links, icons
  privacyText: "#3C6300", // Privacy policy text

  // Social
  google: "#4285F4",
  facebook: "#1877F2",
} as const;

// Text colors separated for clarity
export const textColors = {
  primary: colors.dark, // Headings, primary text
  secondary: "#45556C", // Summary text, less prominent
  tertiary: "#62748E", // Tertiary text
  defaultSecondary: "#757575", // Secondary text (default)
  ingredient: "#707070", // Ingredient text
  disabled: "#90A1B9", // Disabled text
  tabs: "#98A2B3", // Tab text
  placeholder: "#717182", // Placeholder text
  privacy: colors.privacyText, // Privacy policy text
  dangerSoft: colors.dangerSoftText, // Text on red buttons
} as const;
