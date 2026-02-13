import { Text, StyleSheet, View } from "react-native";
import { colors } from "./src/theme/colors";
import { typography } from "./src/theme/typography";

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text
        style={[typography.h1, { color: colors.primary, textAlign: "center" }]}
      >
        Hello, world!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
