import { TextStyle } from "react-native";

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 24, fontWeight: "500", lineHeight: 36 },
  h2: { fontSize: 20, fontWeight: "500", lineHeight: 25 },
  h3: { fontSize: 18, fontWeight: "500", lineHeight: 20.25 },
  h4: { fontSize: 16, fontWeight: "500", lineHeight: 16 },
  paragraph: { fontSize: 16, fontWeight: "400", lineHeight: 16 },
  textXs: { fontSize: 12, fontWeight: "400", lineHeight: 16 },
  textSm: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
  textBase: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
  textLg: { fontSize: 18, fontWeight: "400", lineHeight: 28 },
  textXl: { fontSize: 20, fontWeight: "400", lineHeight: 28 },
  text2xl: { fontSize: 24, fontWeight: "400", lineHeight: 32 },
};

// Define font weights separately
export const fontWeights = {
  normal: "400" as TextStyle["fontWeight"],
  medium: "500" as TextStyle["fontWeight"],
  semibold: "600" as TextStyle["fontWeight"],
  bold: "700" as TextStyle["fontWeight"],
  extrabold: "800" as TextStyle["fontWeight"],
};
